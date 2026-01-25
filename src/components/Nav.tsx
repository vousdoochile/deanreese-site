import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/resume", label: "Resume" },
  { href: "/chat", label: "Q&A" },
];

export default function Nav() {
  return (
    <header className="border-b border-neutral-200">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Dean Reese
        </Link>

        <div className="flex gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-neutral-700 hover:text-neutral-900"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
