"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
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
            <Input id="name" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="subject">Sujet</Label>
            <Input id="subject" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={5} required className="mt-1" />
          </div>
          <Button type="submit" className="w-full">Envoyer</Button>
        </form>
      )}

      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6 text-sm text-stone-600">
        <p><strong>Email :</strong> contact@verde-cbd.fr</p>
        <p className="mt-1"><strong>Téléphone :</strong> 01 23 45 67 89</p>
        <p className="mt-1"><strong>Horaires :</strong> Lun-Ven, 9h-18h</p>
      </div>
    </div>
  );
}
