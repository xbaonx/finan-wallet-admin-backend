# Finan Wallet Backend

A production-ready backend API for Finan Wallet - a cryptocurrency wallet application on Binance Smart Chain (BSC).

## Features

- 🔐 JWT-based admin authentication
- 🪙 Token management with 1inch API integration
- 💰 Real-time price data from CoinGecko
- 🤝 P2P USDT trading system
- ⚙️ Configurable payment settings
- 📊 Admin panel for order management
- 🗄️ PostgreSQL database with Prisma ORM
- 🚀 Ready for deployment on Render

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **External APIs**: 1inch, CoinGecko
- **Deployment**: Render

## API Endpoints

### Public Endpoints
- `GET /api/tokens` - Get supported tokens from 1inch
- `GET /api/tokens/popular` - Get popular BSC tokens
- `GET /api/prices?symbols=BNB,USDT` - Get token prices
- `GET /api/config` - Get payment configuration
- `POST /api/p2p/buy` - Create P2P buy order
- `POST /api/p2p/confirm-payment` - Confirm payment
- `GET /api/p2p/status/:orderId` - Check order status

### Admin Endpoints (JWT Protected)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/p2p/orders` - Get all P2P orders
- `POST /api/admin/p2p/orders/:id/confirm` - Confirm order
- `POST /api/admin/p2p/orders/:id/cancel` - Cancel order
- `PUT /api/admin/config` - Update payment config
- `POST /api/tokens/refresh` - Refresh token list

## Setup

### 1. Environment Variables

Create `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/finan_wallet"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
ADMIN_WALLET_ADDRESS="0x..."
PRIVATE_KEY_ADMIN="0x..."
PORT=3000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3001"
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Push database schema
npm run prisma:push

# (Optional) Run migrations
npm run prisma:migrate
```

### 3. Create Admin User

```bash
# Start the application
npm run start:dev

# Create admin user (you'll need to add this to your seeding script)
```

### 4. Start Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api`

## Database Schema

### AdminUser
- Admin credentials for JWT authentication

### Token
- Cached token data from 1inch API
- Auto-updated monthly via cron job

### P2POrder
- P2P trading orders with status tracking
- Statuses: PENDING → PAID → CONFIRMED/CANCELLED

### Config
- Payment configuration (bank details, QR codes)
- Admin wallet settings

## Deployment

### Render Deployment

1. Connect your GitHub repository to Render
2. The `render.yaml` file will automatically configure:
   - Web service with Node.js
   - PostgreSQL database
   - Environment variables

3. Set these environment variables in Render dashboard:
   - `ADMIN_WALLET_ADDRESS`
   - `PRIVATE_KEY_ADMIN`
   - `CORS_ORIGIN` (your admin panel URL)

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

## Development

### Available Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema to database

### API Testing

Use tools like Postman or curl to test the API endpoints. Example:

```bash
# Get token prices
curl "http://localhost:3000/api/prices?symbols=BNB,USDT"

# Admin login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

## Security Notes

- JWT secrets should be strong and unique in production
- Admin credentials should be changed from defaults
- Private keys should never be committed to version control
- Use environment variables for all sensitive data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
