import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
    });
  }
  return stripe;
}

export const BANK_DETAILS = {
  iban: "FR76 1234 5678 9012 3456 7890 123",
  bic: "BNPAFRPPXXX",
  beneficiary: "Verde CBD SAS",
  reference: "Numéro de commande",
};
