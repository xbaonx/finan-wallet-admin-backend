import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class PricesService {
  private readonly logger = new Logger(PricesService.name);
  private readonly COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
  private readonly priceCache = new Map<string, { price: number; timestamp: number }>();
  private readonly CACHE_DURATION = 60000; // 1 minute cache

  constructor(
    private configService: ConfigService,
    private tokensService: TokensService,
  ) {}

  async getTokenPrices(symbols: string[]) {
    const prices: Record<string, number> = {};
    const symbolsToFetch: string[] = [];

    // Check cache first
    for (const symbol of symbols) {
      const cached = this.priceCache.get(symbol.toUpperCase());
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        prices[symbol.toUpperCase()] = cached.price;
      } else {
        symbolsToFetch.push(symbol);
      }
    }

    if (symbolsToFetch.length === 0) {
      return prices;
    }

    try {
      // Map symbols to CoinGecko IDs
      const coinGeckoIds = await this.mapSymbolsToCoinGeckoIds(symbolsToFetch);
      
      if (coinGeckoIds.length === 0) {
        this.logger.warn('No valid CoinGecko IDs found for symbols:', symbolsToFetch);
        return prices;
      }

      const response = await axios.get(
        `${this.COINGECKO_BASE_URL}/simple/price`,
        {
          params: {
            ids: coinGeckoIds.join(','),
            vs_currencies: 'usd',
          },
          timeout: 10000,
        }
      );

      // Process response and update cache
      for (const symbol of symbolsToFetch) {
        const coinGeckoId = this.getCoinGeckoId(symbol);
        const priceData = response.data[coinGeckoId];
        
        if (priceData && priceData.usd) {
          const price = priceData.usd;
          prices[symbol.toUpperCase()] = price;
          
          // Update cache
          this.priceCache.set(symbol.toUpperCase(), {
            price,
            timestamp: Date.now(),
          });
        }
      }

      return prices;
    } catch (error) {
      this.logger.error('Failed to fetch prices from CoinGecko:', error.message);
      
      // Return cached prices if available, even if expired
      for (const symbol of symbolsToFetch) {
        const cached = this.priceCache.get(symbol.toUpperCase());
        if (cached) {
          prices[symbol.toUpperCase()] = cached.price;
        }
      }
      
      return prices;
    }
  }

  private async mapSymbolsToCoinGeckoIds(symbols: string[]): Promise<string[]> {
    const ids: string[] = [];
    
    for (const symbol of symbols) {
      const coinGeckoId = this.getCoinGeckoId(symbol);
      if (coinGeckoId) {
        ids.push(coinGeckoId);
      }
    }
    
    return ids;
  }

  private getCoinGeckoId(symbol: string): string | null {
    // Map common BSC tokens to their CoinGecko IDs
    const symbolToIdMap: Record<string, string> = {
      'BNB': 'binancecoin',
      'USDT': 'tether',
      'USDC': 'usd-coin',
      'BUSD': 'binance-usd',
      'ETH': 'ethereum',
      'BTCB': 'bitcoin',
      'ADA': 'cardano',
      'DOT': 'polkadot',
      'CAKE': 'pancakeswap-token',
      'LINK': 'chainlink',
      'UNI': 'uniswap',
      'MATIC': 'matic-network',
      'AVAX': 'avalanche-2',
      'SOL': 'solana',
      'DOGE': 'dogecoin',
      'SHIB': 'shiba-inu',
      'TRX': 'tron',
      'LTC': 'litecoin',
      'BCH': 'bitcoin-cash',
      'ETC': 'ethereum-classic',
    };

    return symbolToIdMap[symbol.toUpperCase()] || null;
  }

  async getSingleTokenPrice(symbol: string): Promise<number | null> {
    const prices = await this.getTokenPrices([symbol]);
    return prices[symbol.toUpperCase()] || null;
  }

  // Get price using 1inch quote as fallback
  async getTokenPriceFromOneInch(tokenAddress: string, amount: string = '1'): Promise<number | null> {
    try {
      const response = await axios.get(
        `https://api.1inch.dev/swap/v5.2/56/quote`,
        {
          params: {
            fromTokenAddress: tokenAddress,
            toTokenAddress: '0x55d398326f99059fF775485246999027B3197955', // USDT on BSC
            amount: amount,
          },
          timeout: 10000,
        }
      );

      if (response.data && response.data.toTokenAmount) {
        const price = parseFloat(response.data.toTokenAmount) / Math.pow(10, 18);
        return price;
      }

      return null;
    } catch (error) {
      this.logger.error('Failed to get price from 1inch:', error.message);
      return null;
    }
  }
}
