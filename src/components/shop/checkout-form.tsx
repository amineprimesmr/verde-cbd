"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ChevronDown,
  Clock,
  HelpCircle,
  Lock,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import type { ShippingRate } from "@/types";
import {
  calculateOrderTotal,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/data/catalog";
import { DEV_CHECKOUT_DEFAULTS } from "@/lib/dev-checkout";
import { DevCheckoutPanel } from "@/components/shop/dev-checkout-panel";
import { CheckoutOrderSummary } from "@/components/shop/checkout-order-summary";
import { SatisfiedClientsBadge } from "@/components/shop/satisfied-clients-badge";
import { Logo } from "@/components/layout/logo";

const checkoutSchema = z.object({
  email: z.string().email("Email invalide"),
  shipping_first_name: z.string().min(2, "Prénom requis"),
  shipping_last_name: z.string().min(2, "Nom requis"),
  shipping_address_line1: z.string().min(5, "Adresse requise"),
  shipping_address_line2: z.string().optional(),
  shipping_city: z.string().min(2, "Ville requise"),
  shipping_postal_code: z
    .string()
    .regex(/^\d{5}$/, "Code postal invalide (5 chiffres)"),
  shipping_phone: z.string().min(10, "Téléphone requis"),
  billing_same_as_shipping: z.boolean(),
  marketing_opt_in: z.boolean().optional(),
  sms_updates: z.boolean().optional(),
  payment_method: z.enum(["card", "paypal"]),
  age_confirmed: z.literal(true),
  terms_accepted: z.literal(true),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  shippingRates: ShippingRate[];
}

function formatCheckoutPrice(cents: number) {
  return formatPrice(cents).replace(/\u00a0/g, " ");
}

const checkoutInputClass =
  "h-[52px] w-full rounded-[10px] border border-[#d9d9d9] bg-white px-4 text-[15px] text-black placeholder:text-[#999] focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10";

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
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
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
      <h2 className="text-[22px] font-semibold tracking-tight text-black">
        {title}
      </h2>
      {action}
    </div>
  );
}

function CardBrandIcons() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="rounded border border-[#e5e5e5] bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#1a1f71]">
        VISA
      </span>
      <span className="rounded border border-[#e5e5e5] bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#eb001b]">
        MC
      </span>
      <span className="rounded border border-[#e5e5e5] bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#006fcf]">
        AMEX
      </span>
      <span className="rounded border border-[#e5e5e5] bg-[#f6f6f6] px-1.5 py-0.5 text-[10px] font-medium text-[#666]">
        +2
      </span>
    </div>
  );
}

export function CheckoutForm({ shippingRates }: CheckoutFormProps) {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [selectedShipping, setSelectedShipping] = useState(
    shippingRates[0]?.id ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");

  const subtotal = getSubtotal();
  const shippingRate =
    shippingRates.find((r) => r.id === selectedShipping) ?? shippingRates[0];
  const shippingCents =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : (shippingRate?.price_cents ?? 590);
  const totals = calculateOrderTotal(subtotal, shippingCents);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      billing_same_as_shipping: true,
      marketing_opt_in: true,
      sms_updates: false,
      payment_method: "card",
      age_confirmed: true,
      terms_accepted: true,
    },
  });

  const paymentMethod = watch("payment_method");
  const postalCode = watch("shipping_postal_code");
  const city = watch("shipping_city");
  const addressLine1 = watch("shipping_address_line1");
  const addressComplete =
    /^\d{5}$/.test(postalCode ?? "") &&
    (city?.length ?? 0) >= 2 &&
    (addressLine1?.length ?? 0) >= 5;

  function fillDevDefaults() {
    reset({
      ...DEV_CHECKOUT_DEFAULTS,
      payment_method: "card",
      marketing_opt_in: true,
      sms_updates: false,
    });
  }

  async function submitOrder(
    data: CheckoutFormValues,
    saveAccount: boolean
  ) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
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
          payment_method:
            data.payment_method === "paypal" ? "bank_transfer" : "card",
          age_confirmed: true,
          terms_accepted: true,
          items: items.map((i) => ({
            product_id: i.product.id,
            product_name: i.product.name,
            product_sku: i.product.sku,
            quantity: i.quantity,
            unit_price_cents: i.product.price_cents,
          })),
          shipping_rate_id: selectedShipping,
          shipping_cents: shippingCents,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Erreur lors de la commande");
      }

      clearCart();

      if (saveAccount) {
        sessionStorage.setItem(
          "verde-checkout-save-account",
          JSON.stringify({ email: data.email })
        );
      }

      if (result.payment_url) {
        window.location.href = result.payment_url;
      } else {
        router.push(`/commande/${result.order_number}?success=true`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-5 py-16 text-center">
        <div className="flex w-full justify-center">
          <Logo className="h-8 sm:h-9" />
        </div>
        <p className="mt-8 text-lg text-[#666]">Votre panier est vide</p>
        <Link
          href="/boutique"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-black px-8 text-sm font-semibold text-white"
        >
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen lg:grid lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_480px]">
        {/* Colonne gauche — formulaire */}
        <div className="bg-white lg:flex lg:justify-end">
          <div className="mx-auto w-full max-w-[520px] pb-12 lg:max-w-[580px] lg:px-10 lg:py-10 xl:px-14">
            <header className="flex flex-col items-center px-5 pt-8 text-center lg:items-start lg:px-0 lg:pt-0 lg:text-left">
              <div className="flex w-full justify-center lg:justify-start">
                <Logo className="h-8 sm:h-9" priority />
              </div>

              <SatisfiedClientsBadge className="mt-5" />

              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-[#666] lg:justify-start">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Livraison <span className="font-bold text-black">RAPIDE</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Garantie <span className="font-bold text-black">30 jours</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  Paiement <span className="font-bold text-black">sécurisé</span>
                </span>
              </div>
            </header>

            {/* Résumé mobile repliable */}
            <div className="mt-6 border-y border-[#ebebeb] bg-[#f5f5f5] lg:hidden">
              <button
                type="button"
                onClick={() => setSummaryOpen((v) => !v)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="inline-flex items-center gap-2 text-[15px] font-medium text-black">
                  Résumé de la commande
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      summaryOpen && "rotate-180"
                    )}
                  />
                </span>
                <span className="text-[17px] font-bold text-black">
                  {formatCheckoutPrice(totals.total)}
                </span>
              </button>

              {summaryOpen && (
                <div className="border-t border-[#ebebeb] bg-white px-5 py-4">
                  <CheckoutOrderSummary
                    items={items}
                    subtotalCents={totals.subtotal}
                    shippingCents={shippingCents}
                    totalCents={totals.total}
                    discountCode={discountCode}
                    onDiscountCodeChange={setDiscountCode}
                    showFooter={false}
                  />
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit((data) => submitOrder(data, false))}
              className="px-5 pt-8 lg:px-0 lg:pt-10"
            >
          {/* Express payment */}
          <div className="text-center">
            <p className="text-[13px] text-[#888]">Paiement express</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setValue("payment_method", "card");
                  handleSubmit((data) => submitOrder(data, false))();
                }}
                disabled={loading}
                className="flex h-[52px] items-center justify-center rounded-xl bg-[#5a31f4] text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                shop<span className="ml-0.5 font-normal">Pay</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue("payment_method", "paypal");
                  handleSubmit((data) => submitOrder(data, false))();
                }}
                disabled={loading}
                className="flex h-[52px] items-center justify-center rounded-xl bg-[#ffc439] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <span className="text-lg font-bold italic text-[#003087]">
                  Pay<span className="text-[#009cde]">Pal</span>
                </span>
              </button>
            </div>
            <p className="mt-3 text-left text-[11px] leading-relaxed text-[#888]">
              En cliquant sur Payer avec shop Pay ou PayPal, vous acceptez les
              conditions générales de Verde CBD. Vous pouvez annuler votre
              commande tant qu&apos;elle n&apos;a pas été expédiée.
            </p>
          </div>

          <div className="relative my-8 flex items-center">
            <div className="flex-1 border-t border-[#e5e5e5]" />
            <span className="px-4 text-xs font-medium text-[#999]">OU</span>
            <div className="flex-1 border-t border-[#e5e5e5]" />
          </div>

          {/* Contact */}
          <section>
            <SectionTitle
              title="Contact"
              action={
                <Link
                  href="/connexion"
                  className="text-[13px] text-[#1773b0] underline underline-offset-2"
                >
                  Se connecter
                </Link>
              }
            />
            <CheckoutField error={errors.email?.message}>
              <input
                type="email"
                placeholder="Adresse e-mail"
                className={checkoutInputClass}
                {...register("email")}
              />
            </CheckoutField>
            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-[#d9d9d9] accent-black"
                {...register("marketing_opt_in")}
              />
              <span className="text-[13px] leading-snug text-[#333]">
                🚚 Recevez nos conseils et le suivi par email en cochant cette
                case.
              </span>
            </label>
          </section>

          {/* Livraison */}
          <section className="mt-10">
            <SectionTitle title="Livraison" />
            <div className="space-y-3">
              <div className="relative">
                <select
                  disabled
                  className={cn(
                    checkoutInputClass,
                    "appearance-none pr-10 text-black"
                  )}
                  defaultValue="FR"
                >
                  <option value="FR">France</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CheckoutField error={errors.shipping_first_name?.message}>
                  <input
                    placeholder="Prénom"
                    className={checkoutInputClass}
                    {...register("shipping_first_name")}
                  />
                </CheckoutField>
                <CheckoutField error={errors.shipping_last_name?.message}>
                  <input
                    placeholder="Nom"
                    className={checkoutInputClass}
                    {...register("shipping_last_name")}
                  />
                </CheckoutField>
              </div>

              <CheckoutField error={errors.shipping_address_line1?.message}>
                <div className="relative">
                  <input
                    placeholder="Adresse"
                    className={cn(checkoutInputClass, "pr-11")}
                    {...register("shipping_address_line1")}
                  />
                  <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
                </div>
              </CheckoutField>

              <input
                placeholder="Appartement, suite, etc. (optionnel)"
                className={checkoutInputClass}
                {...register("shipping_address_line2")}
              />

              <div className="grid grid-cols-2 gap-3">
                <CheckoutField error={errors.shipping_postal_code?.message}>
                  <input
                    placeholder="Code postal"
                    className={checkoutInputClass}
                    {...register("shipping_postal_code")}
                  />
                </CheckoutField>
                <CheckoutField error={errors.shipping_city?.message}>
                  <input
                    placeholder="Ville"
                    className={checkoutInputClass}
                    {...register("shipping_city")}
                  />
                </CheckoutField>
              </div>

              <CheckoutField error={errors.shipping_phone?.message}>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Téléphone (le livreur vous contactera par SMS)"
                    className={cn(checkoutInputClass, "pr-11")}
                    {...register("shipping_phone")}
                  />
                  <HelpCircle className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
                </div>
              </CheckoutField>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-[#d9d9d9] accent-black"
                  {...register("sms_updates")}
                />
                <span className="text-[13px] text-[#333]">
                  Recevez les mises à jour à propos de votre commande par SMS
                </span>
              </label>
            </div>
          </section>

          {/* Mode d'expédition */}
          <section className="mt-10">
            <SectionTitle title="Mode d'expédition" />
            {!addressComplete ? (
              <div className="rounded-[10px] bg-[#f5f5f5] px-4 py-5 text-center text-[14px] text-[#666]">
                Saisissez votre adresse d&apos;expédition pour voir les modes
                d&apos;expédition disponibles.
              </div>
            ) : (
              <div className="space-y-2">
                {shippingRates.map((rate) => {
                  const price =
                    subtotal >= FREE_SHIPPING_THRESHOLD
                      ? 0
                      : rate.price_cents;
                  const selected = selectedShipping === rate.id;
                  return (
                    <label
                      key={rate.id}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-[10px] border px-4 py-4 transition-colors",
                        selected
                          ? "border-black bg-[#fafafa]"
                          : "border-[#d9d9d9] hover:border-[#999]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={selected}
                          onChange={() => setSelectedShipping(rate.id)}
                          className="h-4 w-4 accent-black"
                        />
                        <div>
                          <p className="text-sm font-semibold text-black">
                            {rate.name}
                          </p>
                          <p className="text-xs text-[#888]">
                            {rate.estimated_days}
                            {price === 0 ? " · Expédition gratuite" : ""}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-black">
                        {price === 0 ? "OFFERT" : formatCheckoutPrice(price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </section>

          {addressComplete && shippingRate && (
            <div className="mt-4 hidden rounded-[10px] bg-[#f5f5f5] px-4 py-4 text-[14px] text-[#666] lg:block">
              {shippingRate.name} ·{" "}
              {shippingCents === 0
                ? "Expédition gratuite"
                : formatCheckoutPrice(shippingCents)}{" "}
              · {shippingRate.estimated_days}
            </div>
          )}

          {/* Paiement */}
          <section className="mt-10">
            <SectionTitle title="Paiement" />
            <p className="-mt-2 mb-4 text-[13px] text-[#666]">
              Toutes les transactions sont sécurisées et chiffrées.
            </p>

            <div className="overflow-hidden rounded-[10px] border border-[#d9d9d9]">
              {/* Carte de crédit */}
              <label
                className={cn(
                  "flex cursor-pointer items-center justify-between border-b border-[#d9d9d9] px-4 py-4",
                  paymentMethod === "card" ? "bg-white" : "bg-[#fafafa]"
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    value="card"
                    {...register("payment_method")}
                    className="h-4 w-4 accent-black"
                  />
                  <span className="text-sm font-medium text-black">
                    Carte de crédit
                  </span>
                </div>
                <CardBrandIcons />
              </label>

              {paymentMethod === "card" && (
                <div className="space-y-0 border-b border-[#d9d9d9] bg-[#fafafa]">
                  <div className="relative border-b border-[#e5e5e5]">
                    <input
                      placeholder="Numéro de carte"
                      className="h-[52px] w-full bg-transparent px-4 pr-11 text-[15px] placeholder:text-[#999] focus:outline-none"
                      autoComplete="cc-number"
                    />
                    <Lock className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
                  </div>
                  <div className="grid grid-cols-2 border-b border-[#e5e5e5]">
                    <input
                      placeholder="Date d'expiration (MM/AA)"
                      className="h-[52px] border-r border-[#e5e5e5] bg-transparent px-4 text-[15px] placeholder:text-[#999] focus:outline-none"
                      autoComplete="cc-exp"
                    />
                    <div className="relative">
                      <input
                        placeholder="Code de sécurité"
                        className="h-[52px] w-full bg-transparent px-4 pr-11 text-[15px] placeholder:text-[#999] focus:outline-none"
                        autoComplete="cc-csc"
                      />
                      <HelpCircle className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
                    </div>
                  </div>
                  <input
                    placeholder="Nom sur la carte"
                    className="h-[52px] w-full bg-transparent px-4 text-[15px] placeholder:text-[#999] focus:outline-none"
                    autoComplete="cc-name"
                  />
                </div>
              )}

              {/* PayPal */}
              <label
                className={cn(
                  "flex cursor-pointer items-center justify-between px-4 py-4",
                  paymentMethod === "paypal" ? "bg-white" : "bg-[#fafafa]"
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    value="paypal"
                    {...register("payment_method")}
                    className="h-4 w-4 accent-black"
                  />
                  <span className="text-sm font-medium text-black">PayPal</span>
                </div>
                <span className="text-base font-bold italic text-[#003087]">
                  Pay<span className="text-[#009cde]">Pal</span>
                </span>
              </label>
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-[#d9d9d9] accent-black"
                {...register("billing_same_as_shipping")}
              />
              <span className="text-[13px] text-[#333]">
                Utiliser l&apos;adresse d&apos;expédition comme adresse de
                facturation
              </span>
            </label>
          </section>

          {error && (
            <p className="mt-4 rounded-[10px] bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-8 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="flex h-[54px] w-full items-center justify-center rounded-xl bg-black text-[15px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Traitement..." : "Payer en tant qu'invité"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit((data) => submitOrder(data, true))}
              className="flex h-[54px] w-full items-center justify-center rounded-xl border-2 border-black bg-white text-[15px] font-bold text-black transition-colors hover:bg-[#fafafa] disabled:opacity-50"
            >
              Payer et enregistrer mes informations
            </button>
          </div>

          <p className="mt-5 text-left text-[11px] leading-relaxed text-[#666]">
            En cliquant sur « Payer et enregistrer mes informations », vous
            créez un compte Verde CBD et acceptez nos{" "}
            <Link href="/cgv" className="underline">
              Conditions d&apos;utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="/politique-confidentialite" className="underline">
              Politique de confidentialité
            </Link>
            .
          </p>

          <p className="mt-4 text-left text-[11px] leading-relaxed text-[#888]">
            En passant commande, vous confirmez avoir 18 ans ou plus et acceptez
            nos conditions générales de vente.
          </p>

          {/* Mobile only — récap complet sous le formulaire */}
          <div className="mt-10 lg:hidden">
            <CheckoutOrderSummary
              items={items}
              subtotalCents={totals.subtotal}
              shippingCents={shippingCents}
              totalCents={totals.total}
              discountCode={discountCode}
              onDiscountCodeChange={setDiscountCode}
            />
          </div>
            </form>
          </div>
        </div>

        {/* Colonne droite — récap commande (PC) */}
        <aside className="hidden border-l border-[#e1e1e1] bg-[#f5f5f5] lg:block">
          <div className="sticky top-0 max-h-screen overflow-y-auto px-8 py-10 xl:px-12">
            <CheckoutOrderSummary
              items={items}
              subtotalCents={totals.subtotal}
              shippingCents={shippingCents}
              totalCents={totals.total}
              discountCode={discountCode}
              onDiscountCodeChange={setDiscountCode}
            />
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
