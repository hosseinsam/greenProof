import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePurchaseDto {
  @IsString()
  @IsNotEmpty()
  impactPackId!: string;
}
