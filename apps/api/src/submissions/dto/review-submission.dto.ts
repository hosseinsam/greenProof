import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VerificationLevel } from '@prisma/client';

export class ReviewChecklistDto {
  @IsBoolean()
  imagePresent!: boolean;

  @IsBoolean()
  locationPresent!: boolean;

  @IsBoolean()
  projectSelected!: boolean;

  @IsBoolean()
  speciesSelected!: boolean;

  @IsBoolean()
  duplicateCheckPassed!: boolean;
}

export class ApproveSubmissionDto {
  @IsOptional()
  checklist?: ReviewChecklistDto;

  @IsString()
  @IsOptional()
  reviewerNote?: string;

  @IsEnum(VerificationLevel)
  @IsOptional()
  verificationLevel?: VerificationLevel;
}

export class RejectSubmissionDto {
  @IsString()
  @IsNotEmpty()
  rejectionReason!: string;

  @IsString()
  @IsOptional()
  reviewerNote?: string;

  @IsOptional()
  checklist?: ReviewChecklistDto;
}
