import { Controller, Get, Query } from '@nestjs/common';
import { PricesService } from './prices.service';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get()
  async getTokenPrices(@Query('symbols') symbols: string) {
    if (!symbols) {
      return { error: 'symbols parameter is required' };
    }

    const symbolArray = symbols.split(',').map(s => s.trim().toUpperCase());
    const prices = await this.pricesService.getTokenPrices(symbolArray);
    
    return {
      prices,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('single')
  async getSingleTokenPrice(@Query('symbol') symbol: string) {
    if (!symbol) {
      return { error: 'symbol parameter is required' };
    }

    const price = await this.pricesService.getSingleTokenPrice(symbol);
    
    return {
      symbol: symbol.toUpperCase(),
      price,
      timestamp: new Date().toISOString(),
    };
  }
}
