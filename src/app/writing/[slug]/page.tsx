import Container from "../../../components/Container";
import Link from "next/link";

type Post = {
  title: string;
  date: string;
  bullets: string[];
  body: string;
};

const posts: Record<string, Post> = {
  "klarivis-knowledge-base-ai": {
    title: "Authoring and Scaling KlariVis’s First Enterprise Knowledge Base with AI Integration",
    date: "April 15, 2024",
    bullets: [
      "Owned the build of KlariVis’s first enterprise knowledge base using Helpjuice.",
      "Authored and curated 90 plus articles with step by step guidance and embedded videos.",
      "Integrated AI chatbot and semantic search grounded to curated knowledge content.",
      "Established governance with version control, analytics, and cross functional review.",
      "Improved onboarding consistency and reduced dependency on tribal knowledge.",
    ],
    body: `As delivery leader at KlariVis, I took full ownership of building and maintaining the company's inaugural knowledge base using Helpjuice, establishing a centralized, self-service resource that transformed how clients and internal teams accessed product documentation. This initiative addressed a critical gap: fragmented support materials that slowed onboarding and increased ticket volume.

I authored and curated over 90 high-quality articles, incorporating step-by-step tutorials, release notes, how-to guides, and embedded instructional videos. Content was structured for clarity and searchability—covering core platform features like data aggregation, profitability insights, deposit forecasting, and analytics dashboards—while ensuring compliance with banking standards for accuracy and accessibility.

To elevate efficiency, I led the integration of Helpjuice's AI capabilities, including Swifty AI Chatbot and AI-powered semantic search. This allowed users to ask natural-language questions and receive instant, context-aware answers grounded directly in our knowledge base content. By training the AI on our curated articles and videos, we created a proactive support layer that reduced manual ticket handling and accelerated client self-resolution.

Leadership extended to governance: I established content update processes, version control, analytics tracking (via Helpjuice dashboards), and cross-functional reviews with Product and Support teams. The impact was significant—onboarding time for new bank users decreased notably, and support tickets dropped as clients could find answers faster through AI-driven discovery. This project not only improved customer satisfaction but also freed internal resources for higher-value strategic work, demonstrating how structured knowledge management with AI augmentation drives operational excellence in fintech.`,
  },

  "profitability-calculator": {
    title: "Driving Client Profitability Insights with AI Powered Calculators",
    date: "June 10, 2025",
    bullets: [
      "Led delivery of a client facing profitability calculator for mid sized banks.",
      "Integrated ML scoring with secure pipelines and access controls.",
      "Accounted for servicing volume and relationship cost drivers in scoring logic.",
      "Guided testing and reliability practices for supportability.",
      "Delivered a practical tool used for prioritization and relationship strategy.",
    ],
    body: `At KlariVis, where our platform transforms core banking data into actionable enterprise insights, I led the development and delivery of a client-facing profitability calculator. This tool empowered mid-sized banks to evaluate the true economic value of relationships by factoring in required effort, revenue streams, costs, and risk-adjusted returns.

The project required strong ownership from ideation to production. I directed a cross-functional team—including Product, BI, DevOps, and QA—to integrate machine learning models that dynamically calculated profitability at the account, customer, product, and household levels. Using Python for model logic and SQL for relational schemas, we built secure data pipelines that pulled from core systems while enforcing access controls for compliance.

A key challenge was ensuring the calculator reflected real-world effort: we incorporated workload proxies (e.g., transaction volume, servicing touchpoints) into the models to avoid over- or under-valuing high-maintenance relationships. I applied MLOps best practices—versioning models, implementing automated testing, and setting up observability dashboards—to monitor accuracy and performance drift post-deployment.

Mentoring played a central role: I guided engineers on bias detection in profitability scoring and collaborated with stakeholders to refine UI integrations for intuitive dashboards. The result was a feature that helped clients identify unprofitable segments, optimize pricing, and prioritize high-value relationships—driving measurable improvements in net interest margins and resource allocation for our bank users.

This initiative underscored how generative AI and ML, when governed properly, turn complex data into strategic tools that directly impact bottom-line performance in banking.`,
  },

  "deposit-forecasting-householding": {
    title: "Leading Predictive Deposit Forecasting and Household Analytics for Sustainable Growth",
    date: "March 5, 2025",
    bullets: [
      "Led applied ML forecasting for deposit balances and runoff risk at account and household levels.",
      "Aligned product priorities to deliver usable insights for bank operators.",
      "Implemented model versioning and monitoring practices to reduce drift risk.",
      "Enabled scenario explanations so business teams could act on forecasts.",
      "Improved proactive retention strategies for deposit focused institutions.",
    ],
    body: `In the competitive landscape of deposit growth, I took ownership of an internal AI project at KlariVis to enhance deposit forecasting and householding capabilities. Banks needed forward-looking insights to prevent runoff, deepen relationships, and build resilient funding strategies—especially amid rate volatility.

I led the team in integrating predictive ML models into the platform, forecasting deposit balances and migration risks at the account and household levels. We aggregated core data with behavioral signals, using Python pipelines and SQL schemas to create household views that grouped related accounts for a holistic customer perspective. This enabled more accurate predictions of churn likelihood, renewal probabilities, and growth potential.

To ensure reliability, I enforced MLOps standards: model versioning, continuous integration/testing, and real-time monitoring for drift. We incorporated generative AI elements for automated scenario explanations (e.g., "This household is at 65% risk of outflow due to maturing CDs and competitive rates"), making outputs actionable for branch teams.

Cross-functional leadership was essential—I aligned Product on feature prioritization, mentored peers on data governance, and worked with DevOps to maintain sub-second query performance. The outcome? Clients reported stronger deposit retention strategies, with early indicators of reduced outflow through proactive outreach and targeted incentives.

This project highlighted the power of applied AI in payments and analytics: by combining forecasting with household intelligence, we helped banks move from reactive volume chasing to proactive, relationship-driven growth—delivering sustainable competitive advantage.`,
  },
};

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];

  if (!post) {
    return (
      <Container>
        <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
        <p className="mt-2 text-neutral-700">This post is not available.</p>
        <div className="mt-6">
          <Link href="/writing" className="text-sm underline">
            Back to Writing
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Link href="/writing" className="text-sm underline text-neutral-700">
        Back to Writing
      </Link>

      <h1 className="mt-6 text-2xl font-semibold tracking-tight">{post.title}</h1>
      <p className="mt-2 text-sm text-neutral-500">{post.date}</p>

      <div className="mt-8 rounded-xl border border-neutral-200 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Key points
        </h2>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-neutral-700">
          {post.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 space-y-4 text-sm leading-7 text-neutral-800">
        {post.body.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </Container>
  );
}
