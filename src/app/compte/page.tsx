import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, MapPin, User, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Mon compte" };

export default async function ComptePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?redirect=/compte");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const links = [
    {
      href: "/compte/commandes",
      icon: Package,
      title: "Mes commandes",
      desc: `${orderCount ?? 0} commande(s)`,
    },
    {
      href: "/compte/adresses",
      icon: MapPin,
      title: "Mes adresses",
      desc: "Gérer vos adresses de livraison",
    },
    {
      href: "/compte/profil",
      icon: User,
      title: "Mon profil",
      desc: "Informations personnelles",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Mon compte</h1>
          <p className="mt-1 text-stone-500">
            Bonjour {profile?.first_name || user.email}
          </p>
        </div>
        <form action="/api/auth/signout" method="POST">
          <Button variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </form>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {links.map(({ href, icon: Icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border border-stone-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <Icon className="h-8 w-8 text-emerald-700" />
            <h2 className="mt-3 font-semibold text-stone-900">{title}</h2>
            <p className="mt-1 text-sm text-stone-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
