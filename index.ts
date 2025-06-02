// LancerPayBless - Bless Network Integration for Web3Lancer Payment Platform
// This module provides Web3 payment processing capabilities on the Bless Network
// It integrates with the Web2 foundation payment system and mirrors its functionality

declare global {
  interface Console {
    log: (message?: any, ...optionalParams: any[]) => void;
    error: (message?: any, ...optionalParams: any[]) => void;
    warn: (message?: any, ...optionalParams: any[]) => void;
  }
}

// Simple logger implementation for Bless Network environment
const logger = {
  info: (message: string, ...args: any[]) => console.log(`[BLESS-INFO] ${message}`, ...args),
  error: (message: string, ...args: any[]) => console.error(`[BLESS-ERROR] ${message}`, ...args),
  warn: (message: string, ...args: any[]) => console.warn(`[BLESS-WARN] ${message}`, ...args)
};

// Core interfaces mirroring Web2 foundation with Bless Network enhancements
interface Web2PaymentRequest {
  requestId: string;
  fromUserId: string;
  toUserId?: string;
  toEmail?: string;
  tokenId: string;
  amount: string;
  description?: string;
  dueDate?: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  paymentTxId?: string;
  invoiceNumber?: string;
  metadata?: string;
  createdAt: string;
  paidAt?: string;
}

interface BlessPaymentRequest {
  requestId: string;
  amount: string;
  tokenSymbol: 'BLS' | 'USDC' | 'ETH' | 'USDT' | 'BTC';
  fromAddress: string;
  toAddress: string;
  description?: string;
  metadata?: {
    invoiceId?: string;
    clientId?: string;
    projectId?: string;
    milestoneId?: string;
    freelancerId?: string;
    clientAddress?: string;
    workDescription?: string;
    deadlineTimestamp?: number;
    escrowType?: 'milestone' | 'full' | 'partial';
    web2PaymentId?: string;
    web3LancerUserId?: string;
    web2RequestId?: string;
    freelancerProfileUrl?: string;ng;
  };
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  blockHash?: string;
  error?: string;
  gasUsed?: string;
  timestamp: number;
  confirmations: number;
  escrowId?: string;
  networkFee?: string;
}

interface EscrowRequest {
  clientAddress: string;
  freelancerAddress: string;
  amount: string;
  tokenSymbol?: string;
  projectId: string;
  description: string;
  deadlineTimestamp: number;
  disputeResolver?: string;
  milestones?: {
    id: string;
    description: string;
    amount: string;
    deadline: number;
    deliverables: string[];
  }[];
}

interface EscrowResponse {
  success: boolean;
  escrowId?: string;
  contractAddress?: string;
  error?: string;
  transactionId?: string;
  estimatedReleaseDate?: number;
}

interface BlessPaymentRequest {
  requestId: string;
  amount: string;
  tokenSymbol: 'BLS' | 'USDC' | 'ETH' | 'USDT' | 'BTC';
  fromAddress: string;
  toAddress: string;
  description?: string;
  metadata?: {
    invoiceId?: string;
    clientId?: string;
    projectId?: string;
    milestoneId?: string;
    freelancerId?: string;
    clientAddress?: string;
    workDescription?: string;
    deadlineTimestamp?: number;
    escrowType?: 'milestone' | 'full' | 'partial';
    web2PaymentId?: string;
    web3LancerUserId?: string;
    web2RequestId?: string;
    freelancerProfileUrl?: string;
  };
}

// Extended Payment Request for Web2/Web3 bridge
interface BlessExtendedPaymentRequest extends BlessPaymentRequest {
  requestId: string;
  fromUserId: string;
  toUserId?: string;
  toEmail?: string;
  dueDate?: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  paymentTxId?: string;
  invoiceNumber?: string;
  createdAt: string;
  paidAt?: string;
  blessHash?: string;
  escrowId?: string;
  networkFee?: string;
}

interface BlessPaymentResponse {
  success: boolean;
  transactionId?: string;
  blessHash?: string;
  error?: string;
  gasUsed?: number;
  timestamp: number;
  confirmations: number;
  escrowId?: string;
  networkFee?: string;
}

interface FreelancerEscrowRequest {
  clientAddress: string;
  freelancerAddress: string;
  amount: string;
  tokenSymbol: 'BLS' | 'USDC' | 'ETH';
  projectId: string;
  description: string;
  deadlineTimestamp: number;
  disputeResolver?: string;
  milestones?: {
    id: string;
    description: string;
    amount: string;
    deadline: number;
    deliverables: string[];
  }[];
}

interface FreelancerEscrowResponse {
  success: boolean;
  escrowId?: string;
  contractAddress?: string;
  error?: string;
  transactionId?: string;
  estimatedReleaseDate?: number;
}

interface BlessNetworkConfig {
  networkName: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  supportedTokens: {
    symbol: string;
    address: string;
    decimals: number;
  }[];
}

// Bless Network specific interfaces
interface BlessWallet {
  address: string;
  publicKey: string;
  privateKey?: string;
  mnemonic?: string;
  isConnected: boolean;
  balance: {
    [token: string]: string;
  };
}

interface BlessTransaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  tokenSymbol: string;
  type: 'send' | 'receive' | 'swap' | 'escrow';
}

interface BlessEscrowContract {
  address: string;
  clientAddress: string;
  freelancerAddress: string;
  amount: string;
  token: string;
  deadline: number;
  status: 'active' | 'completed' | 'disputed' | 'cancelled';
  milestones: BlessMilestone[];
  createdAt: number;
  updatedAt: number;
}

interface BlessMilestone {
  id: string;
  amount: string;
  deadline: number;
  completed: boolean;
  approved: boolean;
  deliverables: string[];
  submittedAt?: number;
  approvedAt?: number;
}

// Exchange and rate interfaces
interface BlessExchangeRate {
  fromToken: string;
  toToken: string;
  rate: number;
  lastUpdated: number;
  source: string;
}

interface BlessSwapRequest {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  minToAmount: string;
  slippage: number;
  userAddress: string;
}

// Bless Network SDK Implementation
class BlessNetworkSDK {
  private config: BlessNetworkConfig;
  private isInitialized: boolean = false;

  constructor() {
    this.config = {
      networkName: 'Bless Network',
      chainId: 2026,
      rpcUrl: 'https://bless-rpc.alt.technology',
      explorerUrl: 'https://bless.alt.technology',
      nativeCurrency: {
        name: 'Bless',
        symbol: 'BLS',
        decimals: 18
      }
    };
  }

  async initialize(): Promise<void> {
    logger.info('Initializing Bless Network SDK...');
    this.isInitialized = true;
    logger.info('Bless Network SDK initialized successfully');
  }

  getConfig(): BlessNetworkConfig {
    return this.config;
  }

  async getBlockNumber(): Promise<number> {
    // Mock implementation - in real scenario, call Bless Network RPC
    return Math.floor(Date.now() / 1000);
  }

  async getTransactionReceipt(txHash: string): Promise<BlessTransaction | null> {
    // Mock implementation for demonstration
    return {
      hash: txHash,
      blockNumber: await this.getBlockNumber(),
      from: '0x0000000000000000000000000000000000000000',
      to: '0x0000000000000000000000000000000000000001',
      value: '0',
      gasUsed: '21000',
      gasPrice: '20000000000',
      timestamp: Date.now(),
      status: 'success'
    };
  }
}

// Payment Processor for Bless Network
class PaymentProcessor {
  private blessSDK: BlessNetworkSDK;

  constructor(blessSDK: BlessNetworkSDK) {
    this.blessSDK = blessSDK;
  }

  async validatePayment(request: BlessPaymentRequest): Promise<{ isValid: boolean; error?: string }> {
    if (!request.amount || parseFloat(request.amount) <= 0) {
      return { isValid: false, error: 'Invalid amount' };
    }

    if (!request.fromAddress || !request.toAddress) {
      return { isValid: false, error: 'Invalid addresses' };
    }

    if (!['BLS', 'USDC', 'ETH'].includes(request.tokenSymbol)) {
      return { isValid: false, error: 'Unsupported token' };
    }

    return { isValid: true };
  }

  async estimateGas(request: BlessPaymentRequest): Promise<number> {
    // Mock gas estimation
    const baseGas = 21000;
    const tokenGas = request.tokenSymbol === 'BLS' ? 0 : 45000;
    return baseGas + tokenGas;
  }

  async calculateNetworkFee(gasLimit: number): Promise<string> {
    const gasPrice = '20000000000'; // 20 gwei in wei
    const fee = BigInt(gasLimit) * BigInt(gasPrice);
    return fee.toString();
  }
}

// Wallet Manager for Bless Network
class WalletManager {
  private wallets: Map<string, BlessWallet> = new Map();

  async initialize(): Promise<void> {
    logger.info('Initializing Wallet Manager...');
  }

  async createWallet(): Promise<BlessWallet> {
    // Mock wallet creation - in real implementation, use proper crypto libraries
    const wallet: BlessWallet = {
      address: `0x${Math.random().toString(16).substring(2, 42)}`,
      publicKey: `0x${Math.random().toString(16).substring(2, 66)}`,
      privateKey: `0x${Math.random().toString(16).substring(2, 66)}`,
      isConnected: true
    };

    this.wallets.set(wallet.address, wallet);
    logger.info(`Created new wallet: ${wallet.address}`);
    
    return wallet;
  }

  async getWallet(address: string): Promise<BlessWallet | null> {
    return this.wallets.get(address) || null;
  }

  async connectWallet(address: string): Promise<boolean> {
    const wallet = this.wallets.get(address);
    if (wallet) {
      wallet.isConnected = true;
      return true;
    }
    return false;
  }
}

// Transaction Handler for Bless Network
class TransactionHandler {
  private blessSDK: BlessNetworkSDK;

  constructor(blessSDK: BlessNetworkSDK) {
    this.blessSDK = blessSDK;
  }

  async executeTransaction(params: {
    from: string;
    to: string;
    amount: string;
    tokenId: string;
    data?: string;
    metadata?: any;
  }): Promise<BlessTransaction> {
    logger.info(`Executing transaction from ${params.from} to ${params.to}`);

    // Mock transaction execution
    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    const transaction: BlessTransaction = {
      hash: txHash,
      blockNumber: await this.blessSDK.getBlockNumber(),
      from: params.from,
      to: params.to,
      value: params.amount,
      gasUsed: '21000',
      gasPrice: '20000000000',
      timestamp: Date.now(),
      status: 'pending'
    };

    // Simulate transaction confirmation after 3 seconds
    setTimeout(() => {
      transaction.status = 'success';
      logger.info(`Transaction confirmed: ${txHash}`);
    }, 3000);

    return transaction;
  }

  async getTransactionStatus(txHash: string): Promise<{
    status: 'pending' | 'confirmed' | 'failed';
    confirmations: number;
  }> {
    const receipt = await this.blessSDK.getTransactionReceipt(txHash);
    if (!receipt) {
      return { status: 'pending', confirmations: 0 };
    }

    return {
      status: receipt.status === 'success' ? 'confirmed' : 'failed',
      confirmations: receipt.status === 'success' ? 6 : 0
    };
  }
}

// Freelancer Payment Service
class FreelancerPaymentService {
  private blessSDK: BlessNetworkSDK;

  constructor(blessSDK: BlessNetworkSDK) {
    this.blessSDK = blessSDK;
  }

  async initialize(): Promise<void> {
    logger.info('Initializing Freelancer Payment Service...');
  }

  async createEscrowContract(request: FreelancerEscrowRequest): Promise<BlessEscrowContract> {
    logger.info(`Creating escrow contract for project: ${request.projectId}`);

    const contractAddress = `0x${Math.random().toString(16).substring(2, 42)}`;
    const milestones: BlessMilestone[] = request.milestones?.map(m => ({
      id: m.id,
      amount: m.amount,
      deadline: m.deadline,
      completed: false,
      approved: false,
      deliverables: m.deliverables
    })) || [];

    return {
      address: contractAddress,
      clientAddress: request.clientAddress,
      freelancerAddress: request.freelancerAddress,
      amount: request.amount,
      token: request.tokenSymbol,
      deadline: request.deadlineTimestamp,
      status: 'active',
      milestones
    };
  }

  async releaseMilestonePayment(escrowId: string, milestoneId: string): Promise<BlessTransaction> {
    logger.info(`Releasing milestone payment: ${milestoneId} for escrow: ${escrowId}`);

    return {
      hash: `0x${Math.random().toString(16).substring(2, 66)}`,
      blockNumber: await this.blessSDK.getBlockNumber(),
      from: escrowId,
      to: '0x0000000000000000000000000000000000000000',
      value: '0',
      gasUsed: '45000',
      gasPrice: '20000000000',
      timestamp: Date.now(),
      status: 'pending'
    };
  }
}

// Escrow Service
class EscrowService {
  private blessSDK: BlessNetworkSDK;
  private escrows: Map<string, BlessEscrowContract> = new Map();

  constructor(blessSDK: BlessNetworkSDK) {
    this.blessSDK = blessSDK;
  }

  async initialize(): Promise<void> {
    logger.info('Initializing Escrow Service...');
  }

  async createEscrow(request: FreelancerEscrowRequest): Promise<string> {
    const escrowId = `escrow_${Math.random().toString(36).substring(2, 15)}`;
    const contract: BlessEscrowContract = {
      address: `0x${Math.random().toString(16).substring(2, 42)}`,
      clientAddress: request.clientAddress,
      freelancerAddress: request.freelancerAddress,
      amount: request.amount,
      token: request.tokenSymbol,
      deadline: request.deadlineTimestamp,
      status: 'active',
      milestones: request.milestones?.map(m => ({
        id: m.id,
        amount: m.amount,
        deadline: m.deadline,
        completed: false,
        approved: false,
        deliverables: m.deliverables
      })) || []
    };

    this.escrows.set(escrowId, contract);
    logger.info(`Created escrow contract: ${escrowId}`);
    
    return escrowId;
  }

  async getEscrowStatus(escrowId: string): Promise<{
    status: 'active' | 'completed' | 'disputed' | 'cancelled';
    balance: string;
    milestones: any[];
  }> {
    const escrow = this.escrows.get(escrowId);
    if (!escrow) {
      throw new Error('Escrow not found');
    }

    return {
      status: escrow.status,
      balance: escrow.amount,
      milestones: escrow.milestones
    };
  }

  async releaseEscrow(escrowId: string): Promise<BlessTransaction> {
    const escrow = this.escrows.get(escrowId);
    if (!escrow) {
      throw new Error('Escrow not found');
    }

    escrow.status = 'completed';
    logger.info(`Released escrow: ${escrowId}`);

    return {
      hash: `0x${Math.random().toString(16).substring(2, 66)}`,
      blockNumber: await this.blessSDK.getBlockNumber(),
      from: escrow.address,
      to: escrow.freelancerAddress,
      value: escrow.amount,
      gasUsed: '45000',
      gasPrice: '20000000000',
      timestamp: Date.now(),
      status: 'pending'
    };
  }
}

// Main LancerPayBless Class
class LancerPayBless {
  private blessSDK: BlessNetworkSDK;
  private paymentProcessor: PaymentProcessor;
  private walletManager: WalletManager;
  private transactionHandler: TransactionHandler;
  private freelancerPaymentService: FreelancerPaymentService;
  private escrowService: EscrowService;

  constructor() {
    this.blessSDK = new BlessNetworkSDK();
    this.walletManager = new WalletManager();
    this.paymentProcessor = new PaymentProcessor(this.blessSDK);
    this.transactionHandler = new TransactionHandler(this.blessSDK);
    this.freelancerPaymentService = new FreelancerPaymentService(this.blessSDK);
    this.escrowService = new EscrowService(this.blessSDK);
  }

  async initialize(): Promise<void> {
    try {
      await this.blessSDK.initialize();
      await this.walletManager.initialize();
      await this.freelancerPaymentService.initialize();
      await this.escrowService.initialize();
      logger.info('LancerPayBless initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize LancerPayBless:', error);
      throw error;
    }
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      logger.info('Processing payment request:', request);

      // Validate payment request
      const validation = await this.paymentProcessor.validatePayment(request);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || 'Invalid payment request',
          timestamp: Date.now(),
          confirmations: 0
        };
      }

      // Check if this is a freelancer payment with escrow
      if (request.metadata?.freelancerId && request.metadata?.clientAddress) {
        return await this.processFreelancerPayment(request);
      }

      // Execute regular payment transaction
      const transaction = await this.transactionHandler.executeTransaction({
        from: request.fromAddress,
        to: request.toAddress,
        amount: request.amount,
        tokenId: request.tokenId,
        data: request.description || '',
        metadata: request.metadata
      });

      return {
        success: true,
        transactionId: transaction.hash,
        blockHash: transaction.blockHash,
        gasUsed: transaction.gasUsed,
        timestamp: Date.now(),
        confirmations: 0
      };

    } catch (error) {
      logger.error('Payment processing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        confirmations: 0
      };
    }
  }

  async processFreelancerPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      logger.info('Processing freelancer payment with escrow:', request);

      const escrowRequest: EscrowRequest = {
        clientAddress: request.metadata?.clientAddress || request.fromAddress,
        freelancerAddress: request.toAddress,
        amount: request.amount,
        projectId: request.metadata?.projectId || 'default',
        description: request.description || 'Freelancer payment',
        deadlineTimestamp: request.metadata?.deadlineTimestamp || Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days default
      };

      const escrowResult = await this.createEscrow(escrowRequest);
      
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

    } catch (error) {
      logger.error('Freelancer payment processing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        confirmations: 0
      };
    }
  }

  async createEscrow(request: EscrowRequest): Promise<EscrowResponse> {
    try {
      logger.info('Creating escrow contract:', request);
      
      const escrowResult = await this.escrowService.createEscrow(request);
      
      return {
        success: true,
        escrowId: escrowResult.escrowId,
        contractAddress: escrowResult.contractAddress,
        transactionId: escrowResult.transactionId
      };

    } catch (error) {
      logger.error('Escrow creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create escrow'
      };
    }
  }

  async releaseEscrow(escrowId: string, milestoneId?: string): Promise<PaymentResponse> {
    try {
      logger.info('Releasing escrow:', { escrowId, milestoneId });
      
      const result = await this.escrowService.releaseEscrow(escrowId);
      
      return {
        success: true,
        transactionId: result.hash,
        timestamp: Date.now(),
        confirmations: 0
      };

    } catch (error) {
      logger.error('Escrow release failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to release escrow',
        timestamp: Date.now(),
        confirmations: 0
      };
    }
  }

  async getPaymentStatus(requestId: string): Promise<{ status: string; transaction?: BlessTransaction }> {
    try {
      const status = await this.transactionHandler.getTransactionStatus(requestId);
      return { status: status.status };
    } catch (error) {
      logger.error('Failed to get payment status:', error);
      return { status: 'unknown' };
    }
  }

  async createWallet(): Promise<BlessWallet> {
    return await this.walletManager.createWallet();
  }

  async getWallet(address: string): Promise<BlessWallet | null> {
    return await this.walletManager.getWallet(address);
  }

  async connectWallet(address: string): Promise<boolean> {
    return await this.walletManager.connectWallet(address);
  }

  async estimateGas(request: BlessPaymentRequest): Promise<number> {
    return await this.paymentProcessor.estimateGas(request);
  }

  async calculateNetworkFee(gasLimit: number): Promise<string> {
    return await this.paymentProcessor.calculateNetworkFee(gasLimit);
  }

  async createFreelancerEscrow(request: FreelancerEscrowRequest): Promise<FreelancerEscrowResponse> {
    try {
      const contract = await this.freelancerPaymentService.createEscrowContract(request);
      
      return {
        success: true,
        escrowId: contract.address,
        contractAddress: contract.address,
        transactionId: `0x${Math.random().toString(16).substring(2, 66)}`,
        estimatedReleaseDate: contract.deadline
      };
    } catch (error) {
      logger.error('Freelancer escrow creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create freelancer escrow'
      };
    }
  }

  async releaseMilestone(escrowId: string, milestoneId: string): Promise<BlessPaymentResponse> {
    try {
      const transaction = await this.freelancerPaymentService.releaseMilestonePayment(escrowId, milestoneId);
      
      return {
        success: true,
        transactionId: transaction.hash,
        blessHash: transaction.hash,
        timestamp: Date.now(),
        confirmations: 0
      };
    } catch (error) {
      logger.error('Milestone release failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to release milestone',
        timestamp: Date.now(),
        confirmations: 0
      };
    }
  }

  getConfig(): BlessNetworkConfig {
    return this.blessSDK.getConfig();
  }

  async getBlockNumber(): Promise<number> {
    return await this.blessSDK.getBlockNumber();
  }

  async getTransactionReceipt(txHash: string): Promise<BlessTransaction | null> {
    return await this.blessSDK.getTransactionReceipt(txHash);
  }
}

// Web2/Web3 Bridge Service
class Web2Web3Bridge {
  private lancerPayBless: LancerPayBless;

  constructor(lancerPayBless: LancerPayBless) {
    this.lancerPayBless = lancerPayBless;
  }

  async processWeb2PaymentRequest(web2RequestId: string, blessPaymentData: BlessPaymentRequest): Promise<BlessPaymentResponse> {
    try {
      logger.info('Processing Web2 payment request via Bless Network:', { web2RequestId, blessPaymentData });

      // Add Web2 metadata to Bless payment
      const enhancedRequest: PaymentRequest = {
        amount: blessPaymentData.amount,
        tokenId: blessPaymentData.tokenSymbol.toLowerCase(),
        fromAddress: blessPaymentData.fromAddress,
        toAddress: blessPaymentData.toAddress,
        description: blessPaymentData.description,
        metadata: {
          ...blessPaymentData.metadata,
          web2RequestId,
          web3LancerUserId: blessPaymentData.metadata?.web3LancerUserId
        }
      };

      const result = await this.lancerPayBless.processPayment(enhancedRequest);

      return {
        success: result.success,
        transactionId: result.transactionId,
        blessHash: result.transactionId,
        error: result.error,
        timestamp: result.timestamp,
        confirmations: result.confirmations,
        escrowId: result.escrowId,
        networkFee: result.networkFee
      };
    } catch (error) {
      logger.error('Web2/Web3 bridge processing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bridge processing failed',
        timestamp: Date.now(),
        confirmations: 0
      };
    }
  }

  async syncPaymentStatus(web2RequestId: string, blessTransactionHash: string): Promise<boolean> {
    try {
      const receipt = await this.lancerPayBless.getTransactionReceipt(blessTransactionHash);
      if (receipt) {
        logger.info('Payment status synced:', { web2RequestId, status: receipt.status });
        return receipt.status === 'confirmed';
      }
      return false;
    } catch (error) {
      logger.error('Failed to sync payment status:', error);
      return false;
    }
  }
}

// Export the main class and utilities
export {
  LancerPayBless,
  BlessNetworkSDK,
  PaymentProcessor,
  WalletManager,
  TransactionHandler,
  FreelancerPaymentService,
  EscrowService,
  Web2Web3Bridge,
  logger
};

// Default export for the main integration
export default LancerPayBless;

// Initialize and export a singleton instance for immediate use
let blessInstance: LancerPayBless | null = null;

export const getBlessInstance = async (): Promise<LancerPayBless> => {
  if (!blessInstance) {
    blessInstance = new LancerPayBless();
    await blessInstance.initialize();
  }
  return blessInstance;
};

// Utility functions for common operations
export const createBlessPayment = async (request: BlessPaymentRequest): Promise<BlessPaymentResponse> => {
  const instance = await getBlessInstance();
  const paymentRequest: PaymentRequest = {
    amount: request.amount,
    tokenId: request.tokenSymbol.toLowerCase(),
    fromAddress: request.fromAddress,
    toAddress: request.toAddress,
    description: request.description,
    metadata: request.metadata
  };

  const result = await instance.processPayment(paymentRequest);
  
  return {
    success: result.success,
    transactionId: result.transactionId,
    blessHash: result.transactionId,
    error: result.error,
    timestamp: result.timestamp,
    confirmations: result.confirmations,
    escrowId: result.escrowId,
    networkFee: result.networkFee
  };
};

export const createFreelancerPayment = async (request: FreelancerEscrowRequest): Promise<FreelancerEscrowResponse> => {
  const instance = await getBlessInstance();
  return await instance.createFreelancerEscrow(request);
};

// Entry point for the Bless function
async function main() {
  try {
    logger.info('Starting LancerPayBless initialization...');
    
    const bless = await getBlessInstance();
    logger.info('LancerPayBless initialized successfully');
    
    // Example usage
    const sampleWallet = await bless.createWallet();
    logger.info('Sample wallet created:', sampleWallet.address);
    
    logger.info('LancerPayBless is ready for Web3Lancer payments on Bless Network');
    
    return {
      success: true,
      message: 'LancerPayBless initialized successfully',
      config: bless.getConfig(),
      sampleWallet: sampleWallet.address
    };
  } catch (error) {
    logger.error('Failed to initialize LancerPayBless:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown initialization error'
    };
  }
}

// Run the main function if this is the entry point
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  main().then(result => {
    console.log('LancerPayBless Result:', result);
  }).catch(error => {
    console.error('LancerPayBless Error:', error);
  });
}
      
      return {
        success: true,
        transactionId: result.transactionId,
        timestamp: Date.now(),
        confirmations: 0
      };

    } catch (error) {
      logger.error('Escrow release failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to release escrow',
        timestamp: Date.now(),
        confirmations: 0
      };
    }
  }

  async getPaymentStatus(transactionId: string): Promise<{
    status: 'pending' | 'confirmed' | 'failed';
    confirmations: number;
  }> {
    return await this.transactionHandler.getTransactionStatus(transactionId);
  }

  async createWallet(type: 'hot' | 'cold' = 'hot'): Promise<{
    address: string;
    publicKey: string;
    mnemonic?: string;
  }> {
    return await this.walletManager.createWallet(type);
  }

  async getEscrowStatus(escrowId: string): Promise<{
    status: 'active' | 'completed' | 'disputed' | 'cancelled';
    balance: string;
    milestones: any[];
  }> {
    return await this.escrowService.getEscrowStatus(escrowId);
  }
}

// Main execution function
async function main() {
  const lancerPay = new LancerPayBless();
  
  try {
    await lancerPay.initialize();
    
    // Example payment processing
    const paymentRequest: PaymentRequest = {
      amount: "0.001",
      tokenId: "BLS",
      fromAddress: "bless1example123...",
      toAddress: "bless1example456...",
      description: "Freelancer payment for web development"
    };

    const result = await lancerPay.processPayment(paymentRequest);
    logger.info('Payment result:', result);

    if (result.success) {
      logger.info(`Payment successful! Transaction ID: ${result.transactionId}`);
    } else {
      logger.error(`Payment failed: ${result.error}`);
    }

  } catch (error) {
    logger.error('Application error:', error);
    process.exit(1);
  }
}

// Export for external usage
export { LancerPayBless, PaymentRequest, PaymentResponse };

// Run if this is the main module
if (require.main === module) {
  main().catch(console.error);
}