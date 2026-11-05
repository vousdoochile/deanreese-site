import Link from "next/link";

const links = [
  { href: "/work", label: "Experience" },
  { href: "/ventures", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/resume", label: "Resume" },
];

export default function Nav() {
  return (
    <header className="site-nav">
      <nav aria-label="Main navigation" className="site-nav-inner">
        <Link href="/" className="brand">
          <span className="brand-symbol" aria-hidden="true">DR</span>
          <span className="brand-name">Dean Reese<span style={{color:"#6ff0db"}}>.</span></span>
        </Link>
        <div className="site-links">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          <Link href="/chat" className="nav-ask">Ask Dean <span aria-hidden="true">↗</span></Link>
        </div>
      </nav>
    </header>
  );
}
