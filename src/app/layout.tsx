import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import { getSetting } from "@/lib/db/queries";

const inter = Inter({ subsets: ["latin"] });

const DEFAULT_TITLE = "LDC Virtual Goods Shop";
const DEFAULT_DESCRIPTION = "High-quality virtual goods, instant delivery";

export async function generateMetadata(): Promise<Metadata> {
  let shopName: string | null = null;
  try {
    shopName = await getSetting("shop_name");
  } catch {
    shopName = null;
  }
  return {
    title: shopName?.trim() || DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let backgroundUrl: string | null = null
  let backgroundBlur = 0
  try {
    backgroundUrl = await getSetting("site_background_url")
  } catch {
    backgroundUrl = null
  }
  try {
    const rawBlur = await getSetting("site_background_blur")
    const blurValue = Number.parseInt(rawBlur || "0", 10)
    backgroundBlur = Number.isFinite(blurValue) ? Math.min(Math.max(blurValue, 0), 60) : 0
  } catch {
    backgroundBlur = 0
  }
  const normalizedBackgroundUrl = backgroundUrl?.trim() || ""
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        {normalizedBackgroundUrl ? (
          <div
            className="site-background pointer-events-none fixed inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${normalizedBackgroundUrl})`,
              filter: `blur(${backgroundBlur}px)`,
              transform: "scale(1.02)",
            }}
            aria-hidden
          />
        ) : null}
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
