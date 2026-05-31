"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { Address } from "@/types";

export default function AdressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    label: "Domicile",
    first_name: "",
    last_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    postal_code: "",
    phone: "",
    is_default: false,
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/connexion?redirect=/compte/adresses");
      return;
    }
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });
    setAddresses((data as Address[]) ?? []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("addresses").insert({
      user_id: user.id,
      label: form.label,
      first_name: form.first_name,
      last_name: form.last_name,
      company: null,
      address_line1: form.address_line1,
      address_line2: form.address_line2 || null,
      city: form.city,
      postal_code: form.postal_code,
      country: "FR",
      phone: form.phone,
      is_default: form.is_default,
    });

    setShowForm(false);
    setForm({
      label: "Domicile",
      first_name: "",
      last_name: "",
      address_line1: "",
      address_line2: "",
      city: "",
      postal_code: "",
      phone: "",
      is_default: false,
    });
    loadAddresses();
  }

  async function deleteAddress(id: string) {
    const supabase = createClient();
    await supabase.from("addresses").delete().eq("id", id);
    loadAddresses();
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/compte" className="text-sm text-emerald-700 hover:underline">
        ← Retour au compte
      </Link>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-stone-900">Mes adresses</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-1 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-stone-200 bg-white p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Prénom</Label>
              <Input className="mt-1" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
            </div>
            <div>
              <Label>Nom</Label>
              <Input className="mt-1" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
            </div>
          </div>
          <div>
            <Label>Adresse</Label>
            <Input className="mt-1" value={form.address_line1} onChange={(e) => setForm({ ...form, address_line1: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Code postal</Label>
              <Input className="mt-1" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} required />
            </div>
            <div>
              <Label>Ville</Label>
              <Input className="mt-1" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            </div>
          </div>
          <div>
            <Label>Téléphone</Label>
            <Input className="mt-1" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <Button type="submit">Enregistrer l&apos;adresse</Button>
        </form>
      )}

      <div className="mt-6 space-y-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{addr.label}</span>
                  {addr.is_default && (
                    <span className="flex items-center gap-1 text-xs text-emerald-700">
                      <Star className="h-3 w-3 fill-current" /> Par défaut
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-stone-600">
                  {addr.first_name} {addr.last_name}<br />
                  {addr.address_line1}<br />
                  {addr.postal_code} {addr.city}<br />
                  {addr.phone}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteAddress(addr.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
        {addresses.length === 0 && !showForm && (
          <p className="py-8 text-center text-stone-500">Aucune adresse enregistrée</p>
        )}
      </div>
    </div>
  );
}
