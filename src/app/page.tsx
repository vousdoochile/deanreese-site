import Container from "../components/Container";
import Link from "next/link";

export default function HomePage() {
  return (
    <Container>
      {/* HERO */}
      <section className="mt-2">
        <div className="grid items-start gap-8 md:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Dean Reese</h1>
              <p className="mt-2 text-neutral-700">Technology and payments delivery leader</p>
            </div>

            <p className="text-lg leading-7 text-neutral-900">
              I help banks and fintechs deliver complex payments and digital banking initiatives
              with structured execution, executive clarity, and strong operational ownership.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/resume"
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white"
              >
                View resume
              </Link>

              <a
                href="https://www.linkedin.com/in/dean-reese"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-900"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div className="flex justify-start md:justify-end">
            <img
              src="/DR.jpg"
              alt="Dean Reese"
              className="h-28 w-28 rounded-full object-cover border border-neutral-200"
            />
          </div>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Selected work
        </h2>

        <div className="mt-4 grid gap-3">
          <WorkItem
            title="Paymentus"
            desc="Enterprise delivery across bill pay, loan payments, A2A, and digital money movement."
          />
          <WorkItem
            title="KlariVis"
            desc="Delivery, enablement, and knowledge systems for 40 plus financial institutions on core connected analytics."
          />
          <WorkItem
            title="First American Docutech"
            desc="Technical delivery and executive relationship ownership for compliance driven implementations."
          />
          <WorkItem
            title="Trust Company Bank"
            desc="Banking technology and payments operations leadership with P&L ownership."
          />
        </div>

        <div className="mt-4">
          <Link href="/work" className="text-sm underline">
            See recent work
          </Link>
        </div>
      </section>

      {/* PROOF POINTS */}
      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Quick proof points
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Proof
            title="Payments and digital banking"
            body="Bill pay, loan payments, ACH, A2A, and go live readiness in regulated environments."
          />
          <Proof
            title="Delivery leadership"
            body="Governance, forecasting inputs, cross functional coordination, and executive escalation ownership."
          />
          <Proof
            title="Applied AI"
            body="Built Sunny Texts, an AI driven SMS product using Next.js, Vercel, Twilio, Supabase, OpenAI API, and Stripe."
          />
        </div>
      </section>

      {/* CONTACT */}
      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Contact
        </h2>

        <p className="mt-4 text-neutral-700">
          Best way to reach me is LinkedIn. You can also view Sunny Texts below.
        </p>

        <div className="mt-3 flex gap-4 text-sm">
          <a
            className="underline"
            href="https://www.linkedin.com/in/dean-reese"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>

          <a
            className="underline"
            href="https://sunnytexts.com"
            target="_blank"
            rel="noreferrer"
          >
            sunnytexts.com
          </a>
        </div>
      </section>
    </Container>
  );
}

function WorkItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm text-neutral-700">{desc}</div>
    </div>
  );
}

function Proof({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm text-neutral-700">{body}</div>
    </div>
  );
}
