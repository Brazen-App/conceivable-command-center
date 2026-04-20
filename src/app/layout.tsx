import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Conceivable — Personalized Fertility Supplements & AI Coaching",
    template: "%s | Conceivable",
  },
  description: "Personalized fertility supplements built for your body. Take the free 5-minute assessment and get a science-backed supplement protocol from Kirsten Karchmer, MSOM — 25 years in reproductive medicine, 10,000+ pregnancies supported.",
  keywords: ["fertility supplements", "personalized supplements", "PCOS supplements", "egg quality", "conceivable", "fertility health", "TTC supplements"],
  authors: [{ name: "Kirsten Karchmer", url: "https://www.conceivable.com" }],
  creator: "Conceivable",
  publisher: "Conceivable",
  metadataBase: new URL("https://www.conceivable.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Conceivable",
    title: "Conceivable — Personalized Fertility Supplements & AI Coaching",
    description: "Take the free 5-minute fertility assessment. Get a personalized supplement protocol backed by 25 years of clinical research and 240,000+ data points.",
    url: "https://www.conceivable.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conceivable — Personalized Fertility Supplements",
    description: "Take the free 5-minute fertility assessment. Get a personalized supplement protocol backed by clinical research.",
    creator: "@tryconceivable",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
        {/* Organization + WebSite JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.conceivable.com/#organization",
                  name: "Conceivable",
                  url: "https://www.conceivable.com",
                  description: "AI-powered personalized fertility health platform with supplements, coaching, and the Halo Ring.",
                  founder: {
                    "@type": "Person",
                    name: "Kirsten Karchmer",
                    jobTitle: "Founder & CEO",
                    description: "Board-certified reproductive health expert (MSOM), 25+ years in reproductive medicine, supported 10,000+ pregnancies.",
                    sameAs: ["https://www.instagram.com/tryconceivable"],
                  },
                  sameAs: [
                    "https://www.instagram.com/tryconceivable",
                    "https://www.facebook.com/tryconceivable",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.conceivable.com/#website",
                  url: "https://www.conceivable.com",
                  name: "Conceivable",
                  publisher: { "@id": "https://www.conceivable.com/#organization" },
                },
              ],
            }),
          }}
        />
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','915984956517388');
          fbq('track','PageView');
        `}</Script>
      </body>
    </html>
  );
}
