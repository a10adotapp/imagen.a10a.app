"use server";

import { auth } from "@/lib/auth";
import { appUrl } from "@/lib/env/app-url";
import { stripeSecretKey } from "@/lib/env/stripe-secret-key";
import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function createStripeCheckoutSession(): Promise<string> {
  const session = await auth();

  try {
    if (!session) {
      throw new Error("no session");
    }

    const stripe = new Stripe(await stripeSecretKey());

    let stripeCustomerId = session.user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        name: session.user.id,
      });

      const user = await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          updatedAt: new Date(),
          stripeCustomerId: customer.id,
        },
      });

      stripeCustomerId = user.stripeCustomerId;
    }

    if (!stripeCustomerId) {
      throw new Error("no stripe customer id");
    }

    const { url } = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: "JPY",
            product_data: {
              name: "マイスタンプ生成チケット",
              description: "マイスタンプを生成するためのチケットです",
            },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],
      success_url: [await appUrl(), "/line-stamps/new"].join(""),
      cancel_url: [await appUrl(), "/line-stamps"].join(""),
    });

    if (!url) {
      throw new Error("no url generated");
    }

    return url;
  } catch (err) {
    logger.error({
      action: import.meta.filename,
      error: err,
    });

    throw err;
  }
}
