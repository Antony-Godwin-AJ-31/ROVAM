import type { Metadata, Viewport } from "next";
import { Allura, Cormorant_Garamond, Inter } from "next/font/google";
import { wedding } from "../config/wedding";
import { formatEventDate } from "../lib/date-time";
import { OPENED_KEY } from "../lib/utils";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const script = Allura({ subsets: ["latin"], weight: "400", variable: "--font-allura", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const bride = wedding.couple.bride.name;
const groom = wedding.couple.groom.name;
const dateLabel = formatEventDate(wedding.event.date);
const title = `${bride} & ${groom} · Save the Date`;
const description =
  wedding.seo.description ??
  (dateLabel ? `Save the date: ${bride} & ${groom} are getting married on ${dateLabel}.` : `Save the date for the wedding of ${bride} & ${groom}.`);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  robots: wedding.seo.allowIndexing ? undefined : { index: false, follow: false },
  openGraph: {
    title,
    description,
    type: "website",
    // Only advertise a preview image the couple actually supplied.
    images: wedding.assets.ogImage ? [{ url: wedding.assets.ogImage }] : undefined,
  },
  twitter: {
    card: wedding.assets.ogImage ? "summary_large_image" : "summary",
    title,
    description,
    images: wedding.assets.ogImage ? [wedding.assets.ogImage] : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF9F1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Always show envelope on page load
const bootScript = `try{localStorage.removeItem(${JSON.stringify(OPENED_KEY)});delete document.documentElement.dataset.opened;}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${script.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <noscript>
          <style>{`.gate{display:none!important}html:not([data-opened="1"]) body{overflow:auto!important}.hero-enter{opacity:1!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
