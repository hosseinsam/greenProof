import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { ImpactPackStatus } from '@prisma/client';

export class CreateImpactPackDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsInt()
  @IsPositive()
  priceCents!: number;

  @IsInt()
  @IsPositive()
  treesPlanted!: number;

  @IsInt()
  @IsOptional()
  treesAlive12m?: number;

  @IsInt()
  @IsOptional()
  seedsPlanted?: number;

  @IsInt()
  @IsPositive()
  impactUnitsRequired!: number;

  @IsString()
  @IsOptional()
  status?: ImpactPackStatus;
}
