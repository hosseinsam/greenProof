import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateSpeciesDto {
  @IsString()
  @IsNotEmpty()
  commonName!: string;

  @IsString()
  @IsNotEmpty()
  region!: string;

  @IsString()
  @IsNotEmpty()
  scientificName!: string;

  @IsBoolean()
  native!: boolean;

  @IsBoolean()
  invasiveRisk!: boolean;
}
