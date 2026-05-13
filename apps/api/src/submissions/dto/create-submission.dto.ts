import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { SubmissionType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty({ example: 'project-uuid' })
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @ApiProperty({ example: 'species-uuid' })
  @IsString()
  @IsNotEmpty()
  speciesId!: string;

  @ApiProperty({ enum: SubmissionType, example: SubmissionType.TREE_PLANTED })
  @IsEnum(SubmissionType)
  type!: SubmissionType;

  @ApiProperty({ example: 'Planted 3 olive saplings near the school entrance' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'We planted three saplings with students and added mulch around each tree.' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({ example: 35.6892, type: Number })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 51.389, type: Number })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: 'exact' })
  @IsString()
  @IsOptional()
  locationPrecision?: string;
}
