import { Suspense } from "react";
import { ConnexionForm } from "@/components/auth/connexion-form";

export const metadata = {
  title: "Se connecter",
};

function ConnexionFallback() {
  return (
    <div className="mx-auto min-h-screen max-w-[520px] animate-pulse bg-white px-5 pt-8">
      <div className="mx-auto h-8 w-24 rounded bg-[#f0f0f0]" />
      <div className="mx-auto mt-5 h-10 w-64 rounded-full bg-[#f5ebe3]" />
      <div className="mt-10 h-8 w-48 rounded bg-[#f0f0f0]" />
      <div className="mt-3 h-5 w-56 rounded bg-[#f5f5f5]" />
      <div className="mt-6 h-[54px] w-full rounded-xl bg-[#f0f0f0]" />
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={<ConnexionFallback />}>
      <ConnexionForm />
    </Suspense>
  );
}
