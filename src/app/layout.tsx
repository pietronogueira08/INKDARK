import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "INKDARK — Premium Luxury Tattoo Studio",
  description:
    "Where skin becomes canvas. Book your exclusive consultation at INKDARK, the premier luxury tattoo studio redefining fine art tattooing.",
  keywords: ["luxury tattoo", "fine art tattoo", "premium tattoo studio", "bespoke ink"],
  openGraph: {
    title: "INKDARK — Premium Luxury Tattoo Studio",
    description: "Beyond Ink. Pure Art.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
