import { NextResponse } from "next/server";
import { sendContactNotificationEmail } from "@/lib/emails";

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = (await request.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    if (typeof name !== "string" || typeof email !== "string" || typeof subject !== "string" || typeof message !== "string" || !name.trim() || !subject.trim() || !message.trim() || name.length > 150 || subject.length > 200 || message.length > 5000 || email.length > 254) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    await sendContactNotificationEmail({ name, email, subject, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
