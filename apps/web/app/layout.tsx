import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { SwRegister } from "@/components/SwRegister";

const font = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://thuankhoi.com"),
  title: { default: "GAI – Tư duy chiến lược", template: "%s · GAI" },
  description: "Học và áp dụng lý thuyết trò chơi để ra quyết định tốt hơn.",
  applicationName: "GAI",
  appleWebApp: { capable: true, title: "GAI", statusBarStyle: "default" },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#111110" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={font.variable}>
      <body className="min-h-dvh font-sans antialiased">
        <div className="mx-auto min-h-dvh max-w-md pb-24">{children}</div>
        <BottomNav />
        <SwRegister />
      </body>
    </html>
  );
}
