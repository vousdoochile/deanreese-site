import "./globals.css";
import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://deanreese.me"),
  title: {
    default: "Dean Reese | Applied AI, Technology & Building What's Next",
    template: "%s | Dean Reese",
  },
  description:
    "Dean Reese is a Technical Account Manager at Stripe and the founder of Home Based Daddy, LLC. Explore his experience, independent products, and practical AI projects.",
  openGraph: {
    title: "Dean Reese | The Future Should Be Useful",
    description:
      "Enterprise technical advisory by day. Independent AI and software building after hours. Explore selected work, projects and writing.",
    url: "https://deanreese.me",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="site-body antialiased">
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">Skip to content</a>
        <Nav />
        <main id="content" className="site-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
