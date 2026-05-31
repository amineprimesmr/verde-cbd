import { redirect } from "next/navigation";

export default function InscriptionPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const params = new URLSearchParams();
  if (searchParams.redirect) {
    params.set("redirect", searchParams.redirect);
  }
  const query = params.toString();
  redirect(query ? `/connexion?${query}` : "/connexion");
}
