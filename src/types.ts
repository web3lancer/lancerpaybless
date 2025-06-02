// All interfaces and types used across the modules

export interface Web2PaymentRequest {
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

export interface BlessPaymentRequest {
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

export interface BlessPaymentResponse {
  success: boolean;
  transactionId?: string;
  blessHash?: string;
  error?: string;
  gasUsed?: string;
  timestamp: number;
  confirmations: number;
  escrowId?: string;
  networkFee?: string;
}

export interface BlessEscrowRequest {
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

export interface BlessEscrowResponse {
  success: boolean;
  escrowId?: string;
  contractAddress?: string;
  error?: string;
  transactionId?: string;
  estimatedReleaseDate?: number;
}

export interface BlessNetworkConfig {
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

export interface BlessWallet {
  address: string;
  publicKey: string;
  privateKey?: string;
  mnemonic?: string;
  isConnected: boolean;
  balance: {
    [token: string]: string;
  };
}

export interface BlessTransaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  tokenSymbol?: string;
  type?: 'send' | 'receive' | 'swap' | 'escrow';
}

export interface BlessEscrowContract {
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

export interface BlessMilestone {
  id: string;
  amount: string;
  deadline: number;
  completed: boolean;
  approved: boolean;
  deliverables: string[];
  submittedAt?: number;
  approvedAt?: number;
}
