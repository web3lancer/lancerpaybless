import { BlessWallet } from './types';
import logger from './logger';

export class BlessWalletManager {
  private wallets: Map<string, BlessWallet> = new Map();

  async createWallet(): Promise<BlessWallet> {
    const address = `0x${Math.random().toString(16).substring(2, 42)}`;
    const publicKey = `0x${Math.random().toString(16).substring(2, 66)}`;
    const privateKey = `0x${Math.random().toString(16).substring(2, 66)}`;
    const wallet: BlessWallet = {
      address,
      publicKey,
      privateKey,
      mnemonic: this.generateMnemonic(),
      isConnected: true,
      balance: {
        'BLS': '0.0',
        'USDC': '0.0',
        'ETH': '0.0'
      }
    };
    this.wallets.set(address, wallet);
    logger.info(`Created new Bless wallet: ${address}`);
    return wallet;
  }

  async importWallet(privateKey: string): Promise<BlessWallet> {
    const address = `0x${Math.random().toString(16).substring(2, 42)}`;
    const publicKey = `0x${Math.random().toString(16).substring(2, 66)}`;
    const wallet: BlessWallet = {
      address,
      publicKey,
      privateKey,
      isConnected: true,
      balance: {
        'BLS': '0.0',
        'USDC': '0.0',
        'ETH': '0.0'
      }
    };
    this.wallets.set(address, wallet);
    logger.info(`Imported Bless wallet: ${address}`);
    return wallet;
  }

  async getWallet(address: string): Promise<BlessWallet | null> {
    return this.wallets.get(address) || null;
  }

  async updateWalletBalance(address: string, tokenSymbol: string, balance: string): Promise<void> {
    const wallet = this.wallets.get(address);
    if (wallet) {
      wallet.balance[tokenSymbol] = balance;
    }
  }

  private generateMnemonic(): string {
    const words = ['abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident'];
    return Array.from({ length: 12 }, () => words[Math.floor(Math.random() * words.length)]).join(' ');
  }
}
