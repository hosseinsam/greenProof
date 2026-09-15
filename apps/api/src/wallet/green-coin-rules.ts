import { SubmissionType } from '@prisma/client';

export const GREEN_COIN_REWARDS: Record<SubmissionType, number> = {
  TREE_PLANTED: 5,
  SEED_PLANTED: 2,
  MAINTENANCE: 3,
  SURVIVAL_CHECK: 10,
  COMMUNITY_EVENT: 20
};

export const GREEN_COIN_RULES = {
  name: 'GreenProof Coins',
  launchMode: 'Internal verified contribution reward',
  transferable: false,
  tradable: false,
  investmentAsset: false,
  summary: 'GreenProof Coins recognize approved nature-impact work. They are reputation and contribution points, not money, not a security, and not a carbon credit.',
  rewards: Object.entries(GREEN_COIN_REWARDS).map(([type, amount]) => ({
    type,
    amount,
    trigger: `Admin approval of ${type.toLowerCase().replace(/_/g, ' ')} evidence`
  })),
  guardrails: [
    'Coins are minted only after admin-approved evidence.',
    'Every reward is linked to a submission and audit trail.',
    'Coins cannot be traded, withdrawn, or sold in the first-launch MVP.',
    'Coins do not represent carbon offsets or carbon-neutral claims.'
  ]
};
