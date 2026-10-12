import Container from "../../components/Container";

export default function WorkPage() {
  return (
    <Container>
      <h1 className="text-2xl font-semibold tracking-tight">Experience & selected work</h1>
      <p className="mt-2 text-neutral-700">
        Enterprise technical relationships, payments delivery, operational leadership,
        and practical AI systems.
      </p>

      <div className="mt-10 space-y-8">
        <Role
          company="Stripe"
          title="Technical Account Manager, Media, Entertainment, Gaming & Sports (MEGS)"
          dates="May 2026 to Present"
          bullets={[
            "Support complex customers in the Media, Entertainment, Gaming & Sports segment through proactive technical account management.",
            "Partner with customer stakeholders and internal teams to investigate payment integration challenges and identify practical paths forward.",
            "Translate technical findings and tradeoffs into clear recommendations for engineering, product, and business audiences.",
            "Coordinate cross-functional escalations and follow-through to support stable, reliable customer experiences.",
            "Look for ways to improve technical operations, product adoption, and repeatable customer outcomes.",
          ]}
        />
        <Role
          company="Home Based Daddy, LLC"
          title="Founder, AI-enabled products and digital services"
          dates="Founder-led venture"
          bullets={[
            "Build and operate a portfolio of practical software, AI-assisted workflows, and customer-focused digital services.",
            "Developed Sunny Texts, an AI-powered SMS companion with Twilio messaging, OpenAI-generated responses, and subscription workflows.",
            "Building BillFound, Kueola, and HBD WebCare, with a focus on solving operational problems for smaller businesses.",
            "Work across product definition, integrations, customer experience, automation, and launch execution.",
          ]}
          link="https://homebaseddaddy.com/"
        />
        <Role
          company="Paymentus"
          title="Account Director II, Banking & Fintech Delivery"
          dates="2025 to 2026"
          bullets={[
            "Led post-sale delivery and operational success for enterprise banking and fintech clients using the Paymentus Instant Payment Network.",
            "Coordinated Product, Engineering, Implementation, Compliance, Support, and partners to support complex payment outcomes.",
            "Led high-severity escalations, production issue coordination, and go-live readiness.",
            "Served as an executive escalation contact, guiding communication and risk management.",
            "Supported forecasting, capacity planning, and delivery prioritization.",
          ]}
        />
        <Role
          company="KlariVis"
          title="Client Success & Training Manager"
          dates="July 2023 to July 2025"
          bullets={[
            "Led delivery and enablement for 40+ banks and credit unions using core-connected analytics platforms.",
            "Managed and coached client advocacy and enablement professionals across onboarding, training, and executive engagement.",
            "Moved the delivery model toward proactive advisory work with structured success plans and escalation paths.",
            "Built a centralized knowledge base and scalable training and self-service resources.",
          ]}
        />
        <Role
          company="First American Docutech"
          title="Technical Customer Relationship Manager"
          dates="May 2021 to June 2023"
          bullets={[
            "Owned technical delivery and executive relationships for Platinum-tier financial services clients.",
            "Coordinated cross-functional responses to complex implementation and production issues.",
            "Supported renewals and expansion through trusted technical and operational advisory relationships.",
          ]}
        />
        <Role
          company="Trust Company Bank"
          title="Director, Banking Technology & Payments Operations"
          dates="March 2010 to April 2016"
          bullets={[
            "Led banking technology and payments operations supporting core banking, consumer payments, authentication, and fraud platforms.",
            "Held operational P&L, budget, forecasting, vendor, and staffing accountability.",
            "Managed operations leaders and technical professionals supporting day-to-day reliability and service.",
            "Led remediation work connected to audits and regulatory and payments compliance.",
          ]}
        />
      </div>
    </Container>
  );
}

function Role({
  company, title, dates, bullets, link,
}: {
  company: string;
  title: string;
  dates: string;
  bullets: string[];
  link?: string;
}) {
  return (
    <section className="rounded-xl border border-neutral-200 p-5">
      <div className="text-sm font-semibold">{company}</div>
      <div className="mt-1 text-neutral-800">{title}</div>
      <div className="mt-1 text-sm text-neutral-500">{dates}</div>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
        {bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
      </ul>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm underline">
          Explore the portfolio
        </a>
      ) : null}
    </section>
  );
}
