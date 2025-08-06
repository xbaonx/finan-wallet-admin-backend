import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsEthereumAddress } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateConfigDto {
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  accountHolder: string;

  @IsString()
  @IsOptional()
  qrImageUrl?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsNotEmpty()
  @IsEthereumAddress()
  adminWalletAddress: string;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  usdtRate?: number;
}
