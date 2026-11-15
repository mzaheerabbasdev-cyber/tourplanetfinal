import type { Metadata } from "next";
import { Poppins, Volkhov } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const volkhov = Volkhov({
  variable: "--font-volkhov",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://toursplanet.ae"),
  title: "Tours Planet | Dubai Tours & Desert Safari",
  description: "Book Dubai tours and desert safari experiences online with Tours Planet.",
  keywords: [
    "dubai tours",
    "desert safari dubai",
    "dubai desert safari booking",
    "tours planet",
  ],
};

import { CartProvider } from '@/context/CartContext';
import { HeaderConfigProvider } from '@/context/HeaderConfigContext';
import { getHeaderConfig } from '@/lib/getHeaderConfig';
import WhatsAppButton from '@/components/layout/WhatsAppButton';

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerConfig = await getHeaderConfig();

  return (
    <html lang="en">
      <head>
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Tours Planet",
              "url": "https://toursplanet.ae",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "AE"
              }
            })
          }}
        />
        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 768px) {
            ::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
            }
            * {
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
          }
        `}} />
      </head>
      <body
        className={`${poppins.variable} ${volkhov.variable} font-sans antialiased overflow-x-hidden`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <HeaderConfigProvider value={headerConfig}>
          <CartProvider>
            {children}
          </CartProvider>
        </HeaderConfigProvider>
        <WhatsAppButton />
      </body>
    </html>
  );
}
