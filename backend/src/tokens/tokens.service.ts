import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class TokensService {
  private readonly logger = new Logger(TokensService.name);
  private readonly BSC_CHAIN_ID = 56;
  private readonly ONEINCH_BASE_URL = 'https://api.1inch.dev/swap/v5.2';

  constructor(private prisma: PrismaService) {}

  async getAllTokens() {
    return this.prisma.token.findMany({
      orderBy: { symbol: 'asc' },
    });
  }

  async getTokenBySymbol(symbol: string) {
    return this.prisma.token.findUnique({
      where: { symbol: symbol.toUpperCase() },
    });
  }

  async getTokenByAddress(address: string) {
    return this.prisma.token.findUnique({
      where: { address: address.toLowerCase() },
    });
  }

  async fetchTokensFromOneInch() {
    try {
      this.logger.log('Fetching tokens from 1inch API...');
      
      const response = await axios.get(
        `${this.ONEINCH_BASE_URL}/${this.BSC_CHAIN_ID}/tokens`,
        {
          timeout: 10000,
        }
      );

      const tokens = response.data.tokens;
      const tokenList = Object.values(tokens) as any[];

      this.logger.log(`Found ${tokenList.length} tokens from 1inch`);

      // Update tokens in database
      for (const token of tokenList) {
        await this.prisma.token.upsert({
          where: { address: token.address.toLowerCase() },
          update: {
            symbol: token.symbol,
            name: token.name,
            decimals: token.decimals,
            logoUri: token.logoURI,
            updatedAt: new Date(),
          },
          create: {
            symbol: token.symbol,
            name: token.name,
            address: token.address.toLowerCase(),
            decimals: token.decimals,
            logoUri: token.logoURI,
          },
        });
      }

      this.logger.log('Successfully updated tokens in database');
      return { success: true, count: tokenList.length };
    } catch (error) {
      this.logger.error('Failed to fetch tokens from 1inch:', error.message);
      throw new Error('Failed to fetch tokens from 1inch API');
    }
  }

  // Update tokens every 30 days
  @Cron('0 0 1 * *') // Run on the 1st day of every month
  async updateTokensCron() {
    this.logger.log('Running scheduled token update...');
    try {
      await this.fetchTokensFromOneInch();
    } catch (error) {
      this.logger.error('Scheduled token update failed:', error.message);
    }
  }

  async getPopularTokens() {
    // Return commonly used tokens on BSC
    const popularSymbols = ['BNB', 'USDT', 'USDC', 'BUSD', 'ETH', 'BTCB', 'ADA', 'DOT', 'CAKE'];
    
    return this.prisma.token.findMany({
      where: {
        symbol: {
          in: popularSymbols,
        },
      },
      orderBy: { symbol: 'asc' },
    });
  }
}
