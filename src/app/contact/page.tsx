"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          subject: form.get("subject"),
          message: form.get("message"),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Une erreur est survenue");
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-stone-900">Contact</h1>
      <p className="mt-2 text-stone-500">
        Une question ? Notre équipe vous répond sous 24h.
      </p>

      {sent ? (
        <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <p className="font-semibold text-emerald-800">Message envoyé !</p>
          <p className="mt-1 text-sm text-emerald-700">
            Nous vous répondrons dans les plus brefs délais.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="subject">Sujet</Label>
            <Input id="subject" name="subject" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" rows={5} required className="mt-1" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Envoi..." : "Envoyer"}
          </Button>
        </form>
      )}

      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6 text-sm text-stone-600">
        <p>Utilisez le formulaire pour contacter la boutique.</p>
        <p className="mt-1"><strong>Téléphone :</strong> 01 23 45 67 89</p>
        <p className="mt-1"><strong>Horaires :</strong> Lun-Ven, 9h-18h</p>
      </div>
    </div>
  );
}
