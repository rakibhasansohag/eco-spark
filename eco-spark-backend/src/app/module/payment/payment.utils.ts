import Stripe from "stripe";
import { envVars } from "../../config/env.js";

export const getStripeWebhookEvent = (payload: Buffer, signature: string): Stripe.Event => {
  return new Stripe(envVars.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  }).webhooks.constructEvent(payload, signature, envVars.STRIPE_WEBHOOK_SECRET);
};
