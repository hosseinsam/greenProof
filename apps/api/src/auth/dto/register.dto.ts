import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'community@greenproof.local' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'supersecure123', minLength: 8 })
  @IsString()
  @Length(8, 128)
  password!: string;

  @ApiProperty({ example: 'Ava Karim' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ enum: Role, example: Role.USER })
  @IsEnum(Role)
  role!: Role;

  @ApiPropertyOptional({ example: 'Northside Bakery' })
  @IsString()
  @IsOptional()
  companyName?: string;
}
