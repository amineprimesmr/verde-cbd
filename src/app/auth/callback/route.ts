import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/compte";

  if (!code) {
    return NextResponse.redirect(`${origin}/connexion?error=auth`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/connexion?error=auth`);
  }

  const safeRedirect = redirect.startsWith("/") ? redirect : "/compte";
  return NextResponse.redirect(`${origin}${safeRedirect}`);
}
