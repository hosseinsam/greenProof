import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SubmissionType } from '@prisma/client';

export class CreateSubmissionDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  speciesId!: string;

  @IsEnum(SubmissionType)
  type!: SubmissionType;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  locationPrecision?: string;
}
