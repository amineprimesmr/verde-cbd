import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { sendNewsletterWelcomeEmail } from "@/lib/emails";

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email });

      if (error && error.code !== "23505") {
        console.error("Newsletter insert error:", error);
        return NextResponse.json(
          { error: "Erreur lors de l'inscription" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ error: "L'inscription est momentanément indisponible." }, { status: 503 });
    }

    await sendNewsletterWelcomeEmail(email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
