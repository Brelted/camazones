import apiClient from './apiClient';

export const parseFcfaAmount = (value) => Number(String(value ?? '').replace(/[^0-9]/g, '')) || 0;

export const createStripeCheckoutSession = async ({ productTitle, amount, customerEmail, customerName }) =>
  apiClient.post('/payments/checkout-session', {
    productTitle,
    amount,
    currency: 'xaf',
    customerEmail,
    customerName,
    successUrl: 'https://camazones.local/payment/success?session_id={CHECKOUT_SESSION_ID}',
    cancelUrl: 'https://camazones.local/payment/cancel',
  });
