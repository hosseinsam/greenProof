import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { ImpactPackStatus } from '@prisma/client';

export class UpdateImpactPackDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  @IsPositive()
  priceCents?: number;

  @IsInt()
  @IsOptional()
  @IsPositive()
  treesPlanted?: number;

  @IsInt()
  @IsOptional()
  treesAlive12m?: number;

  @IsInt()
  @IsOptional()
  seedsPlanted?: number;

  @IsInt()
  @IsOptional()
  @IsPositive()
  impactUnitsRequired?: number;

  @IsString()
  @IsOptional()
  status?: ImpactPackStatus;
}
