import type { MetadataRoute } from "next";
import { COMMERCE_ENABLED } from "@/lib/commerce";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: COMMERCE_ENABLED ? ["/admin", "/compte", "/api", "/checkout", "/commande"] : ["/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
