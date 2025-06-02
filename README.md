# LancerPayBless Integration

## Overview

This integration connects the **Web2 Pay App** (Next.js frontend) with the **Bless Network Web3 component**, enabling seamless Web2-to-Web3 payment processing for freelancers and businesses.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Web2 Pay App  │    │  Bridge Service  │    │  Bless Network SDK  │
│   (Next.js)     │◄──►│  (TypeScript)    │◄──►│   (Blockless)       │
│                 │    │                  │    │                     │
│ • UI/UX         │    │ • Web2↔Web3      │    │ • Payments          │
│ • Database      │    │ • Sync Logic     │    │ • Escrow            │
│ • User Mgmt     │    │ • API Bridge     │    │ • Wallet Mgmt       │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
```

## Key Features

### 🌉 **Bridge Service**
- **Bidirectional Sync**: Web2 payment requests ↔ Bless Network transactions
- **Freelancer Escrow**: Automatic escrow creation for project-based payments
- **Real-time Updates**: Payment status synchronization
- **API Integration**: RESTful endpoints for seamless communication

### 🔒 **Escrow Management**
- **Milestone-based Payments**: Release funds as freelancers complete deliverables
- **Automatic Escrow**: Convert regular payments to escrow for freelancer projects
- **Dispute Resolution**: Built-in dispute handling mechanisms
- **Multi-token Support**: BLS, USDC, ETH, USDT, BTC

### 💼 **Web2 Integration**
- **Payment Profiles**: Users can receive crypto via `pay.web3lancer.com/pay/username`
- **QR Code Generation**: Instant payment QR codes for any amount
- **Request Management**: Create, track, and manage payment requests
- **User Authentication**: Appwrite-based auth with KYC/2FA

## Setup Instructions

### 1. Configure Environment Variables

**For Bless Network Component:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

**For Web2 Pay App:**
```bash
cp .env.example.bless .env.local
# Add Bless Network configuration to existing .env.local
```

### 2. Deploy Bless Network Function

```bash
# Build the Bless Network component
npm run build

# Deploy to Blockless Network
blessnet deploy
```

### 3. Update Web2 App

```bash
cd ../pay
npm install
# Add the useBlessNetwork hook to your components
```

## Usage Examples

### Basic Payment Processing

```typescript
import LancerPayBless from 'lancerpaybless';

// Initialize with bridge configuration
const lancerPay = new LancerPayBless({
  web2PayApp: {
    baseUrl: 'https://pay.web3lancer.com',
    apiKey: process.env.BRIDGE_API_KEY
  },
  autoProcessEscrow: true,
  defaultEscrowDuration: 30
});

await lancerPay.initialize();

// Sync Web2 payment to Bless Network
const result = await lancerPay.syncWeb2Payment('req_12345');
```

### Freelancer Escrow Creation

```typescript
// Create escrow for freelancer project
const escrowResult = await lancerPay.createFreelancerEscrow('req_12345', {
  freelancerAddress: '0x...',
  projectId: 'project_001',
  milestones: [
    {
      id: 'milestone_1',
      description: 'Design phase',
      amount: '500',
      deadline: Date.now() + (7 * 24 * 60 * 60 * 1000),
      deliverables: ['wireframes.pdf', 'mockups.fig']
    }
  ]
});

// Release milestone payment
if (escrowResult.escrowId) {
  await lancerPay.releaseFreelancerPayment(escrowResult.escrowId, 'milestone_1');
}
```

### Web2 App Integration

```typescript
import { useBlessNetwork } from '@/hooks/useBlessNetwork';

function PaymentComponent() {
  const { processOnBlessNetwork, isProcessing } = useBlessNetwork();

  const handlePayment = async () => {
    const result = await processOnBlessNetwork(paymentRequest, {
      fromAddress: clientWallet.address,
      toAddress: freelancerWallet.address,
      useEscrow: true,
      freelancerData: {
        freelancerAddress: freelancerWallet.address,
        projectId: 'project_001'
      }
    });
  };

  return (
    <button onClick={handlePayment} disabled={isProcessing}>
      {isProcessing ? 'Processing...' : 'Pay with Bless Network'}
    </button>
  );
}
```

## API Endpoints

### Bridge Endpoints (Web2 App)

- `GET /api/payment-requests/[id]` - Fetch payment request for bridge
- `PATCH /api/payment-requests/[id]` - Update payment request from bridge
- `POST /api/escrow/release` - Handle escrow release notifications

### Bless Network Actions

- `processPayment` - Process direct payment
- `createFreelancerEscrow` - Create escrow for freelancer projects
- `releaseFreelancerPayment` - Release escrow payments
- `getPaymentStatus` - Check transaction status
- `createWallet` - Generate new Bless Network wallet

## Security Features

- 🔐 **Bridge Authentication**: API key validation for all bridge communications
- 🛡️ **Security Logging**: All transactions logged with risk scoring
- 🔍 **KYC Integration**: Large payment validation
- 🚨 **Real-time Monitoring**: Transaction status tracking
- 💰 **Escrow Protection**: Funds held securely until milestone completion

## Benefits

### For Freelancers
- ✅ **Guaranteed Payments**: Escrow ensures payment upon delivery
- ⚡ **Fast Settlements**: Instant crypto payments
- 🌍 **Global Access**: Accept payments from anywhere
- 📱 **Easy Setup**: Simple wallet creation and management

### For Clients
- 🔒 **Payment Protection**: Only pay when work is delivered
- 📊 **Transparent Tracking**: Real-time payment and project status
- 💸 **Lower Fees**: Reduced transaction costs vs traditional methods
- 🤝 **Trust Building**: Automated escrow builds confidence

### For Platforms
- 🚀 **Scalable Infrastructure**: Handle thousands of transactions
- 🔄 **Seamless Integration**: Easy Web2-to-Web3 bridge
- 📈 **Revenue Opportunities**: Transaction fee collection
- 🛠️ **Developer Friendly**: Well-documented APIs and examples

## Deployment

1. **Deploy Bless Network Function** to Blockless Network
2. **Configure Environment Variables** in both components
3. **Update Web2 App** with Bless Network integration
4. **Test Bridge Communication** using provided examples
5. **Monitor Transactions** through security logs

## Support

For issues or questions:
- 📧 Email: support@web3lancer.com
- 🐛 Issues: GitHub repository
- 📚 Docs: [Integration Guide](./docs/integration.md)

---

**Built with ❤️ for the Web3Lancer ecosystem**