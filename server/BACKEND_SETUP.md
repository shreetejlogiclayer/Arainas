# Araina Backend Setup Guide

## Overview

This is the backend server for the Araina User Portal. It handles:

- User authentication (registration, login, password reset)
- Profile management
- Orders and order history
- Referral system
- Coupon management
- Product and pricing configuration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL/MariaDB + Prisma ORM
- **Authentication**: JWT + Sessions
- **Validation**: Zod (ready to integrate)
- **Security**: bcryptjs, CORS, rate limiting

## Prerequisites

- Node.js 16+ installed
- MySQL or MariaDB database running
- Git

## Installation

1. **Navigate to server directory**:

   ```bash
   cd server
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   - `DATABASE_URL`: MySQL connection string
   - `JWT_SECRET`: Random string for JWT signing
   - `SESSION_SECRET`: Random string for sessions
   - Other services as needed

## Database Setup

### Hostinger MySQL Database

Create a database and database user in Hostinger hPanel, then grant that user access to the database. If you have direct SQL access, create the database using:

```sql
CREATE DATABASE araina_dev
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### Update Database URL

Edit `.env`:

```
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@DB_HOST:3306/DB_NAME"
```

### Create or Update Tables

Generate Prisma client and synchronize the tables in MySQL with the Prisma schema:

```bash
npx prisma generate
npx prisma db push
```

This will:

- Generate the Prisma client
- Create or update the tables to match the Prisma schema

### Seed Development Data

```bash
npm run seed
```

This creates:

- Sample product with pricing tiers
- Test user (mobile: `9876543210`, password: `Password123!`; email: `test@example.com`)
- Test address
- Sample referral code

## Development

### Start Server (with auto-reload)

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Health Check

Visit: `http://localhost:5000/health`

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2026-09-02T12:00:00.000Z"
}
```

## API Endpoints (To be implemented)

### Authentication Routes

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Profile Routes

- `GET /api/profile` - Get user profile
- `POST /api/profile` - Create profile
- `PUT /api/profile` - Update profile

### Orders

- `GET /api/orders/catalog` - Load active products, variants, and quantity pricing
- `GET /api/orders` - List the signed-in user's orders and recipient snapshots
- `POST /api/orders` - Place an order for the account holder or another recipient

Order payment remains disabled until a payment provider is configured.

### Aadhaar Routes

- `POST /api/aadhaar/request-otp` - Request OTP
- `POST /api/aadhaar/verify-otp` - Verify OTP

### Order Routes

- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/:id/receipt` - Get order receipt

### Referral Routes

- `GET /api/referrals` - Get referral info
- `POST /api/referrals/validate` - Validate referral code

### Coupon Routes

- `GET /api/coupons` - Get user's coupons
- `POST /api/coupons/apply` - Validate coupon

### Product Routes

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/:id/pricing` - Get pricing tiers

## Database Schema

The database includes the following models:

- **User**: Authentication and account info
- **Profile**: User profile with referral code
- **Address**: Structured delivery addresses
- **AadhaarVerification**: Aadhaar verification status
- **UserPhoto**: Live photo references
- **Referral**: Referral relationships
- **Coupon**: User's earned coupons
- **Product**: Product catalog
- **ProductVariant**: Product variants/sizes
- **PricingTier**: Product pricing by quantity
- **Order**: Order information
- **OrderItem**: Order line items (product snapshots)
- **OrderAddress**: Order delivery address (snapshot)
- **Payment**: Payment status and info
- **PasswordResetToken**: Password reset tokens

## Key Configuration Files

### `.env` File

Important variables:

```
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@DB_HOST:3306/DB_NAME"
JWT_SECRET=your-secret-here
SESSION_SECRET=your-secret-here
FRONTEND_URL=http://localhost:5173
STORAGE_PROVIDER=none
PAYMENT_PROVIDER=none
AADHAAR_PROVIDER=mock
```

### Prisma Schema

Located at `server/prisma/schema.prisma`

To update schema:

1. Edit `schema.prisma`
2. Run `npm run migrate`
3. Choose a name for the migration

User email is optional; mobile number is required for both registration and login.

## Development Tips

### View Database Data

```bash
npx prisma studio
```

Opens Prisma Studio at `http://localhost:5555` to view/edit data

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

⚠️ **Warning**: This deletes all data!

### Generate Prisma Client

```bash
npx prisma generate
```

## Error Handling

All API errors follow this format:

```json
{
  "error": {
    "status": 400,
    "message": "Error description",
    "details": "..." // Only in development
  }
}
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token validation
- ✅ CORS configuration
- ✅ Secure session cookies
- ✅ Rate limiting (ready to implement)
- ✅ Input validation
- ⏳ Rate limiting on auth endpoints
- ⏳ API request validation schemas

## Deployment

### Environment Variables for Production

```bash
NODE_ENV=production
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@DB_HOST:3306/DB_NAME"
JWT_SECRET=secure-random-secret
SESSION_SECRET=secure-random-secret
FRONTEND_URL=https://your-domain.com
```

### Deploy on Render/Railway/Heroku

1. Push code to GitHub
2. Connect repository to deployment platform
3. Set environment variables
4. Deploy

Example Render configuration:

- Build command: `npm install && npx prisma migrate deploy`
- Start command: `npm start`

## Future Integrations

### Payment Gateway (Currently: none)

- Razorpay
- Cashfree
- PhonePe

Update `PAYMENT_PROVIDER` in `.env`

### Aadhaar Verification (Currently: mock)

- UIDAI authorized provider
- OTP verification flow

Update `AADHAAR_PROVIDER` to `production`

### Email Service (Currently: SMTP)

- SendGrid
- Mailgun
- AWS SES

### File Storage (Currently: none)

- Profile photos are stored in `USER_UPLOAD_DIR` (default: `server/uploads`).
- Keep this directory on persistent storage when deploying the backend.
- AWS S3
- Supabase Storage
- Cloudinary

### Profile Aadhaar Verification

- The development mock is available only when `NODE_ENV=development` and
  `AADHAAR_PROVIDER=mock`. It stores only the last four digits and uses OTP
  `123456` for local testing.
- The mock is disabled in production. Configure an authorized verification
  provider before enabling Aadhaar verification on a deployed portal.

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

- Ensure MySQL is running
- Check DATABASE_URL in .env
- Verify database name exists

### Prisma Migration Issues

```
npm run migrate
```

If stuck, reset locally (development only):

```
npx prisma migrate reset
```

### Port Already in Use

```
npm run dev -- --host localhost --port 3000
```

## Support

For issues or questions, refer to:

- Express.js docs: https://expressjs.com
- Prisma docs: https://www.prisma.io/docs
- MySQL docs: https://dev.mysql.com/doc

## License

Proprietary - Araina/Royo Essentials LLP
