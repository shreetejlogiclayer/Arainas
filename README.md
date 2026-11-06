# Araina

Araina is a Vite/React frontend with an Express API and a MySQL database managed through Prisma. In production, Express serves the built frontend and API on the same origin.

## Local development

Requirements: Node.js 22.12 or newer and npm.

1. Copy `server/.env.example` to `server/.env` and set `DATABASE_URL` to your development database. Set secrets and any email, payment, storage, or verification provider credentials needed for the features you want to test.
2. Install frontend and backend dependencies and generate Prisma Client:

   ```sh
   npm install
   npm run build:backend
   ```

3. Run the frontend and backend in separate terminals:

   ```sh
   npm run dev
   npm run dev --prefix server
   ```

Vite serves the frontend on port 5173 and proxies `/api` requests to the backend on port 5001.

## Hostinger deployment

Deploy the repository as one Node.js application for `arainas.com`. Do not deploy either `node_modules` directory or commit `.env` files.

- **Node.js:** 22.12 or newer
- **Build command:** `npm install --include=dev && npm run build`
- **Start command:** `npm start`
- **Application root:** repository root
- **Application entry point (if requested):** `server/src/index.js`
- **Frontend build output:** `dist`
- **API:** same-origin `/api`

The root build command builds the frontend, installs backend dependencies, and generates Prisma Client. Express binds to `0.0.0.0` and uses Hostinger's `PORT`. It serves `dist` and falls back to `index.html` for client-side routes, while unknown `/api` routes remain API 404 responses.

### Environment variables

Set these in the Hostinger Node.js application settings, not in source control:

- `NODE_ENV=production`
- `DATABASE_URL=mysql://DB_USER:URL_ENCODED_PASSWORD@127.0.0.1:3306/DB_NAME`
- `SESSION_SECRET` and `JWT_SECRET`: independent random secrets, at least 32 characters each
- `FRONTEND_URL=https://arainas.com`
- `PORTAL_URL=https://arainas.com/portal`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `EMAIL_FROM` for contact enquiries. Use the SMTP settings and mailbox password shown in Hostinger hPanel → Emails → Configuration; the example values in `server/.env.example` are only a starting point. The form sends formatted messages to `care@arainas.com`; `EMAIL_FROM` must be authorized by that SMTP account.
- `USER_UPLOAD_DIR`: a persistent writable path outside the deployment directory if users upload profile photos.
- For live PayU checkout: `PAYMENT_PROVIDER=payu`, `PAYU_ENV=production`, the live `PAYU_KEY` and `PAYU_SALT`, and `PAYU_CALLBACK_URL=https://arainas.com/api/orders/payu/callback`. Do not use test merchant credentials in production. If live PayU is not ready, set `PAYMENT_PROVIDER=none`; checkout will be unavailable.
- Keep `AADHAAR_PROVIDER=none` unless an authorized production verification provider is configured.

Use the exact prefixed database name and database user shown in hPanel. URL-encode special characters in the database password. Keep the database password, session/JWT secrets, and payment secrets private.

Before deploying, back up the production database, then apply committed migrations with:

```sh
npm run migrate:deploy --prefix server
```

Do not run development migrations against production. The application connects to MySQL and ensures the default order catalog during startup; it does not automatically apply schema migrations.

The persistent-session migration `20261106120000_add_persistent_sessions` is currently pending on the database configured in the local `server/.env`. Back up the production database, set the production environment in Hostinger, and run the migration command from the application root before switching traffic.

### Post-deployment checks

- Open `https://arainas.com` and refresh a nested frontend route such as `/portal`.
- Check `https://arainas.com/api/health` returns `{"status":"ok",...}`.
- Test registration/login, profile and upload operations, orders, and any enabled email/payment integrations.
- Keep Hostinger's domain email/MX records unchanged unless intentionally changing email providers.
