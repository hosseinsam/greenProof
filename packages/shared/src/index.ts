export const API_RESPONSE = {
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

export enum Role {
  USER = 'USER',
  COMPANY = 'COMPANY',
  ADMIN = 'ADMIN',
  PARTNER = 'PARTNER'
}

export enum SubmissionType {
  TREE_PLANTED = 'TREE_PLANTED',
  SEED_PLANTED = 'SEED_PLANTED',
  MAINTENANCE = 'MAINTENANCE',
  SURVIVAL_CHECK = 'SURVIVAL_CHECK',
  COMMUNITY_EVENT = 'COMMUNITY_EVENT'
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum VerificationLevel {
  BASIC = 'BASIC',
  AI_CHECKED = 'AI_CHECKED',
  PARTNER_VERIFIED = 'PARTNER_VERIFIED',
  THIRD_PARTY_VERIFIED = 'THIRD_PARTY_VERIFIED'
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

export enum ImpactPackStatus {
  DRAFT = 'DRAFT',
  AVAILABLE = 'AVAILABLE',
  SOLD_OUT = 'SOLD_OUT',
  ARCHIVED = 'ARCHIVED'
}

export enum CertificateStatus {
  ISSUED = 'ISSUED',
  TRANSFERRED = 'TRANSFERRED',
  RETIRED = 'RETIRED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}
