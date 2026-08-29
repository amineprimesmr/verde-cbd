import { createMollieClient } from "@mollie/api-client";

let mollie: ReturnType<typeof createMollieClient> | null = null;

export function getMollie() {
  if (!process.env.MOLLIE_API_KEY) return null;
  if (!mollie) {
    mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });
  }
  return mollie;
}

export const BANK_DETAILS = {
  iban: "FR76 1234 5678 9012 3456 7890 123",
  bic: "BNPAFRPPXXX",
  beneficiary: "Verde CBD SAS",
  reference: "Numéro de commande",
};
