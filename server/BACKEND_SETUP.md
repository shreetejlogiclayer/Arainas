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
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + Sessions
- **Validation**: Zod (ready to integrate)
- **Security**: bcryptjs, CORS, rate limiting

## Prerequisites

- Node.js 16+ installed
- PostgreSQL database running
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
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Random string for JWT signing
   - `SESSION_SECRET`: Random string for sessions
   - Other services as needed

## Database Setup

### Create PostgreSQL Database

```bash
createdb araina_dev
```

Or using PostgreSQL CLI:

```sql
CREATE DATABASE araina_dev;
```

### Update Database URL

Edit `.env`:

```
DATABASE_URL="postgresql://username:password@localhost:5432/araina_dev"
```

### Run Migrations

Generate Prisma client and run migrations:

```bash
npm run migrate
```

This will:

- Generate the Prisma client
- Create all database tables
- Create migration files

### Seed Development Data

```bash
npm run seed
```

This creates:

- Sample product with pricing tiers
- Test user (email: `test@example.com`, password: `Password123!`)
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
DATABASE_URL=postgresql://...
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
DATABASE_URL=your-production-db-url
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

- AWS S3
- Supabase Storage
- Cloudinary

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

- Ensure PostgreSQL is running
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
- PostgreSQL docs: https://www.postgresql.org/docs

## License

Proprietary - Araina/Royo Essentials LLP
