import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get()
  async getAllTokens() {
    return this.tokensService.getAllTokens();
  }

  @Get('popular')
  async getPopularTokens() {
    return this.tokensService.getPopularTokens();
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refreshTokens() {
    return this.tokensService.fetchTokensFromOneInch();
  }
}
