import Container from "../../components/Container";
import Link from "next/link";

const posts = [
  {
    slug: "klarivis-knowledge-base-ai",
    title: "Authoring and Scaling KlariVis’s First Enterprise Knowledge Base with AI Integration",
    date: "April 15, 2024",
    summary: "Built a structured knowledge system and enabled AI grounded answers for faster client self service.",
  },
  {
    slug: "deposit-forecasting-householding",
    title: "Leading Predictive Deposit Forecasting and Household Analytics for Sustainable Growth",
    date: "March 5, 2025",
    summary: "Led applied ML forecasting to support proactive deposit retention and household level insights.",
  },
  {
    slug: "profitability-calculator",
    title: "Driving Client Profitability Insights with AI Powered Calculators",
    date: "June 10, 2025",
    summary: "Delivered a client profitability calculator integrating ML scoring, secure pipelines, and dashboards.",
  },
];

export default function WritingPage() {
  return (
    <Container>
      <h1 className="text-2xl font-semibold tracking-tight">Writing</h1>
      <p className="mt-2 text-neutral-700">Short writeups on delivery systems and applied AI in financial services.</p>

      <div className="mt-10 space-y-4">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/writing/${p.slug}`}
            className="block rounded-xl border border-neutral-200 p-5 hover:border-neutral-300"
          >
            <div className="text-sm font-semibold">{p.title}</div>
            <div className="mt-1 text-sm text-neutral-500">{p.date}</div>
            <div className="mt-3 text-sm text-neutral-700">{p.summary}</div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
