# 🚀 Finan Wallet - Complete System

Monorepo chứa toàn bộ hệ thống Finan Wallet bao gồm Backend API và Admin Panel, được thiết kế để deploy cùng lúc trên Render.

## 📁 Cấu trúc dự án

```
finan-wallet-monorepo/
├── backend/                 # NestJS Backend API
│   ├── src/                # Source code
│   ├── prisma/             # Database schema & migrations
│   ├── package.json        # Backend dependencies
│   └── ...
├── admin/                  # Next.js Admin Panel
│   ├── src/                # Source code
│   ├── package.json        # Frontend dependencies
│   └── ...
├── render.yaml             # Render deployment config
└── README.md              # Hướng dẫn này
```

## 🚀 Deploy trên Render (1 lần cho cả 2 services)

### Bước 1: Push lên GitHub

```bash
cd finan-wallet-monorepo

# Khởi tạo git repository
git init

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial commit - Finan Wallet Complete System"

# Tạo repository trên GitHub và push
git remote add origin https://github.com/YOUR_USERNAME/finan-wallet-monorepo.git
git branch -M main
git push -u origin main
```

### Bước 2: Deploy trên Render

1. **Vào Render Dashboard** → **New** → **Blueprint**

2. **Connect Repository**: Chọn repository `finan-wallet-monorepo`

3. **Render sẽ tự động đọc file `render.yaml`** và tạo:
   - ✅ PostgreSQL Database (`finan-wallet-db`)
   - ✅ Backend Service (`finan-wallet-backend`)
   - ✅ Admin Panel Service (`finan-wallet-admin`)

4. **Click "Apply"** để deploy cả 3 services cùng lúc

### Bước 3: Seed Database (chỉ 1 lần)

Sau khi deployment hoàn thành:

1. Vào **finan-wallet-backend** service
2. **Shell** tab
3. Chạy:
```bash
npm run prisma:seed
```

## 🎯 Kết quả sau khi deploy

- **Backend API**: `https://finan-wallet-backend.onrender.com/api`
- **Admin Panel**: `https://finan-wallet-admin.onrender.com`
- **Database**: PostgreSQL được quản lý tự động

## 🔐 Đăng nhập Admin Panel

- **URL**: https://finan-wallet-admin.onrender.com
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Nhớ thay đổi password trong production!**

## 🧪 Test APIs

```bash
# Thay YOUR_BACKEND_URL bằng URL thực tế
export API_URL="https://finan-wallet-backend.onrender.com/api"

# Test health
curl $API_URL

# Test tokens
curl $API_URL/tokens

# Test prices
curl "$API_URL/prices?symbols=BNB,USDT"

# Test admin login
curl -X POST $API_URL/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test P2P buy
curl -X POST $API_URL/p2p/buy \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "walletAddress": "0x742d35Cc6634C0532925a3b8D5c9C1A9c3e8e8e8"
  }'
```

## ⚙️ Environment Variables

### Backend
- `NODE_ENV`: production
- `PORT`: 10000
- `DATABASE_URL`: Auto từ PostgreSQL service
- `JWT_SECRET`: Auto generate
- `ADMIN_WALLET_ADDRESS`: Địa chỉ ví admin
- `PRIVATE_KEY_ADMIN`: Private key ví admin
- `CORS_ORIGIN`: URL admin panel

### Admin Panel
- `NEXT_PUBLIC_API_URL`: URL backend API

## 🔧 Development Local

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Chỉnh sửa .env với database local
npm run prisma:push
npm run prisma:seed
npm run start:dev  # Port 3000
```

### Admin Panel
```bash
cd admin
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api" > .env.local
npm run dev  # Port 3001
```

## 📊 Tính năng

### Backend API
- ✅ JWT Authentication cho admin
- ✅ P2P Trading System (buy USDT)
- ✅ Token management với 1inch API
- ✅ Price data từ CoinGecko
- ✅ Config management
- ✅ Auto-update tokens (cron job)

### Admin Panel
- ✅ Dashboard với thống kê
- ✅ Quản lý đơn hàng P2P
- ✅ Xác nhận/hủy đơn hàng
- ✅ Cấu hình hệ thống
- ✅ Responsive design

## 🚨 Production Checklist

- [ ] Thay đổi admin password
- [ ] Cập nhật `ADMIN_WALLET_ADDRESS` và `PRIVATE_KEY_ADMIN`
- [ ] Set up monitoring và alerts
- [ ] Backup database định kỳ
- [ ] Test toàn bộ flow P2P
- [ ] Kiểm tra CORS settings
- [ ] Monitor logs và performance

## 🆘 Troubleshooting

### Build failed
- Kiểm tra logs trong Render
- Đảm bảo `package.json` có đúng scripts
- Verify Node.js version compatibility

### Database connection issues
- Kiểm tra DATABASE_URL format
- Verify database service đã start thành công
- Test connection từ backend shell

### Admin panel không connect được backend
- Kiểm tra `NEXT_PUBLIC_API_URL`
- Verify CORS settings trong backend
- Check network logs trong browser

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs của từng service
2. Verify environment variables
3. Test API endpoints riêng biệt
4. Check database connection

---

🎉 **Chúc mừng! Toàn bộ hệ thống Finan Wallet đã sẵn sàng production!**
