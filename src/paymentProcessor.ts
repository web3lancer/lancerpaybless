import { BlessPaymentRequest, BlessPaymentResponse } from './types';
import { BlessNetworkSDK } from './sdk';
import logger from './logger';

export class BlessPaymentProcessor {
  private sdk: BlessNetworkSDK;

  constructor(sdk: BlessNetworkSDK) {
    this.sdk = sdk;
  }

  async validatePayment(request: BlessPaymentRequest): Promise<{ isValid: boolean; error?: string }> {
    if (!request.amount || parseFloat(request.amount) <= 0) {
      return { isValid: false, error: 'Invalid amount' };
    }
    if (!request.fromAddress || !request.toAddress) {
      return { isValid: false, error: 'Missing wallet addresses' };
    }
    if (request.fromAddress === request.toAddress) {
      return { isValid: false, error: 'Cannot send to same address' };
    }
    const supportedTokens = this.sdk.getConfig().supportedTokens.map(t => t.symbol);
    if (!supportedTokens.includes(request.tokenSymbol)) {
      return { isValid: false, error: `Unsupported token: ${request.tokenSymbol}` };
    }
    return { isValid: true };
  }

  async calculateNetworkFee(gasLimit: number, gasPrice: string = '20000000000'): Promise<string> {
    const fee = BigInt(gasLimit) * BigInt(gasPrice);
    return fee.toString();
  }

  async processDirectPayment(request: BlessPaymentRequest): Promise<BlessPaymentResponse> {
    try {
      const validation = await this.validatePayment(request);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
          timestamp: Date.now(),
          confirmations: 0
        };
      }
      const gasLimit = await this.sdk.estimateGas({
        from: request.fromAddress,
        to: request.toAddress,
        value: request.amount
      });
      const networkFee = await this.calculateNetworkFee(gasLimit);
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      logger.info(`Processing direct payment: ${request.amount} ${request.tokenSymbol} from ${request.fromAddress} to ${request.toAddress}`);
      return {
        success: true,
        transactionId: txHash,
        blessHash: txHash,
        gasUsed: gasLimit.toString(),
        networkFee,
        timestamp: Date.now(),
        confirmations: 0
      };
    } catch (error) {
      logger.error('Direct payment processing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        confirmations: 0
      };
    }
  }
}
