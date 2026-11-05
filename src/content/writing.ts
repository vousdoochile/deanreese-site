// Titles, summaries, key points, and full article bodies are stored here once.
// The Writing pages and AI Q&A both read this approved public content.
export type WritingPost = {
  title: string;
  date: string;
  summary: string;
  bullets: string[];
  body: string;
  coverImage?: string;
  coverAlt?: string;
  coverCaption?: string;
  references?: { label: string; url: string }[];
};

export const writingPosts: Record<string, WritingPost> = {
  "sh3pb-protocol-droid-ai-build": {
    title: "Giving a Severed Droid Head a Voice: The SH-3PB Build",
    date: "November 5, 2026",
    summary: "How I integrated an ESP32-S3 voice kit, cloud conversational AI, a custom character, and portable power into a salvaged protocol-droid popcorn bucket, without pretending I wrote the voice engine.",
    bullets: [
      "Integrated an M5Stack AtomS3R (ESP32-S3) and Atomic Voice Base inside a salvaged protocol-droid popcorn-bucket head.",
      "Used existing XiaoZhi firmware and XiaoZhi Lite for cloud conversations, then tuned an English voice and a character specification to make the droid distinctive.",
      "Validated spoken follow-up questions and short-session conversational context, including an unscripted callback to an earlier grocery-store exchange.",
      "Adapted the original neck opening for access to the physical talk control and powered the concealed electronics through an always-on USB battery.",
      "Kept IMU-based pickup activation and animated lighting as future work rather than claiming they were shipped."
    ],
    coverImage: "/sh3pb-protocol-droid.webp",
    coverAlt: "Weathered protocol-droid popcorn-bucket head with glowing amber-yellow eyes",
    coverCaption: "SH-3PB, the completed voice-enabled prototype. The original yellow eye lights remain manually operated.",
    references: [
      { label: "M5Stack AtomS3R hardware", url: "https://docs.m5stack.com/en/core/AtomS3R" },
      { label: "M5Stack XiaoZhi voice-assistant guide", url: "https://docs.m5stack.com/en/guide/atomic_voice_base/xiaozhi_voice_assistant" },
      { label: "XiaoZhi ESP32 open-source project", url: "https://github.com/78/xiaozhi-esp32" }
    ],
    body: `I started with a ridiculous requirement: I wanted a salvaged Star Wars protocol-droid head to talk back to me. Not play three canned phrases, not hide a Bluetooth speaker behind the face, but actually carry on a conversation. And because the object is a severed head that was turned into a popcorn bucket, I wanted the character to be deeply, perpetually offended by that fact.

What came out of it is SH-3PB, short for Severed Head 3 Popcorn Bucket. It is a working, voice-enabled physical character built around an M5Stack AtomS3R and Atomic Voice Base, with the conversational intelligence supplied by XiaoZhi Lite. The whole thing fits inside the original shell. This was an integration and prototyping project, not an attempt to claim an AI model or voice stack as my own.

## Start with the actual engineering constraints

The bucket was already a finished object. Its metal-look plastic shell, illuminated yellow eyes, neck opening, and existing mechanisms were worth preserving. The electronics had to fit inside, pick up speech, project a voice through plastic, and remain accessible for charging and conversation. I also wanted to avoid running yet another home server or Raspberry Pi just to make a novelty head talk.

I compared a few routes, including AiPi-Lite and a more elaborate microphone-plus-backend arrangement. The practical choice was M5Stack's AtomS3R AI Chatbot Kit, model K147. The AtomS3R provides the ESP32-S3 controller, screen/button and BMI270 inertial sensor; the included Atomic Voice Base provides the microphone, ES8311 audio codec and small speaker. Those are separate parts of one assembled kit. Buying the controller alone would not have solved the audio problem.

## Use a maintained conversation stack, not a homegrown one for its own sake

My initial plan was to build a lightweight voice bridge and possibly host it on Railway. That would have meant handling audio streaming, speech recognition, synthesis, session state, credentials and failure recovery. A real engineering project, but unnecessary complexity for the first version.

The kit arrived with XiaoZhi firmware capable of connecting to its service. I provisioned it onto 2.4 GHz Wi-Fi, paired the physical device to a XiaoZhi agent, and configured the English-language voice and role there. The AtomS3R captures and plays audio locally; the service handles the conversational AI. This isn't an on-device language model, and it doesn't require a separate OpenAI API key or a continuously running Mac, Clive, Sunny Home, or Railway service.

The division of responsibility matters: embedded hardware handles the physical interface, Wi-Fi handles transport, the voice platform supplies speech and conversation, and the role configuration defines the character. Keeping those boundaries clear made the build much simpler and easier to troubleshoot. It also means the droid depends on an internet connection and a third-party voice service; I wouldn't use it to discuss confidential work.

## The personality turned out to be a real design problem

Getting words out of the speaker was the easy part. Getting a character I actually wanted to talk to took iteration. I wrote a structured role specification with a backstory, tone, conversational constraints, examples and one nonnegotiable rule: every reply should find a fresh, natural way to complain about missing anatomy.

One early mistake was almost philosophical. I told the model it was a severed head inside a popcorn bucket. It started describing itself as trapped in the container. That was wrong. The head itself had been converted into the popcorn bucket. A single ambiguous sentence changed the whole character's worldview.

I rewrote the specification to make the physical identity explicit: this is its actual severed head, repurposed as a snack container, with its consciousness restored through new electronics. I also learned to use sample lines as style references, not scripts to recite. XiaoZhi's role editor imposed a 2,000-token limit, which forced me to tighten the instructions without losing the joke.

The result was better than repeating a punchline. When I talked about taking SH-3PB to the grocery store, it later referred back to that exchange and warned me about the frozen aisle. In another exchange, it objected to being placed in the bargain bin and preferred a shopping cart. Those observations are from hands-on conversations, not a formal memory benchmark. They showed useful short-session continuity and the kind of improvisation I had hoped for.

## Packaging a voice system inside a collectible

A tiny board doesn't automatically make a good physical product. Placement is everything. The microphone needs to hear through the shell, the speaker needs an acoustic path, the USB cable needs strain relief, and the physical screen button needs to remain usable after installation.

I took advantage of the existing opening at the bottom of the droid's neck. After removing the original insert, I positioned the AtomS3R so the screen/button could be accessed from below while the electronics remained inside the head. That avoided exposing a control on the face and spared the collectible an unnecessary new opening. I tested the assembled kit in the head, not just on the desk.

Volume tuning mattered, too. On the built-in speaker, I landed at a 98% setting that worked for my setup. That is a practical user setting, not a measured sound-pressure or acoustic-performance claim. The original glowing eyes still run on their factory controls; I did not wire them to the AI.

## Power is part of the product, not an afterthought

The K147 kit has no rechargeable battery in its stock configuration. It needs USB power. To make the head movable rather than permanently tethered to a wall, I installed an always-on USB power bank inside the shell. That lets the electronics stay powered even when the voice service isn't actively responding.

There is a tradeoff: an idle conversation is not the same thing as a sleeping microcontroller. The screen and Wi-Fi can keep drawing current. I can cut power using the bank's output controls or disconnect the cable. I haven't published battery-runtime measurements or implemented a custom low-power mode, so I won't pretend this is an optimized portable appliance.

## What works, and what comes next

Today SH-3PB talks, responds to follow-up questions, delivers a distinct character voice, and runs inside the physical head on its own Wi-Fi connection. He can be manually activated using the accessible screen/button. The recurring missing-torso complaints are, predictably, his strongest feature.

The next engineering idea is to use the onboard BMI270 accelerometer and gyroscope to recognize a deliberate pickup and call XiaoZhi's existing conversation-start behavior. The stock firmware uses the physical button; pickup activation would require a custom firmware build and careful filtering so bumps on a table don't wake the device. That feature has not been implemented yet. Animated eyes or a speaking-mouth LED are also possibilities, not completed work.

The lesson I take from this build is that practical AI work is often about the interfaces between systems. Selecting compatible hardware, respecting audio and power limitations, setting clear software boundaries, testing conversational behavior, and iterating on a compact character specification did more for the experience than reinventing the speech engine ever would have.

And yes, the droid is still missing his body. He has made it abundantly clear that restoring his voice was an offensively incomplete repair.`
  },

  "klarivis-knowledge-base-ai": {
    title: "Authoring and Scaling KlariVis’s First Enterprise Knowledge Base with AI Integration",
    date: "April 15, 2024",
    summary: "Built a structured knowledge system and enabled AI grounded answers for faster client self service.",
    bullets: [
      "Owned the build of KlariVis’s first enterprise knowledge base using Helpjuice.",
      "Authored and curated 90 plus articles with step by step guidance and embedded videos.",
      "Integrated AI chatbot and semantic search grounded to curated knowledge content.",
      "Established governance with version control, analytics, and cross functional review.",
      "Improved onboarding consistency and reduced dependency on tribal knowledge.",
    ],
    body: `As delivery leader at KlariVis, I took full ownership of building and maintaining the company's inaugural knowledge base using Helpjuice, establishing a centralized, self-service resource that transformed how clients and internal teams accessed product documentation. This initiative addressed a critical gap: fragmented support materials that slowed onboarding and increased ticket volume.

I authored and curated over 90 high-quality articles, incorporating step-by-step tutorials, release notes, how-to guides, and embedded instructional videos. Content was structured for clarity and searchability, covering core platform features like data aggregation, profitability insights, deposit forecasting, and analytics dashboards, while ensuring compliance with banking standards for accuracy and accessibility.

To elevate efficiency, I led the integration of Helpjuice's AI capabilities, including Swifty AI Chatbot and AI-powered semantic search. This allowed users to ask natural-language questions and receive instant, context-aware answers grounded directly in our knowledge base content. By training the AI on our curated articles and videos, we created a proactive support layer that reduced manual ticket handling and accelerated client self-resolution.

Leadership extended to governance: I established content update processes, version control, analytics tracking (via Helpjuice dashboards), and cross-functional reviews with Product and Support teams. The impact was significant—onboarding time for new bank users decreased notably, and support tickets dropped as clients could find answers faster through AI-driven discovery. This project not only improved customer satisfaction but also freed internal resources for higher-value strategic work, demonstrating how structured knowledge management with AI augmentation drives operational excellence in fintech.`,
  },

  "profitability-calculator": {
    title: "Driving Client Profitability Insights with AI Powered Calculators",
    date: "June 10, 2025",
    summary: "Delivered a client profitability calculator integrating ML scoring, secure pipelines, and dashboards.",
    bullets: [
      "Led delivery of a client facing profitability calculator for mid sized banks.",
      "Integrated ML scoring with secure pipelines and access controls.",
      "Accounted for servicing volume and relationship cost drivers in scoring logic.",
      "Guided testing and reliability practices for supportability.",
      "Delivered a practical tool used for prioritization and relationship strategy.",
    ],
    body: `At KlariVis, where our platform transforms core banking data into actionable enterprise insights, I led the development and delivery of a client-facing profitability calculator. This tool empowered mid-sized banks to evaluate the true economic value of relationships by factoring in required effort, revenue streams, costs, and risk-adjusted returns.

The project required strong ownership from ideation to production. I directed a cross-functional team, including Product, BI, DevOps, and QA, to integrate machine learning models that dynamically calculated profitability at the account, customer, product, and household levels. Using Python for model logic and SQL for relational schemas, we built secure data pipelines that pulled from core systems while enforcing access controls for compliance.

A key challenge was ensuring the calculator reflected real-world effort: we incorporated workload proxies (e.g., transaction volume, servicing touchpoints) into the models to avoid over- or under-valuing high-maintenance relationships. I applied MLOps best practices (versioning models, implementing automated testing, and setting up observability dashboards) to monitor accuracy and performance drift post-deployment.

Mentoring played a central role: I guided engineers on bias detection in profitability scoring and collaborated with stakeholders to refine UI integrations for intuitive dashboards. The result was a feature that helped clients identify unprofitable segments, optimize pricing, and prioritize high-value relationships, driving measurable improvements in net interest margins and resource allocation for our bank users.

This initiative underscored how generative AI and ML, when governed properly, turn complex data into strategic tools that directly impact bottom-line performance in banking.`,
  },

  "deposit-forecasting-householding": {
    title: "Leading Predictive Deposit Forecasting and Household Analytics for Sustainable Growth",
    date: "March 5, 2025",
    summary: "Led applied ML forecasting to support proactive deposit retention and household level insights.",
    bullets: [
      "Led applied ML forecasting for deposit balances and runoff risk at account and household levels.",
      "Aligned product priorities to deliver usable insights for bank operators.",
      "Implemented model versioning and monitoring practices to reduce drift risk.",
      "Enabled scenario explanations so business teams could act on forecasts.",
      "Improved proactive retention strategies for deposit focused institutions.",
    ],
    body: `In the competitive landscape of deposit growth, I took ownership of an internal AI project at KlariVis to enhance deposit forecasting and householding capabilities. Banks needed forward-looking insights to prevent runoff, deepen relationships, and build resilient funding strategies, especially amid rate volatility.

I led the team in integrating predictive ML models into the platform, forecasting deposit balances and migration risks at the account and household levels. We aggregated core data with behavioral signals, using Python pipelines and SQL schemas to create household views that grouped related accounts for a holistic customer perspective. This enabled more accurate predictions of churn likelihood, renewal probabilities, and growth potential.

To ensure reliability, I enforced MLOps standards: model versioning, continuous integration/testing, and real-time monitoring for drift. We incorporated generative AI elements for automated scenario explanations (e.g., "This household is at 65% risk of outflow due to maturing CDs and competitive rates"), making outputs actionable for branch teams.

Cross-functional leadership was essential; I aligned Product on feature prioritization, mentored peers on data governance, and worked with DevOps to maintain sub-second query performance. The outcome? Clients reported stronger deposit retention strategies, with early indicators of reduced outflow through proactive outreach and targeted incentives.

This project highlighted the power of applied AI in payments and analytics: by combining forecasting with household intelligence, we helped banks move from reactive volume chasing to proactive, relationship-driven growth, delivering sustainable competitive advantage.`,
  },
}

export const writingOrder = [
  "sh3pb-protocol-droid-ai-build",
  "klarivis-knowledge-base-ai",
  "deposit-forecasting-householding",
  "profitability-calculator",
] as const;

export const orderedWritingPosts = writingOrder.map((slug) => ({
  slug,
  ...writingPosts[slug],
}));
