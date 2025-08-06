import { IsString, IsNotEmpty, IsNumber, IsPositive, IsEthereumAddress } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateP2POrderDto {
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  amount: number;

  @IsString()
  @IsNotEmpty()
  @IsEthereumAddress()
  walletAddress: string;
}
