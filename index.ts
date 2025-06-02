// LancerPayBless - Bless Network Integration for Web3Lancer Payment Platform
// This module provides Web3 payment processing capabilities on the Bless Network
// It integrates with the Web2 foundation payment system and mirrors its functionality

import logger from './src/logger';
import { BlessNetworkSDK } from './src/sdk';
import { BlessPaymentProcessor } from './src/paymentProcessor';
import { BlessWalletManager } from './src/walletManager';
import { BlessEscrowService } from './src/escrowService';
import { LancerPayBridge } from './src/bridge';
import {
  Web2PaymentRequest,
  BlessPaymentRequest,
  BlessPaymentResponse,
  BlessMilestone,
  BlessNetworkConfig
} from './src/types';

// Main LancerPayBless Service
export class LancerPayBless {
  private sdk: BlessNetworkSDK;
  private paymentProcessor: BlessPaymentProcessor;
  private walletManager: BlessWalletManager;
  private escrowService: BlessEscrowService;
  private bridge?: LancerPayBridge;

  constructor(bridgeConfig?: {
    web2PayApp: { baseUrl: string; apiKey?: string };
    autoProcessEscrow?: boolean;
    defaultEscrowDuration?: number;
  }) {
    this.sdk = new BlessNetworkSDK();
    this.paymentProcessor = new BlessPaymentProcessor(this.sdk);
    this.walletManager = new BlessWalletManager();
    this.escrowService = new BlessEscrowService(this.sdk);
    
    if (bridgeConfig) {
      this.bridge = new LancerPayBridge({
        web2PayApp: bridgeConfig.web2PayApp,
        autoProcessEscrow: bridgeConfig.autoProcessEscrow ?? true,
        defaultEscrowDuration: bridgeConfig.defaultEscrowDuration ?? 30
      });
    }
  }

  async initialize(): Promise<void> {
    await this.sdk.initialize();
    if (this.bridge) {
      await this.bridge.initialize();
    }
    logger.info('LancerPayBless initialized successfully');
  }

  async processPayment(request: BlessPaymentRequest): Promise<BlessPaymentResponse> {
    logger.info('Processing payment request:', request.requestId);
    if (request.metadata?.escrowType || request.metadata?.freelancerId) {
      return await this.processEscrowPayment(request);
    }
    return await this.paymentProcessor.processDirectPayment(request);
  }

  private async processEscrowPayment(request: BlessPaymentRequest): Promise<BlessPaymentResponse> {
    const escrowRequest = {
      clientAddress: request.fromAddress,
      freelancerAddress: request.toAddress,
      amount: request.amount,
      tokenSymbol: request.tokenSymbol as 'BLS' | 'USDC' | 'ETH',
      projectId: request.metadata?.projectId || `project_${Date.now()}`,
      description: request.description || 'Freelancer payment',
      deadlineTimestamp: request.metadata?.deadlineTimestamp || Date.now() + (30 * 24 * 60 * 60 * 1000)
    };
    const escrowResult = await this.escrowService.createEscrow(escrowRequest);
    if (!escrowResult.success) {
      return {
        success: false,
        error: escrowResult.error || 'Failed to create escrow',
        timestamp: Date.now(),
        confirmations: 0
      };
    }
    return {
      success: true,
      transactionId: escrowResult.transactionId,
      escrowId: escrowResult.escrowId,
      timestamp: Date.now(),
      confirmations: 0
    };
  }

  async createWallet(): Promise<{ address: string; publicKey: string; mnemonic?: string }> {
    const wallet = await this.walletManager.createWallet();
    return {
      address: wallet.address,
      publicKey: wallet.publicKey,
      mnemonic: wallet.mnemonic
    };
  }

  async getPaymentStatus(transactionId: string): Promise<{ status: 'pending' | 'confirmed' | 'failed'; confirmations: number }> {
    const receipt = await this.sdk.getTransactionReceipt(transactionId);
    if (!receipt) {
      return { status: 'pending', confirmations: 0 };
    }
    return {
      status: receipt.status,
      confirmations: receipt.status === 'confirmed' ? 6 : 0
    };
  }

  async getEscrowStatus(escrowId: string): Promise<{ status: 'active' | 'completed' | 'disputed' | 'cancelled'; balance: string; milestones: BlessMilestone[] }> {
    return await this.escrowService.getEscrowStatus(escrowId);
  }

  async bridgeWeb2PaymentRequest(web2Request: Web2PaymentRequest): Promise<BlessPaymentRequest> {
    return {
      requestId: web2Request.requestId,
      amount: web2Request.amount,
      tokenSymbol: web2Request.tokenId.toUpperCase() as 'BLS' | 'USDC' | 'ETH' | 'USDT' | 'BTC',
      fromAddress: '',
      toAddress: '',
      description: web2Request.description,
      metadata: {
        web2PaymentId: web2Request.requestId,
        web2RequestId: web2Request.requestId,
        invoiceId: web2Request.invoiceNumber
      }
    };
  }

  getNetworkConfig(): BlessNetworkConfig {
    return this.sdk.getConfig();
  }

  // Bridge methods for Web2 integration
  async syncWeb2Payment(web2RequestId: string): Promise<BlessPaymentResponse> {
    if (!this.bridge) {
      throw new Error('Bridge not configured. Initialize with bridgeConfig to use Web2 integration.');
    }
    return await this.bridge.syncWeb2PaymentRequest(web2RequestId);
  }

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
    if (!this.bridge) {
      throw new Error('Bridge not configured. Initialize with bridgeConfig to use Web2 integration.');
    }
    return await this.bridge.createFreelancerEscrow(web2RequestId, freelancerData);
  }

  async releaseFreelancerPayment(escrowId: string, milestoneId?: string): Promise<void> {
    if (!this.bridge) {
      throw new Error('Bridge not configured. Initialize with bridgeConfig to use Web2 integration.');
    }
    return await this.bridge.releaseFreelancerPayment(escrowId, milestoneId);
  }

  async handleIncomingBlessPayment(blessPayment: BlessPaymentRequest): Promise<void> {
    if (!this.bridge) {
      throw new Error('Bridge not configured. Initialize with bridgeConfig to use Web2 integration.');
    }
    return await this.bridge.handleBlessPayment(blessPayment);
  }
}

export default LancerPayBless;

const lancerPayBless = new LancerPayBless();
export { lancerPayBless };