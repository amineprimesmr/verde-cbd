import { createMollieClient } from "@mollie/api-client";

let mollie: ReturnType<typeof createMollieClient> | null = null;

export function getMollie() {
  if (!process.env.MOLLIE_API_KEY) return null;
  if (!mollie) {
    mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });
  }
  return mollie;
}
