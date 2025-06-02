import { Web2PaymentRequest, BlessPaymentRequest, BlessPaymentResponse } from './types';
import { BlessNetworkSDK } from './sdk';
import { BlessPaymentProcessor } from './paymentProcessor';
import { BlessEscrowService } from './escrowService';
import logger from './logger';

interface Web2PayAppAPI {
  baseUrl: string;
  apiKey?: string;
}

interface BridgeConfig {
  web2PayApp: Web2PayAppAPI;
  autoProcessEscrow: boolean;
  defaultEscrowDuration: number; // days
}

export class LancerPayBridge {
  private sdk: BlessNetworkSDK;
  private paymentProcessor: BlessPaymentProcessor;
  private escrowService: BlessEscrowService;
  private config: BridgeConfig;

  constructor(config: BridgeConfig) {
    this.config = config;
    this.sdk = new BlessNetworkSDK();
    this.paymentProcessor = new BlessPaymentProcessor(this.sdk);
    this.escrowService = new BlessEscrowService(this.sdk);
  }

  async initialize(): Promise<void> {
    await this.sdk.initialize();
    logger.info('LancerPay Bridge initialized successfully');
  }

  /**
   * Sync Web2 payment request to Bless Network
   */
  async syncWeb2PaymentRequest(web2RequestId: string): Promise<BlessPaymentResponse> {
    try {
      // Fetch Web2 payment request
      const web2Request = await this.fetchWeb2PaymentRequest(web2RequestId);
      
      // Convert to Bless payment request
      const blessRequest = this.convertWeb2ToBlessRequest(web2Request);
      
      // Process on Bless Network
      const result = await this.processOnBlessNetwork(blessRequest);
      
      // Update Web2 system with Bless transaction info
      if (result.success) {
        await this.updateWeb2PaymentStatus(web2RequestId, {
          status: 'processing',
          blessTransactionId: result.transactionId,
          blessHash: result.blessHash,
          networkFee: result.networkFee
        });
      }
      
      return result;
    } catch (error) {
      logger.error('Failed to sync Web2 payment request:', error);
      throw error;
    }
  }

  /**
   * Handle incoming Bless Network payment and sync to Web2
   */
  async handleBlessPayment(blessPayment: BlessPaymentRequest): Promise<void> {
    try {
      // Check if this payment has Web2 metadata
      if (blessPayment.metadata?.web2PaymentId) {
        const web2PaymentId = blessPayment.metadata.web2PaymentId;
        
        // Process payment on Bless Network
        const result = await this.paymentProcessor.processDirectPayment(blessPayment);
        
        if (result.success) {
          // Update Web2 system
          await this.updateWeb2PaymentStatus(web2PaymentId, {
            status: 'paid',
            blessTransactionId: result.transactionId,
            paidAt: new Date().toISOString()
          });
          
          logger.info(`Synchronized Bless payment ${result.transactionId} with Web2 payment ${web2PaymentId}`);
        }
      }
    } catch (error) {
      logger.error('Failed to handle Bless payment:', error);
      throw error;
    }
  }

  /**
   * Create freelancer escrow from Web2 payment request
   */
  async createFreelancerEscrow(web2RequestId: string, freelancerData: {
    freelancerAddress: string;
    projectId: string;
    milestones?: Array<{
      id: string;
      description: string;
      amount: string;
      deadline: number;
      deliverables: string[];
    }>;
  }): Promise<BlessPaymentResponse> {
    try {
      const web2Request = await this.fetchWeb2PaymentRequest(web2RequestId);
      
      const escrowRequest = {
        clientAddress: freelancerData.freelancerAddress, // Client pays to escrow
        freelancerAddress: freelancerData.freelancerAddress,
        amount: web2Request.amount,
        tokenSymbol: this.mapTokenSymbol(web2Request.tokenId) as 'BLS' | 'USDC' | 'ETH',
        projectId: freelancerData.projectId,
        description: web2Request.description || 'Freelancer project payment',
        deadlineTimestamp: web2Request.dueDate ? 
          new Date(web2Request.dueDate).getTime() : 
          Date.now() + (this.config.defaultEscrowDuration * 24 * 60 * 60 * 1000),
        milestones: freelancerData.milestones
      };
      
      const escrowResult = await this.escrowService.createEscrow(escrowRequest);
      
      if (escrowResult.success) {
        // Update Web2 system with escrow info
        await this.updateWeb2PaymentStatus(web2RequestId, {
          status: 'escrowed',
          escrowId: escrowResult.escrowId,
          escrowAddress: escrowResult.contractAddress,
          metadata: JSON.stringify({
            projectId: freelancerData.projectId,
            escrowType: 'freelancer',
            blessNetwork: true
          })
        });
      }
      
      return {
        success: escrowResult.success,
        transactionId: escrowResult.transactionId,
        escrowId: escrowResult.escrowId,
        timestamp: Date.now(),
        confirmations: 0,
        error: escrowResult.error
      };
    } catch (error) {
      logger.error('Failed to create freelancer escrow:', error);
      throw error;
    }
  }

  /**
   * Release escrow payment to freelancer
   */
  async releaseFreelancerPayment(escrowId: string, milestoneId?: string): Promise<void> {
    try {
      const transaction = milestoneId ? 
        await this.escrowService.releaseMilestone(escrowId, milestoneId) :
        await this.escrowService.releaseEscrow(escrowId);
      
      logger.info(`Released ${milestoneId ? 'milestone' : 'full'} payment from escrow ${escrowId}`);
      
      // Optionally sync back to Web2 system
      await this.notifyWeb2EscrowRelease(escrowId, transaction.hash, milestoneId);
    } catch (error) {
      logger.error('Failed to release freelancer payment:', error);
      throw error;
    }
  }

  // Private helper methods
  private convertWeb2ToBlessRequest(web2Request: Web2PaymentRequest): BlessPaymentRequest {
    return {
      requestId: web2Request.requestId,
      amount: web2Request.amount,
      tokenSymbol: this.mapTokenSymbol(web2Request.tokenId) as 'BLS' | 'USDC' | 'ETH' | 'USDT' | 'BTC',
      fromAddress: '', // To be filled by caller
      toAddress: '', // To be filled by caller
      description: web2Request.description,
      metadata: {
        web2PaymentId: web2Request.requestId,
        web2RequestId: web2Request.requestId,
        invoiceId: web2Request.invoiceNumber,
        web3LancerUserId: web2Request.fromUserId
      }
    };
  }

  private mapTokenSymbol(tokenId: string): string {
    const mapping: Record<string, string> = {
      'btc': 'BTC',
      'eth': 'ETH',
      'usdc': 'USDC',
      'usdt': 'USDT',
      'bls': 'BLS'
    };
    return mapping[tokenId.toLowerCase()] || tokenId.toUpperCase();
  }

  private async fetchWeb2PaymentRequest(requestId: string): Promise<Web2PaymentRequest> {
    const response = await fetch(`${this.config.web2PayApp.baseUrl}/api/payment-requests/${requestId}`, {
      headers: {
        'Authorization': `Bearer ${this.config.web2PayApp.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Web2 payment request: ${response.statusText}`);
    }
    
    return response.json();
  }

  private async updateWeb2PaymentStatus(requestId: string, updates: any): Promise<void> {
    const response = await fetch(`${this.config.web2PayApp.baseUrl}/api/payment-requests/${requestId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.config.web2PayApp.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update Web2 payment status: ${response.statusText}`);
    }
  }

  private async notifyWeb2EscrowRelease(escrowId: string, transactionHash: string, milestoneId?: string): Promise<void> {
    const response = await fetch(`${this.config.web2PayApp.baseUrl}/api/escrow/release`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.web2PayApp.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        escrowId,
        transactionHash,
        milestoneId,
        network: 'bless',
        timestamp: Date.now()
      })
    });
    
    if (!response.ok) {
      logger.warn(`Failed to notify Web2 of escrow release: ${response.statusText}`);
    }
  }

  private async processOnBlessNetwork(blessRequest: BlessPaymentRequest): Promise<BlessPaymentResponse> {
    // Determine if this should be an escrow or direct payment
    if (blessRequest.metadata?.escrowType || blessRequest.metadata?.freelancerId) {
      return await this.processEscrowPayment(blessRequest);
    }
    
    return await this.paymentProcessor.processDirectPayment(blessRequest);
  }

  private async processEscrowPayment(request: BlessPaymentRequest): Promise<BlessPaymentResponse> {
    const escrowRequest = {
      clientAddress: request.fromAddress,
      freelancerAddress: request.toAddress,
      amount: request.amount,
      tokenSymbol: request.tokenSymbol as 'BLS' | 'USDC' | 'ETH',
      projectId: request.metadata?.projectId || `project_${Date.now()}`,
      description: request.description || 'Payment via LancerPay Bridge',
      deadlineTimestamp: request.metadata?.deadlineTimestamp || 
        Date.now() + (this.config.defaultEscrowDuration * 24 * 60 * 60 * 1000)
    };
    
    const escrowResult = await this.escrowService.createEscrow(escrowRequest);
    
    return {
      success: escrowResult.success,
      transactionId: escrowResult.transactionId,
      escrowId: escrowResult.escrowId,
      timestamp: Date.now(),
      confirmations: 0,
      error: escrowResult.error
    };
  }
}