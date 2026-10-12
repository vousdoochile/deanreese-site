import Container from "../components/Container";
import Link from "next/link";

export default function HomePage() {
  return (
    <Container>
      <section className="mt-2">
        <div className="grid items-start gap-8 md:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Payments · Enterprise Technical Advisory · Applied AI
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Dean Reese</h1>
              <p className="mt-2 text-lg font-medium text-neutral-800">
                Technical Account Manager at Stripe
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                Media, Entertainment, Gaming &amp; Sports (MEGS)
              </p>
            </div>
            <p className="text-lg leading-7 text-neutral-800">
              I help enterprise teams navigate complex payments technology, solve technical
              challenges, and turn new opportunities into practical outcomes. Outside Stripe,
              I build AI-enabled products and digital services through Home Based Daddy, LLC.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/work" className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white">
                Explore my work
              </Link>
              <Link href="/resume" className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-900">
                Resume
              </Link>
              <a href="https://www.linkedin.com/in/dean-reese" target="_blank" rel="noreferrer"
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-900">
                LinkedIn
              </a>
            </div>
          </div>
          <div className="flex justify-start md:justify-end">
            <img src="/DR.jpg" alt="Dean Reese"
              className="h-28 w-28 rounded-full border border-neutral-200 object-cover" />
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Selected work</h2>
        <div className="mt-4 grid gap-3">
          <WorkItem title="Stripe · Technical Account Manager"
            desc="Technical advisory and customer partnerships in the Media, Entertainment, Gaming & Sports segment, since May 2026." />
          <WorkItem title="Home Based Daddy · Founder"
            desc="Building and operating AI-enabled software, automation, and digital services across a growing portfolio of ventures." />
          <WorkItem title="Paymentus · Banking & Fintech Delivery"
            desc="Enterprise delivery across bill pay, loan payments, account-to-account transfers, and digital money movement." />
          <WorkItem title="KlariVis · Client Success & Enablement"
            desc="Led delivery and enablement for 40+ banks and credit unions; built scalable knowledge and training systems." />
        </div>
        <Link href="/work" className="mt-4 inline-block text-sm underline">See all experience</Link>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Building beyond the day job
        </h2>
        <p className="mt-4 leading-7 text-neutral-700">
          I founded Home Based Daddy, LLC to build practical products and services,
          including BillFound, Kueola, Sunny Texts, and HBD WebCare. The work spans
          software delivery, AI-powered workflows, customer experience, and business operations.
        </p>
        <a href="https://homebaseddaddy.com/" target="_blank" rel="noreferrer"
          className="mt-3 inline-block text-sm underline">Explore Home Based Daddy</a>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Areas of focus
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Proof title="Payments & integrations"
            body="Technical advisory, payment flows, implementation readiness, and troubleshooting across complex systems." />
          <Proof title="Enterprise relationships"
            body="Cross-functional coordination, executive communication, escalations, and durable operational improvements." />
          <Proof title="Applied AI"
            body="Hands-on AI products, workflow automation, knowledge systems, and responsible deployment." />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Ask about my work</h2>
        <p className="mt-3 text-neutral-700">
          The Q&amp;A assistant answers questions from approved information about my experience
          and projects. It will say when something is not documented.
        </p>
        <Link href="/chat" className="mt-3 inline-block text-sm underline">Try the Q&amp;A assistant</Link>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Contact</h2>
        <p className="mt-3 text-neutral-700">
          For professional conversations, connect with me on LinkedIn.
        </p>
        <a href="https://www.linkedin.com/in/dean-reese" target="_blank" rel="noreferrer"
          className="mt-3 inline-block text-sm underline">Connect on LinkedIn</a>
      </section>
    </Container>
  );
}

function WorkItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm leading-6 text-neutral-700">{desc}</div>
    </div>
  );
}

function Proof({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm leading-6 text-neutral-700">{body}</div>
    </div>
  );
}
