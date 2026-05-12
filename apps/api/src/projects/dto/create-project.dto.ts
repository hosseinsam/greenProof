import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProjectStatus, VerificationLevel } from '@prisma/client';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  country!: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  projectType!: string;

  @IsString()
  @IsOptional()
  partnerName?: string;

  @IsEnum(ProjectStatus)
  status!: ProjectStatus;

  @IsEnum(VerificationLevel)
  verificationLevel!: VerificationLevel;
}
