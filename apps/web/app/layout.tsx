import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { SwRegister } from "@/components/SwRegister";
import { ProfileProvider } from "@/lib/profiles";
import { Gate } from "@/components/Gate";

const font = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://gai.thuankhoi.com"),
  title: { default: "GAI – Tư duy chiến lược", template: "%s · GAI" },
  description: "Học và áp dụng lý thuyết trò chơi để ra quyết định tốt hơn. Dễ hiểu cho cả gia đình.",
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
  themeColor: "#f3efe6",
};

// Áp giao diện đã chọn trước khi trang hiện ra, để không bị nháy màu
const themeScript = `try{if(JSON.parse(localStorage.getItem("gai.theme"))==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

// Ngay sau khi cập nhật bản mới, trình duyệt có thể còn giữ trang cũ trỏ tới file JS đã bị thay.
// Gặp lỗi tải file như vậy thì tự tải lại trang một lần (tối đa 1 lần mỗi 30 giây, tránh lặp vô hạn).
const chunkReloadScript = `(function(){function bad(m){return /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module/i.test(String(m||""))}function go(){try{var k="gai.chunkReload",t=Number(sessionStorage.getItem(k)||0);if(Date.now()-t<30000)return;sessionStorage.setItem(k,String(Date.now()))}catch(e){}location.reload()}window.addEventListener("error",function(e){if(bad(e.message)||bad(e.error&&e.error.name))go()});window.addEventListener("unhandledrejection",function(e){var r=e.reason;if(bad(r&&(r.name||r.message)))go()})})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={font.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: chunkReloadScript }} />
      </head>
      <body className="min-h-dvh font-sans antialiased">
        <ProfileProvider>
          <Gate>
            <div className="mx-auto min-h-dvh max-w-md pb-24">{children}</div>
            <BottomNav />
          </Gate>
        </ProfileProvider>
        <SwRegister />
      </body>
    </html>
  );
}
