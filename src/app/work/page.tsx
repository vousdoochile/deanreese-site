import Container from "../../components/Container";

export default function WorkPage() {
  return (
    <Container>
      <h1 className="text-2xl font-semibold tracking-tight">Recent work</h1>
      <p className="mt-2 text-neutral-700">
        Delivery leadership across payments, digital banking, and applied AI workflows in regulated environments.
      </p>

      <div className="mt-10 space-y-8">
        <Role
          company="Paymentus"
          title="Account Director II, Banking and Fintech Delivery"
          dates="July 2025 to Present"
          bullets={[
            "Own post sale delivery and operational success for enterprise banking and fintech clients using Paymentus IPN.",
            "Coordinate Product, Engineering, Implementation, Compliance, Support, and external partners to drive stable outcomes.",
            "Lead high severity escalations, production incidents, and go live readiness for complex bank implementations.",
            "Serve as executive escalation point, guiding resolution strategy, communication, and risk management.",
            "Provide delivery forecasting, risk assessments, and capacity planning inputs to leadership.",
          ]}
        />

        <Role
          company="KlariVis"
          title="Client Success and Training Manager"
          dates="July 2023 to July 2025"
          bullets={[
            "Led delivery and enablement for 40 plus banks and credit unions using core connected analytics platforms.",
            "Managed and coached Client Advocacy and Enablement Leads across onboarding, training, and executive engagement.",
            "Shifted delivery from reactive support to proactive advisory execution focused on value realization.",
            "Designed structured engagement frameworks, success plans, and escalation paths.",
            "Built and governed a centralized knowledge base and training program to reduce tribal knowledge reliance.",
          ]}
        />

        <Role
          company="First American Docutech"
          title="Technical Customer Relationship Manager"
          dates="May 2021 to June 2023"
          bullets={[
            "Owned technical delivery and executive relationships for Platinum tier financial services clients.",
            "Led cross functional delivery through compliance driven lending and payments implementations.",
            "Served as escalation lead for complex production and delivery issues across Engineering, Product, and Support.",
            "Supported renewals and expansion through trusted advisory relationships.",
          ]}
        />

        <Role
          company="Trust Company Bank"
          title="Director, Banking Technology and Payments Operations"
          dates="March 2010 to April 2016"
          bullets={[
            "Led banking technology and payments operations across core banking, consumer payments, authentication, and fraud platforms.",
            "Held operational P&L responsibility including staffing, vendor contracts, licensing, and support costs.",
            "Owned annual budgeting, forecasting, and variance analysis with corporate finance.",
            "Served as trusted advisor during audits, incidents, and major system changes.",
            "Led remediation tied to FFIEC, AML, KYC, and payments compliance findings.",
          ]}
        />
      </div>
    </Container>
  );
}

function Role({
  company,
  title,
  dates,
  bullets,
}: {
  company: string;
  title: string;
  dates: string;
  bullets: string[];
}) {
  return (
    <section className="rounded-xl border border-neutral-200 p-5">
      <div className="flex flex-col gap-1">
        <div className="text-sm font-semibold">{company}</div>
        <div className="text-neutral-800">{title}</div>
        <div className="text-sm text-neutral-500">{dates}</div>
      </div>

      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-neutral-700">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </section>
  );
}
