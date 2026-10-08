"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ChevronDown,
  Landmark,
  Loader2,
  Lock,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import type { Product, ShippingRate } from "@/types";
import {
  FREE_SHIPPING_THRESHOLD,
  getLinePriceCents,
  getOrderTotals,
  getShippingCents,
} from "@/lib/pricing";
import { DEV_CHECKOUT_DEFAULTS, saveDevOrder } from "@/lib/dev-checkout";
import { DevCheckoutPanel } from "@/components/shop/dev-checkout-panel";
import { CheckoutOrderSummary } from "@/components/shop/checkout-order-summary";
import { OrderBump } from "@/components/shop/upsell/order-bump";
import { useCatalog } from "@/components/shop/upsell/use-catalog";
import { Logo } from "@/components/layout/logo";

const checkoutSchema = z.object({
  email: z.string().trim().email("Saisissez une adresse e-mail valide (ex. nom@exemple.fr)"),
  shipping_first_name: z.string().trim().min(2, "Saisissez votre prénom"),
  shipping_last_name: z.string().trim().min(2, "Saisissez votre nom"),
  shipping_address_line1: z
    .string()
    .trim()
    .min(5, "Saisissez votre adresse (numéro et rue)"),
  shipping_address_line2: z.string().optional(),
  shipping_city: z.string().trim().min(2, "Saisissez votre ville"),
  shipping_postal_code: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres"),
  shipping_phone: z
    .string()
    .trim()
    .regex(
      /^(?:(?:\+|00)33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/,
      "Numéro invalide (ex. 06 12 34 56 78)"
    ),
  billing_same_as_shipping: z.boolean(),
  billing_first_name: z.string().optional(),
  billing_last_name: z.string().optional(),
  billing_address_line1: z.string().optional(),
  billing_city: z.string().optional(),
  billing_postal_code: z.string().optional(),
  marketing_opt_in: z.boolean().optional(),
  sms_updates: z.boolean().optional(),
  payment_method: z.enum(["card", "bank_transfer"]),
  age_confirmed: z.literal(true),
  terms_accepted: z.literal(true),
}).superRefine((data, ctx) => {
  if (data.billing_same_as_shipping) return;
  for (const field of ["billing_first_name", "billing_last_name", "billing_address_line1", "billing_city"] as const) {
    if ((data[field]?.trim().length ?? 0) < 2) ctx.addIssue({ code: "custom", path: [field], message: "Champ de facturation requis" });
  }
  if (!/^\d{5}$/.test(data.billing_postal_code ?? "")) ctx.addIssue({ code: "custom", path: ["billing_postal_code"], message: "Code postal invalide" });
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  shippingRates: ShippingRate[];
  catalog?: Product[];
  demoMode?: boolean;
}

const checkoutInputClass =
  "h-[52px] w-full rounded-[10px] border border-border bg-card px-4 text-[15px] text-foreground placeholder:text-muted-foreground transition-colors focus:border-foreground focus:outline-none focus:ring-1 focus:ring-black/10 aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500/10";

function CheckoutField({
  error,
  children,
}: {
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 flex items-center gap-1 text-xs text-red-600"
            role="alert"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-[22px] font-semibold tracking-tight text-foreground">{title}</h2>
      {action}
    </div>
  );
}

function CardBrandIcons() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-bold text-[#1a1f71]">
        VISA
      </span>
      <span className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-bold text-[#eb001b]">
        MC
      </span>
      <span className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-bold text-[#006fcf]">
        CB
      </span>
    </div>
  );
}

const REASSURANCE = [
  { icon: ShieldCheck, title: "Paiement sécurisé", text: "Chiffré et traité par Mollie" },
  { icon: Truck, title: "Envoi discret", text: `Offert dès ${formatPrice(FREE_SHIPPING_THRESHOLD)}` },
  { icon: RotateCcw, title: "14 jours", text: "Pour changer d'avis" },
];

export function CheckoutForm({ shippingRates, catalog: initialCatalog, demoMode = false }: CheckoutFormProps) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const syncProducts = useCartStore((s) => s.syncProducts);
  const catalog = useCatalog(initialCatalog);
  const [selectedShipping, setSelectedShipping] = useState(
    shippingRates.find((r) => r.price_cents > 0)?.id ?? shippingRates[0]?.id ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);

  const subtotal = items.reduce((s, i) => s + getLinePriceCents(i.product, i.quantity), 0);
  // Au-delà du seuil tous les modes sont offerts : le tarif « gratuit » dédié ferait doublon.
  const paidRates = shippingRates.filter((r) => r.price_cents > 0 && subtotal >= r.min_order_cents);
  const visibleRates = paidRates.length ? paidRates : shippingRates;
  const shippingRate =
    visibleRates.find((r) => r.id === selectedShipping) ?? visibleRates[0] ?? shippingRates[0];
  const shippingCents = getShippingCents(shippingRate, subtotal);
  const totals = getOrderTotals(subtotal, shippingCents);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onTouched",
    defaultValues: {
      billing_same_as_shipping: true,
      marketing_opt_in: false,
      sms_updates: false,
      payment_method: "card",
      age_confirmed: true,
      terms_accepted: true,
    },
  });

  const paymentMethod = watch("payment_method");
  const billingSame = watch("billing_same_as_shipping");
  const postalCode = watch("shipping_postal_code");
  const city = watch("shipping_city");
  const addressLine1 = watch("shipping_address_line1");
  const addressComplete =
    /^\d{5}$/.test(postalCode ?? "") &&
    (city?.trim().length ?? 0) >= 2 &&
    (addressLine1?.trim().length ?? 0) >= 5;

  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  function fillDevDefaults() {
    reset({
      ...DEV_CHECKOUT_DEFAULTS,
      payment_method: "card",
      marketing_opt_in: true,
      sms_updates: false,
    });
  }

  async function submitOrder(data: CheckoutFormValues, saveAccount: boolean) {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(demoMode ? "/api/checkout/dev" : "/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          shipping_first_name: data.shipping_first_name,
          shipping_last_name: data.shipping_last_name,
          shipping_address_line1: data.shipping_address_line1,
          shipping_address_line2: data.shipping_address_line2,
          shipping_city: data.shipping_city,
          shipping_postal_code: data.shipping_postal_code,
          shipping_phone: data.shipping_phone,
          billing_same_as_shipping: data.billing_same_as_shipping,
          billing_first_name: data.billing_first_name,
          billing_last_name: data.billing_last_name,
          billing_address_line1: data.billing_address_line1,
          billing_city: data.billing_city,
          billing_postal_code: data.billing_postal_code,
          payment_method: data.payment_method,
          age_confirmed: true,
          terms_accepted: true,
          // Le serveur recalcule tous les montants ; le total de ligne sert
          // uniquement à détecter un prix modifié depuis l'ajout au panier.
          items: items.map((i) => ({
            product_id: i.product.id,
            quantity: i.quantity,
            line_total_cents: getLinePriceCents(i.product, i.quantity),
          })),
          shipping_rate_id: shippingRate?.id,
        }),
      });

      const result = (await res.json().catch(() => ({}))) as {
        error?: string;
        products?: Product[];
        payment_url?: string;
        order_number?: string;
        order_token?: string;
        order?: import("@/types").Order;
      };

      if (!res.ok) {
        if (res.status === 409 && result.products?.length) {
          // Prix ou stock modifiés : on met le panier à jour pour que le client vérifie.
          syncProducts(result.products);
          throw new Error(
            `${result.error ?? "Votre panier a été mis à jour."} Vérifiez le récapitulatif puis validez à nouveau.`
          );
        }
        throw new Error(
          result.error ??
            (res.status >= 500
              ? "Le serveur ne répond pas. Aucun montant n'a été débité, merci de réessayer."
              : "Impossible de valider la commande. Vérifiez vos informations.")
        );
      }

      if (demoMode && result.order) {
        saveDevOrder(result.order);
        clearCart();
        router.push(`/commande/${result.order_number}?dev=1`);
        return;
      }
      if (saveAccount) {
        sessionStorage.setItem(
          "verde-checkout-save-account",
          JSON.stringify({ email: data.email })
        );
      }

      if (result.payment_url) {
        clearCart();
        window.location.href = result.payment_url;
        return; // on garde l'état de chargement pendant la redirection
      }
      clearCart();
      router.push(`/commande/${result.order_number}?token=${encodeURIComponent(result.order_token ?? "")}`);
    } catch (err) {
      setLoading(false);
      if (err instanceof TypeError) {
        setError("Connexion interrompue. Vérifiez votre réseau puis réessayez.");
      } else {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      }
    }
  }

  function onInvalid() {
    setError(null);
    const first = document.querySelector<HTMLElement>("[aria-invalid='true']");
    first?.focus();
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-5 py-16 text-center">
        <Logo className="h-8 sm:h-9" />
        <p className="mt-8 text-lg font-semibold text-foreground">Votre panier est vide</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Ajoutez des produits pour passer commande.
        </p>
        <Link
          href="/boutique"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground"
        >
          Retour à la boutique
        </Link>
      </div>
    );
  }

  const summary = (showFooter: boolean) => (
    <CheckoutOrderSummary
      items={items}
      subtotalCents={totals.subtotal}
      shippingCents={shippingCents}
      taxCents={totals.tax}
      totalCents={totals.total}
      discountCode={discountCode}
      onDiscountCodeChange={setDiscountCode}
      showFooter={showFooter}
      shippingPending={!addressComplete}
    />
  );

  const inv = (name: keyof CheckoutFormValues) =>
    errors[name] ? { "aria-invalid": true as const } : {};

  return (
    <>
      <div className="min-h-screen lg:grid lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_480px]">
        <div className="bg-card lg:flex lg:justify-end">
          <div className="mx-auto w-full max-w-[520px] pb-12 lg:max-w-[580px] lg:px-10 lg:py-10 xl:px-14">
            <header className="flex flex-col items-center px-5 pt-8 text-center lg:items-start lg:px-0 lg:pt-0 lg:text-left">
              <Link href="/" className="flex w-full justify-center lg:justify-start">
                <Logo className="h-8 sm:h-9" priority />
              </Link>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-muted-foreground lg:justify-start">
                {REASSURANCE.map(({ icon: Icon, title }) => (
                  <span key={title} className="inline-flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="font-bold text-foreground">{title}</span>
                  </span>
                ))}
              </div>
            </header>

            {/* Résumé mobile repliable */}
            <div className="mt-6 border-y border-border bg-cream lg:hidden">
              <button
                type="button"
                onClick={() => setSummaryOpen((v) => !v)}
                aria-expanded={summaryOpen}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="inline-flex items-center gap-2 text-[15px] font-medium text-foreground">
                  {summaryOpen ? "Masquer" : "Afficher"} le récapitulatif
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", summaryOpen && "rotate-180")}
                  />
                </span>
                <span className="text-[17px] font-bold text-foreground">
                  {formatPrice(totals.total)}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {summaryOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border bg-card px-5 py-4">
                      {summary(false)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <form
              noValidate
              onSubmit={handleSubmit((data) => submitOrder(data, false), onInvalid)}
              className="px-5 pt-8 lg:px-0 lg:pt-10"
              aria-busy={loading}
            >
              {/* Contact */}
              <section>
                <SectionTitle
                  title="Contact"
                  action={
                    <Link
                      href="/connexion?redirect=/checkout"
                      className="text-[13px] text-accent underline underline-offset-2"
                    >
                      Se connecter
                    </Link>
                  }
                />
                <CheckoutField error={errors.email?.message}>
                  <input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="Adresse e-mail"
                    className={checkoutInputClass}
                    {...inv("email")}
                    {...register("email")}
                  />
                </CheckoutField>
                <p className="mt-2 text-[12px] text-muted-foreground">
                  Pour la confirmation et le suivi de votre commande.
                </p>

              </section>

              {/* Livraison */}
              <section className="mt-10">
                <SectionTitle title="Livraison" />
                <div className="space-y-3">
                  <div className="relative">
                    <select
                      disabled
                      className={cn(checkoutInputClass, "appearance-none pr-10 text-foreground")}
                      defaultValue="FR"
                      aria-label="Pays"
                    >
                      <option value="FR">France métropolitaine</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <CheckoutField error={errors.shipping_first_name?.message}>
                      <input
                        placeholder="Prénom"
                        autoComplete="given-name"
                        className={checkoutInputClass}
                        {...inv("shipping_first_name")}
                        {...register("shipping_first_name")}
                      />
                    </CheckoutField>
                    <CheckoutField error={errors.shipping_last_name?.message}>
                      <input
                        placeholder="Nom"
                        autoComplete="family-name"
                        className={checkoutInputClass}
                        {...inv("shipping_last_name")}
                        {...register("shipping_last_name")}
                      />
                    </CheckoutField>
                  </div>

                  <CheckoutField error={errors.shipping_address_line1?.message}>
                    <input
                      placeholder="Adresse"
                      autoComplete="address-line1"
                      className={checkoutInputClass}
                      {...inv("shipping_address_line1")}
                      {...register("shipping_address_line1")}
                    />
                  </CheckoutField>

                  <input
                    placeholder="Appartement, bâtiment, etc. (optionnel)"
                    autoComplete="address-line2"
                    className={checkoutInputClass}
                    {...register("shipping_address_line2")}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <CheckoutField error={errors.shipping_postal_code?.message}>
                      <input
                        placeholder="Code postal"
                        autoComplete="postal-code"
                        inputMode="numeric"
                        maxLength={5}
                        className={checkoutInputClass}
                        {...inv("shipping_postal_code")}
                        {...register("shipping_postal_code")}
                      />
                    </CheckoutField>
                    <CheckoutField error={errors.shipping_city?.message}>
                      <input
                        placeholder="Ville"
                        autoComplete="address-level2"
                        className={checkoutInputClass}
                        {...inv("shipping_city")}
                        {...register("shipping_city")}
                      />
                    </CheckoutField>
                  </div>

                  <CheckoutField error={errors.shipping_phone?.message}>
                    <input
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="Téléphone (pour le suivi de livraison)"
                      className={checkoutInputClass}
                      {...inv("shipping_phone")}
                      {...register("shipping_phone")}
                    />
                  </CheckoutField>
                </div>
              </section>

              {/* Mode d'expédition */}
              <section className="mt-10">
                <SectionTitle title="Mode d'expédition" />
                {!addressComplete ? (
                  <div className="rounded-[10px] bg-cream px-4 py-5 text-center text-[14px] text-muted-foreground">
                    Saisissez votre adresse pour voir les modes d&apos;expédition disponibles.
                  </div>
                ) : (
                  <div className="space-y-2" role="radiogroup" aria-label="Mode d'expédition">
                    {visibleRates.map((rate) => {
                      const price = getShippingCents(rate, subtotal);
                      const selected = shippingRate?.id === rate.id;
                      return (
                        <label
                          key={rate.id}
                          className={cn(
                            "flex cursor-pointer items-center justify-between rounded-[10px] border px-4 py-4 transition-colors",
                            selected
                              ? "border-foreground bg-cream"
                              : "border-border hover:border-stone"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              checked={selected}
                              onChange={() => setSelectedShipping(rate.id)}
                              className="h-4 w-4 accent-primary"
                            />
                            <div>
                              <p className="text-sm font-semibold text-foreground">{rate.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {rate.description || rate.estimated_days}
                              </p>
                            </div>
                          </div>
                          <span
                            className={cn(
                              "text-sm font-semibold",
                              price === 0 ? "text-primary" : "text-foreground"
                            )}
                          >
                            {price === 0 ? "OFFERT" : formatPrice(price)}
                          </span>
                        </label>
                      );
                    })}
                    {subtotal < FREE_SHIPPING_THRESHOLD && (
                      <p className="pt-1 text-[12px] text-muted-foreground">
                        Livraison offerte dès {formatPrice(FREE_SHIPPING_THRESHOLD)} — plus que{" "}
                        <strong className="text-foreground">
                          {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}
                        </strong>
                        .
                      </p>
                    )}
                  </div>
                )}
              </section>

              {/* Order bump */}
              <OrderBump catalog={catalog} className="mt-8" />

              {/* Paiement */}
              <section className="mt-10">
                <SectionTitle title="Paiement" />
                <p className="-mt-2 mb-4 flex items-center gap-1.5 text-[13px] text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  Transactions sécurisées et chiffrées par Mollie.
                </p>

                <div className="overflow-hidden rounded-[10px] border border-border">
                  <label
                    className={cn(
                      "flex cursor-pointer items-center justify-between border-b border-border px-4 py-4",
                      paymentMethod === "card" ? "bg-card" : "bg-cream"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value="card"
                        {...register("payment_method")}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="text-sm font-medium text-foreground">Carte bancaire</span>
                    </div>
                    <CardBrandIcons />
                  </label>
                  {paymentMethod === "card" && (
                    <div className="border-b border-border bg-cream px-4 py-4 text-[13px] leading-relaxed text-muted-foreground">
                      Après validation, vous serez redirigé vers la page de paiement
                      sécurisée Mollie (3-D Secure). Vos données bancaires ne
                      transitent jamais par notre site.
                    </div>
                  )}

                  <label
                    className={cn(
                      "flex cursor-pointer items-center justify-between px-4 py-4",
                      paymentMethod === "bank_transfer" ? "bg-card" : "bg-cream"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value="bank_transfer"
                        {...register("payment_method")}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="text-sm font-medium text-foreground">Virement bancaire</span>
                    </div>
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                  </label>
                  {paymentMethod === "bank_transfer" && (
                    <div className="border-t border-border bg-cream px-4 py-4 text-[13px] leading-relaxed text-muted-foreground">
                      Les coordonnées bancaires apparaissent après confirmation. La
                      commande est expédiée à réception du virement.
                    </div>
                  )}
                </div>

                <label className="mt-4 flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-border accent-primary"
                    {...register("billing_same_as_shipping")}
                  />
                  <span className="text-[13px] text-muted-foreground">
                    Adresse de facturation identique à l&apos;adresse de livraison
                  </span>
                </label>
                {!billingSame && <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {([
                    ["billing_first_name", "Prénom de facturation"],
                    ["billing_last_name", "Nom de facturation"],
                    ["billing_address_line1", "Adresse de facturation"],
                    ["billing_city", "Ville de facturation"],
                    ["billing_postal_code", "Code postal de facturation"],
                  ] as const).map(([field, label]) => <CheckoutField key={field} error={errors[field]?.message}><input aria-label={label} placeholder={label} className={checkoutInputClass} {...register(field)} /></CheckoutField>)}
                </div>}
              </section>

              <div ref={errorRef}>
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      role="alert"
                      className="mt-6 flex gap-2.5 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-primary text-[15px] font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {paymentMethod === "card" ? "Redirection vers le paiement…" : "Validation…"}
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      {demoMode ? "Tester la commande" : paymentMethod === "card" ? "Payer" : "Commander"} {formatPrice(totals.total)}
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                {REASSURANCE.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-[10px] bg-cream px-2 py-3">
                    <Icon className="mx-auto h-4 w-4 text-foreground" />
                    <p className="mt-1.5 text-[12px] font-bold text-foreground">{title}</p>
                    <p className="text-[11px] leading-snug text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-left text-[11px] leading-relaxed text-muted-foreground">
                En passant commande, vous confirmez avoir 18 ans ou plus et acceptez nos{" "}
                <Link href="/cgv" className="underline">
                  conditions générales de vente
                </Link>{" "}
                et notre{" "}
                <Link href="/politique-confidentialite" className="underline">
                  politique de confidentialité
                </Link>
                .
              </p>

              <div className="mt-10 lg:hidden">{summary(true)}</div>
            </form>
          </div>
        </div>

        <aside className="hidden border-l border-border bg-cream lg:block">
          <div className="sticky top-0 max-h-screen overflow-y-auto px-8 py-10 xl:px-12">
            {summary(true)}
          </div>
        </aside>
      </div>

      <DevCheckoutPanel
        shippingCents={shippingCents}
        totalCents={totals.total}
        onFillForm={fillDevDefaults}
      />
    </>
  );
}
