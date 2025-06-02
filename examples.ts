// Example usage of the LancerPayBless integration

import LancerPayBless from './index';

// Example 1: Basic Web3 setup with Web2 bridge
async function setupLancerPayWithBridge() {
  const lancerPay = new LancerPayBless({
    web2PayApp: {
      baseUrl: 'https://pay.web3lancer.com',
      apiKey: 'your-bridge-api-key'
    },
    autoProcessEscrow: true,
    defaultEscrowDuration: 30
  });

  await lancerPay.initialize();
  return lancerPay;
}

// Example 2: Sync Web2 payment to Bless Network
async function syncWeb2PaymentToBless(lancerPay: LancerPayBless, web2RequestId: string) {
  try {
    const result = await lancerPay.syncWeb2Payment(web2RequestId);
    
    if (result.success) {
      console.log('Payment synced to Bless Network:', {
        transactionId: result.transactionId,
        blessHash: result.blessHash,
        networkFee: result.networkFee
      });
    }
    
    return result;
  } catch (error) {
    console.error('Failed to sync payment:', error);
    throw error;
  }
}

// Example 3: Create freelancer escrow
async function createFreelancerProject(
  lancerPay: LancerPayBless, 
  web2RequestId: string,
  freelancerAddress: string,
  projectDetails: {
    projectId: string;
    milestones?: Array<{
      id: string;
      description: string;
      amount: string;
      deadline: number;
      deliverables: string[];
    }>;
  }
) {
  try {
    const result = await lancerPay.createFreelancerEscrow(web2RequestId, {
      freelancerAddress,
      projectId: projectDetails.projectId,
      milestones: projectDetails.milestones
    });

    if (result.success) {
      console.log('Freelancer escrow created:', {
        escrowId: result.escrowId,
        transactionId: result.transactionId
      });
    }

    return result;
  } catch (error) {
    console.error('Failed to create freelancer escrow:', error);
    throw error;
  }
}

// Example 4: Release freelancer payment
async function releaseFreelancerPayment(
  lancerPay: LancerPayBless,
  escrowId: string,
  milestoneId?: string
) {
  try {
    await lancerPay.releaseFreelancerPayment(escrowId, milestoneId);
    console.log(`Released ${milestoneId ? 'milestone' : 'full'} payment from escrow ${escrowId}`);
  } catch (error) {
    console.error('Failed to release payment:', error);
    throw error;
  }
}

// Example 5: Handle incoming Bless Network payment
async function handleIncomingPayment(lancerPay: LancerPayBless, blessPayment: any) {
  try {
    await lancerPay.handleIncomingBlessPayment(blessPayment);
    console.log('Incoming Bless payment processed and synced to Web2');
  } catch (error) {
    console.error('Failed to handle incoming payment:', error);
    throw error;
  }
}

// Example 6: Complete workflow - Web2 to Web3 freelancer payment
async function completeFreelancerWorkflow() {
  // 1. Setup
  const lancerPay = await setupLancerPayWithBridge();

  // 2. Create wallet for client and freelancer
  const clientWallet = await lancerPay.createWallet();
  const freelancerWallet = await lancerPay.createWallet();

  console.log('Wallets created:', {
    client: clientWallet.address,
    freelancer: freelancerWallet.address
  });

  // 3. Client creates payment request in Web2 app (this happens in the frontend)
  const web2RequestId = 'req_12345'; // This would come from the Web2 app

  // 4. Convert to escrow for freelancer project
  const escrowResult = await createFreelancerProject(
    lancerPay,
    web2RequestId,
    freelancerWallet.address,
    {
      projectId: 'project_001',
      milestones: [
        {
          id: 'milestone_1',
          description: 'Design mockups',
          amount: '500',
          deadline: Date.now() + (7 * 24 * 60 * 60 * 1000),
          deliverables: ['wireframes.pdf', 'mockups.fig']
        },
        {
          id: 'milestone_2',
          description: 'Development',
          amount: '1500',
          deadline: Date.now() + (21 * 24 * 60 * 60 * 1000),
          deliverables: ['source_code.zip', 'deployment_guide.md']
        }
      ]
    }
  );

  // 5. Freelancer completes milestone 1, client releases payment
  if (escrowResult.escrowId) {
    await releaseFreelancerPayment(lancerPay, escrowResult.escrowId, 'milestone_1');
  }

  // 6. Later, release final payment
  if (escrowResult.escrowId) {
    await releaseFreelancerPayment(lancerPay, escrowResult.escrowId, 'milestone_2');
  }

  console.log('Freelancer workflow completed successfully!');
}

export {
  setupLancerPayWithBridge,
  syncWeb2PaymentToBless,
  createFreelancerProject,
  releaseFreelancerPayment,
  handleIncomingPayment,
  completeFreelancerWorkflow
};