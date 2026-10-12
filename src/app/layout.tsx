import "./globals.css";
import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://deanreese.me"),
  title: {
    default: "Dean Reese | Technical Account Manager at Stripe",
    template: "%s | Dean Reese",
  },
  description:
    "Dean Reese is a Technical Account Manager at Stripe supporting MEGS customers, with experience across enterprise payments, technical delivery, and applied AI products.",
  openGraph: {
    title: "Dean Reese | Technical Account Manager at Stripe",
    description:
      "Enterprise technical advisory, payments, and applied AI. Explore Dean's experience at Stripe and the products built through Home Based Daddy.",
    url: "https://deanreese.me",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased">
        <Nav />
        <main className="py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
