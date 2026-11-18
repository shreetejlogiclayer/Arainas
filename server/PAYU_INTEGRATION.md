# PayU Hosted Checkout Integration

The portal integrates PayU's hosted checkout: the backend calculates pricing,
creates a temporary payment attempt, signs the checkout fields with SHA-512,
and the browser posts those fields to PayU. An order is created only after the
backend verifies PayU's signed callback and confirms the transaction through
PayU's `verify_payment` API. Failed payments release reserved coupons and do
not leave an order in the database. Card and UPI details are entered on PayU
and are never collected by this portal.

Apply the committed Prisma migrations before enabling checkout. Payment
attempts use a separate table and are not placed orders.

## Before configuring the app

1. Create and activate a PayU merchant account and enable the required payment
   methods for your business.
2. Obtain the **test** merchant key and salt from the PayU dashboard. Do not
   use production credentials for testing.
3. Deploy the application to a public HTTPS address. This project serves the
   frontend and API on the same origin, so the production callback uses
   `arainas.com`; a separate `api.arainas.com` DNS record is not required.
   PayU cannot post callbacks to `localhost`; use an HTTPS tunnel only for
   temporary development testing.
4. Ensure the backend can make outbound HTTPS requests to PayU's payment
   verification endpoint.

## Configure the backend

In production, set these values in the Hostinger Node.js application's
environment settings, not in `server/.env`:

```dotenv
NODE_ENV=production
PAYMENT_PROVIDER=payu
PAYU_ENV=production
PAYU_KEY=your_production_merchant_key
PAYU_SALT=your_production_merchant_salt
PAYU_CALLBACK_URL=https://arainas.com/api/orders/payu/callback
FRONTEND_URL=https://arainas.com
```

The production server does not load `server/.env`. For local PayU testing, use
test credentials and an active public HTTPS tunnel to the local backend as
`PAYU_CALLBACK_URL`. Do not send local test payments to the production callback:
it reaches the deployed backend, which cannot access local payment attempts.

`PAYU_CALLBACK_URL` must be the exact public HTTPS address of the backend
callback. This deployment serves `/api/orders/payu/callback` on `arainas.com`;
do not use `api.arainas.com` unless you separately deploy the backend there and
configure that subdomain's DNS and HTTPS. Configure the callback URL as both
the success and failure URL in PayU's dashboard if your account requires
callback URLs to be registered. The app uses the one callback for both
outcomes and distinguishes them using PayU's verified transaction status.

Restart the backend after changing environment variables. The portal will then
show the PayU checkout action. Checkout amount, discounts, and coupons are
recalculated and reserved by the backend; the browser does not supply the
amount.

## Test before launch

1. In a separate test environment, set `PAYU_ENV=test`, use test credentials,
   and use that environment's reachable HTTPS callback URL.
2. Sign in to the portal and place an order. Confirm that the PayU-hosted
   checkout opens with the expected total and customer email.
3. Test a successful payment and confirm the order is created only after the
   backend verifies it with PayU.
4. Test a declined/cancelled payment. Confirm no order is created and that an
   eligible coupon is released.
5. Test a pending or unavailable verification response; no order should appear
   until PayU confirms success.
6. Confirm the PayU dashboard shows the matching transaction and amount, and
   check backend logs for callback/verification errors. Do not log or share the
   merchant salt.

An uncompleted payment leaves a temporary payment attempt, not an order. An
eligible coupon reservation is released after 30 minutes or when PayU reports
that payment failed.

## Go live

After PayU activates the account and approves the integration:

1. Set `PAYU_ENV=production`.
2. Replace the test key and salt with the production key and salt.
3. Set `PAYU_CALLBACK_URL=https://arainas.com/api/orders/payu/callback` and
   `FRONTEND_URL=https://arainas.com` in the production hosting environment.
4. Confirm the callback is publicly reachable and registered with PayU.
5. Restart the backend, run a low-value live transaction, and reconcile it in
   both the portal and PayU dashboard before announcing availability.

Never put `PAYU_SALT` in frontend variables, source code, browser storage, or
client responses. Never mark an order paid based only on the browser redirect;
the backend validates the callback hash, transaction ID, amount, and PayU's
server-side verification response.

## Official PayU references

- [PayU Hosted Checkout overview](https://docs.payu.in/docs/prebuilt-checkout-payu-hosted)
- [Hosted Checkout integration guide](https://docs.payu.in/docs/prebuilt-checkout-page-integration)
- [Collect Payment API - Hosted Checkout](https://docs.payu.in/reference/_payment_payu_hosted_checkout)
- [Verify Payment API](https://docs.payu.in/reference/verify_payment_api)
- [Generate/access merchant key and salt](https://docs.payu.in/docs/generate-merchant-key-and-salt-copy)
