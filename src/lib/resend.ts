import { Resend } from "resend";

let resend: Resend | null = null;

export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export const CONTACT_INBOX_EMAIL =
  process.env.CONTACT_INBOX_EMAIL || FROM_EMAIL;
