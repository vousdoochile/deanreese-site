import Container from "../../components/Container";

export default function ResumePage() {
  return (
    <Container>
      <h1 className="text-2xl font-semibold tracking-tight">Resume & qualifications</h1>
      <p className="mt-2 text-neutral-700">
        Technical account management, payments, customer advisory, and applied AI.
      </p>

      <div className="mt-6 rounded-xl border border-neutral-200 p-5">
        <div className="text-sm font-semibold text-neutral-900">Dean Reese</div>
        <div className="mt-1 text-sm text-neutral-700">
          Technical Account Manager at Stripe · Arlington, TN
        </div>
        <a href="https://www.linkedin.com/in/dean-reese" target="_blank" rel="noreferrer"
          className="mt-3 inline-block text-sm underline">LinkedIn profile</a>

        <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Highlights
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          <li>Technical Account Manager at Stripe since May 2026, supporting the Media, Entertainment, Gaming & Sports segment.</li>
          <li>10+ years of enterprise-facing experience across payments, banking technology, and technical delivery.</li>
          <li>Advisory relationships with technical and executive stakeholders, including issue investigation, escalation coordination, and implementation planning.</li>
          <li>Previously led banking and fintech delivery at Paymentus, including bill pay, loan payments, and money movement.</li>
          <li>Led onboarding, enablement, and advisory work for 40+ banks and credit unions at KlariVis.</li>
          <li>Founder of Home Based Daddy, LLC, building AI-powered software, business automations, and digital services.</li>
          <li>Hands-on experience connecting AI, messaging, application, and payment services in customer-facing products.</li>
          <li>Prior leadership of bank payments operations, budgeting, audit readiness, and cross-functional teams.</li>
        </ul>

        <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Education & certifications
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          <li>Associate of Science, General Studies, Volunteer State Community College</li>
          <li>Artificial Intelligence Governance Professional (AIGP), IAPP</li>
          <li>ITIL 4 Foundations, Axelos</li>
          <li>AI Agents Fundamentals, Hugging Face</li>
          <li>AI in Financial Services, Upstart</li>
          <li>Digital Product Management, University of Virginia</li>
          <li>Product Analytics, Product School</li>
          <li>Six Sigma Yellow Belt</li>
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
        <h2 className="text-sm font-semibold text-neutral-900">Download my current resume</h2>
        <p className="mt-2 text-sm text-neutral-700">
          Updated October 2026 with my Stripe Technical Account Manager role,
          Home Based Daddy portfolio, and earlier payments and banking experience.
        </p>
        <a className="mt-3 inline-block rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
          href="/Dean%20Reese%20-%20Resume.pdf?v=20261012" target="_blank" rel="noreferrer">
          View or download resume PDF
        </a>
      </div>
    </Container>
  );
}
