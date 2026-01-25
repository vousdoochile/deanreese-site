import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata = {
  title: "Dean Reese",
  description: "Technology and payments delivery leader in fintech, AI, and digital banking.",
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
