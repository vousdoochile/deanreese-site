import Container from "../../components/Container";

export default function ResumePage() {
  return (
    <Container>
      <h1 className="text-2xl font-semibold tracking-tight">Resume</h1>

      <p className="mt-2 text-neutral-700">
        Technical engagement, customer success, and delivery leadership in fintech.
      </p>

      <div className="mt-6 flex items-center gap-4">
        <img
          src="/DR.jpg"
          alt="Dean Reese"
          className="h-20 w-20 rounded-full object-cover border border-neutral-200"
        />

        <div className="text-sm text-neutral-700">
          <div className="font-semibold text-neutral-900">Dean Reese</div>
          <div>Arlington, TN</div>

          <a
            className="mt-1 inline-block underline"
            href="/Dean Reese - Resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Download resume PDF
          </a>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-neutral-200 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Highlights
        </h2>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-700">
          <li>10 plus years leading payments and digital banking delivery in regulated environments.</li>
          <li>Executive stakeholder management and high stakes escalation ownership.</li>
          <li>Delivery governance with repeatable frameworks and operating rhythms.</li>
          <li>Built Sunny Texts using Next.js, Vercel, Twilio, Supabase, OpenAI API, and Stripe.</li>
          <li>People leadership across onboarding, enablement, and client advocacy.</li>
          <li>Experience aligned to FFIEC, NACHA, and SOC minded delivery practices.</li>
        </ul>

        <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Certifications
        </h2>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-700">
          <li>Artificial Intelligence Governance Professional (AIGP), IAPP</li>
          <li>ITIL 4 Foundations</li>
          <li>AI Agents Fundamentals, Hugging Face</li>
          <li>AI in Financial Services, Upstart</li>
          <li>Digital Product Management, University of Virginia</li>
          <li>Product Analytics, Product School</li>
          <li>Six Sigma Yellow Belt</li>
        </ul>
      </div>
    </Container>
  );
}
