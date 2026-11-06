# PayU Hosted Checkout Integration

The portal integrates PayU's hosted checkout: the backend creates the order
using database pricing, signs the checkout fields with SHA-512, and the browser
posts those fields to PayU. The backend verifies PayU's signed callback and then
calls PayU's `verify_payment` API before changing an order to paid. Card and
UPI details are entered on PayU and are never collected by this portal.

The existing offline order flow remains active while `PAYMENT_PROVIDER=none`.
No database migration is needed; the integration uses the existing `Payment`
model.

## Before configuring the app

1. Create and activate a PayU merchant account and enable the required payment
   methods for your business.
2. Obtain the **test** merchant key and salt from the PayU dashboard. Do not
   use production credentials for testing.
3. Deploy the backend to a public HTTPS address. PayU cannot post callbacks to
   `localhost`; use an HTTPS tunnel only for temporary development testing.
4. Ensure the backend can make outbound HTTPS requests to PayU's payment
   verification endpoint.

## Configure the backend

Set these values in `server/.env` (do not commit that file):

```dotenv
PAYMENT_PROVIDER=payu
PAYU_ENV=test
PAYU_KEY=your_test_merchant_key
PAYU_SALT=your_test_merchant_salt
PAYU_CALLBACK_URL=https://api.example.com/api/orders/payu/callback
FRONTEND_URL=https://portal.example.com
```

`PAYU_CALLBACK_URL` must be the exact public HTTPS address of the backend
callback. Configure this same URL as the success and failure URL in PayU's
dashboard if your account requires callback URLs to be registered. The app
uses the one callback for both outcomes and distinguishes them using PayU's
verified transaction status.

Restart the backend after changing environment variables. The portal will then
show the payment email field and PayU checkout action. Checkout amount,
discounts, and coupons are recalculated and reserved by the backend; the
browser does not supply the amount.

## Test before launch

1. Keep `PAYU_ENV=test` and use test credentials.
2. Sign in to the portal and place an order. Confirm that the PayU-hosted
   checkout opens with the expected total and customer email.
3. Test a successful payment and confirm the order shows **Payment successful**
   only after the backend verifies it with PayU.
4. Test a declined/cancelled payment. Confirm it is not shown as paid and that
   an eligible coupon is released.
5. Test a pending or unavailable verification response; the order must remain
   pending until PayU confirms its final state.
6. Confirm the PayU dashboard shows the matching transaction and amount, and
   check backend logs for callback/verification errors. Do not log or share the
   merchant salt.

An uncompleted or failed payment leaves that order unpaid. Place a new order to
start another payment attempt.

## Go live

After PayU activates the account and approves the integration:

1. Set `PAYU_ENV=production`.
2. Replace the test key and salt with the production key and salt.
3. Set `PAYU_CALLBACK_URL` and `FRONTEND_URL` to the production HTTPS domains.
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
