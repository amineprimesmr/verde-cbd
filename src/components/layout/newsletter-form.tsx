"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="mt-4 text-sm font-medium text-primary">
        Merci pour votre inscription !
      </p>
    );
  }

  return (
    <form className="mt-4 flex flex-col gap-2" onSubmit={handleSubmit}>
      <Input type="email" placeholder="votre@email.fr" required className="bg-white" />
      <Button type="submit" size="sm">
        S&apos;inscrire
      </Button>
    </form>
  );
}
