import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProjectStatus, VerificationLevel } from '@prisma/client';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  projectType?: string;

  @IsString()
  @IsOptional()
  partnerName?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsEnum(VerificationLevel)
  @IsOptional()
  verificationLevel?: VerificationLevel;
}
