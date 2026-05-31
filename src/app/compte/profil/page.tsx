"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ProfilPage() {
  const router = useRouter();
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/connexion?redirect=/compte/profil");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setForm({
        first_name: profile?.first_name ?? "",
        last_name: profile?.last_name ?? "",
        phone: profile?.phone ?? "",
        email: user.email ?? "",
      });
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .update({
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
      })
      .eq("id", user.id);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/compte" className="text-sm text-emerald-700 hover:underline">
        ← Retour au compte
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-stone-900">Mon profil</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Prénom</Label>
            <Input className="mt-1" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          </div>
          <div>
            <Label>Nom</Label>
            <Input className="mt-1" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </div>
        </div>
        <div>
          <Label>Email</Label>
          <Input className="mt-1" value={form.email} disabled />
        </div>
        <div>
          <Label>Téléphone</Label>
          <Input className="mt-1" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <Button type="submit">{saved ? "Enregistré ✓" : "Enregistrer"}</Button>
      </form>
    </div>
  );
}
