"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { CATEGORY_LABELS, type Product, type ProductCategory } from "@/types";

export default function AdminProduitsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    category: "fleurs" as ProductCategory,
    price_cents: 0,
    cbd_percent: 0,
    thc_percent: 0.3,
    stock: 0,
    sku: "",
    image_url: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/connexion");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      router.push("/");
      return;
    }

    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setProducts(
        data.map((p) => ({
          ...p,
          thc_percent: Number(p.thc_percent),
          cbd_percent: Number(p.cbd_percent),
          weight_grams: p.weight_grams ? Number(p.weight_grams) : null,
          images: (p.images as string[]) || [],
          tags: p.tags || [],
        })) as Product[]
      );
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setError(null);
    if (!Number.isFinite(form.price_cents) || form.price_cents <= 0 || !Number.isInteger(form.stock) || form.stock < 0) {
      setError("Indiquez un prix positif et un stock entier supérieur ou égal à zéro.");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const values = {
      name: form.name,
      slug: form.slug,
      description: form.description || form.short_description,
      short_description: form.short_description,
      category: form.category,
      price_cents: Math.round(form.price_cents * 100),
      compare_at_price_cents: null,
      thc_percent: form.thc_percent,
      cbd_percent: form.cbd_percent,
      weight_grams: null,
      stock: form.stock,
      sku: form.sku,
      image_url: form.image_url,
      coa_url: null,
      is_active: true,
      is_featured: false,
      images: form.image_url ? [form.image_url] : [],
      tags: [],
    };
    const result = editingId
      ? await supabase.from("products").update({ name: values.name, description: values.description, short_description: values.short_description, category: values.category, price_cents: values.price_cents, stock: values.stock, cbd_percent: values.cbd_percent, image_url: values.image_url, images: values.images }).eq("id", editingId)
      : await supabase.from("products").insert(values);
    setSaving(false);
    if (result.error) { setError("Enregistrement impossible. Vérifiez le SKU et le nom du produit."); return; }
    setShowForm(false);
    setEditingId(null);
    loadProducts();
  }

  async function toggleActive(id: string, isActive: boolean) {
    const supabase = createClient();
    const { error } = await supabase.from("products").update({ is_active: !isActive }).eq("id", id);
    if (error) { setError("La disponibilité n'a pas pu être modifiée."); return; }
    loadProducts();
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>

    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/admin" className="text-sm text-emerald-700 hover:underline">
        ← Dashboard
      </Link>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-stone-900">Gestion des produits</h1>
        <Button onClick={() => { setEditingId(null); setForm({ name: "", slug: "", description: "", short_description: "", category: "fleurs", price_cents: 0, cbd_percent: 0, thc_percent: 0, stock: 0, sku: "", image_url: "" }); setShowForm(!showForm); }}>
          {showForm ? "Annuler" : "Ajouter un produit"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-xl border border-stone-200 bg-white p-6 sm:grid-cols-2">
          <div>
            <Label>Nom</Label>
            <Input className="mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} required />
          </div>
          <div>
            <Label>SKU</Label>
            <Input className="mt-1" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
          </div>
          <div>
            <Label>Prix (€)</Label>
            <Input className="mt-1" type="number" step="0.01" value={form.price_cents} onChange={(e) => setForm({ ...form, price_cents: parseFloat(e.target.value) })} required />
          </div>
          <div>
            <Label>Stock</Label>
            <Input className="mt-1" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })} required />
          </div>
          <div>
            <Label>CBD %</Label>
            <Input className="mt-1" type="number" step="0.1" value={form.cbd_percent} onChange={(e) => setForm({ ...form, cbd_percent: parseFloat(e.target.value) })} />
          </div>
          <div>
            <Label>Catégorie</Label>
            <select className="mt-1 w-full rounded-lg border border-stone-200 p-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <Label>Description courte</Label>
            <Input className="mt-1" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label>URL image</Label>
            <Input className="mt-1" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={saving}>{saving ? "Enregistrement…" : editingId ? "Enregistrer les modifications" : "Créer le produit"}</Button>
          </div>
        </form>
      )}

      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <div className="mt-8 overflow-hidden rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <th className="px-4 py-3 text-left">Produit</th>
              <th className="px-4 py-3 text-left">Catégorie</th>
              <th className="px-4 py-3 text-right">Prix</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-center">Actif</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-stone-100">
                <td className="px-4 py-3 font-medium">{p.name}<button type="button" className="ml-3 text-xs text-emerald-700 underline" onClick={() => { setEditingId(p.id); setForm({ name: p.name, slug: p.slug, description: p.description, short_description: p.short_description, category: p.category, price_cents: p.price_cents / 100, cbd_percent: p.cbd_percent, thc_percent: p.thc_percent, stock: p.stock, sku: p.sku, image_url: p.image_url }); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Modifier</button></td>
                <td className="px-4 py-3">{CATEGORY_LABELS[p.category]}</td>
                <td className="px-4 py-3 text-right">{formatPrice(p.price_cents)}</td>
                <td className="px-4 py-3 text-right">{p.stock}</td>
                <td className="px-4 py-3 text-center">
                  <Button size="sm" variant="outline" onClick={() => toggleActive(p.id, p.is_active)}>
                    {p.is_active ? "Actif" : "Inactif"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
