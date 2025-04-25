import { z } from "zod";

export const chargeFailedEventSchema = z.object({
  id: z.string(),
  type: z.literal("charge.failed"),
});

export const chargeSucceededEventSchema = z.object({
  id: z.string(),
  type: z.literal("charge.succeeded"),
});

export const chargeUpdatedEventSchema = z.object({
  id: z.string(),
  type: z.literal("charge.updated"),
});

export const checkoutSessionCompletedEventSchema = z.object({
  id: z.string(),
  type: z.literal("checkout.session.completed"),
});

export const paymentIntentCreatedEventSchema = z.object({
  id: z.string(),
  type: z.literal("payment_intent.created"),
});

export const paymentIntentPaymentFailedEventSchema = z.object({
  id: z.string(),
  type: z.literal("payment_intent.payment_failed"),
});

export const paymentIntentPaymentSucceededEventSchema = z.object({
  id: z.string(),
  type: z.literal("payment_intent.succeeded"),
  data: z.object({
    object: z.object({
      id: z.string(),
      customer: z.string(),
      amount: z.number(),
      metadata: z.record(z.unknown()),
    }),
  }),
});

export const eventSchema = chargeFailedEventSchema
  .or(chargeSucceededEventSchema)
  .or(chargeUpdatedEventSchema)
  .or(checkoutSessionCompletedEventSchema)
  .or(paymentIntentCreatedEventSchema)
  .or(paymentIntentPaymentFailedEventSchema)
  .or(paymentIntentPaymentSucceededEventSchema);
