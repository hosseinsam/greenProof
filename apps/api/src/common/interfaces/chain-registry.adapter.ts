export interface ChainTxResult {
  txHash: string;
  chainEntityId: string;
}

export interface ChainCertificateStatus {
  certificateId: string;
  owner: string;
  retired: boolean;
  reportHash: string;
  evidenceHash: string;
}

export abstract class ChainRegistryAdapter {
  abstract mintGreenCoins(input: {
    userId: string;
    amount: number;
    reason: string;
  }): Promise<ChainTxResult>;

  abstract mintImpactCertificate(input: {
    certificateId: string;
    buyerCompanyId: string;
    reportHash: string;
    evidenceHash: string;
  }): Promise<ChainTxResult>;

  abstract transferCertificate(input: {
    certificateId: string;
    toWallet: string;
  }): Promise<ChainTxResult>;

  abstract retireCertificate(input: {
    certificateId: string;
  }): Promise<ChainTxResult>;

  abstract getCertificateStatus(certificateId: string): Promise<ChainCertificateStatus | null>;
}
