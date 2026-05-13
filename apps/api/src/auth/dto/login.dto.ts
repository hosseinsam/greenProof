import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@greenproof.local' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'supersecure123', minLength: 8 })
  @IsString()
  @Length(8, 128)
  password!: string;
}
