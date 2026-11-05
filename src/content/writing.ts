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
    title: "SH-3PB: I gave a popcorn bucket a voice",
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
    body: `I wanted a severed Star Wars droid head to talk back to me. It had already been turned into a popcorn bucket, which seemed like something he would have opinions about.

I wanted an actual conversation, with follow-up questions and a character who could keep up. And I wanted him to be deeply, perpetually offended by what had happened to him.

Meet SH-3PB, short for Severed Head 3 Popcorn Bucket. He's built around an M5Stack AtomS3R and Atomic Voice Base, with XiaoZhi Lite handling the conversation. Everything fits inside the original head. He can talk, follow a conversation, and complain about his missing body.

## Getting the hardware right

The head already had a lot going for it: a metal-look shell, glowing yellow eyes, and an opening at the neck. I wanted to keep those intact and fit the electronics around them.

The practical questions were straightforward. Would the microphone hear me through the shell? Could I hear the speaker? How would I reach the talk button? And could I do all of this without running another home server or Raspberry Pi?

After looking at a few options, including AiPi-Lite and a separate microphone-and-backend setup, I chose the M5Stack AtomS3R AI Chatbot Kit, model K147.

The kit includes two parts. The AtomS3R supplies the ESP32-S3 controller, screen/button, and BMI270 motion sensor. The Atomic Voice Base adds the microphone, audio codec, and speaker. That distinction matters if you're buying parts: the controller alone doesn't give you the audio hardware.

## Using what was already there

My first plan involved building a voice bridge and possibly hosting it on Railway. Then I looked at everything that would require: streaming audio, speech recognition, voice synthesis, conversation state, credentials, and recovery when something broke.

The kit already had XiaoZhi firmware. I connected it to 2.4 GHz Wi-Fi, paired it with a XiaoZhi agent, and set up an English voice and character. That got me to the part I actually wanted to work on much faster.

The AtomS3R records and plays audio. The cloud service handles the conversation. I didn't build the speech engine or language model, and neither runs locally in the head. My work was bringing the hardware, enclosure, and character together.

It needs Wi-Fi and the third-party voice service to work. It doesn't need a separate OpenAI API key or a computer running alongside it, but I wouldn't use it for confidential conversations.

## Teaching him what happened to his body

Getting him to speak was easier than getting him to be interesting.

I wrote a character specification with his backstory, tone, examples, and a rule that every reply should find a fresh way to complain about his missing anatomy. The challenge was keeping that funny without getting the same line back every time.

One early instruction caused a surprisingly specific problem. I described him as a severed head inside a popcorn bucket. He started talking as if he were trapped in a container.

But his head *is* the popcorn bucket. Someone had turned his actual head into a snack container. That is a different grievance.

I rewrote the description to make that clear. I also adjusted the sample lines so they were examples of his voice rather than things to repeat. The role editor's 2,000-token limit helped me cut the instructions down to what mattered.

Then he started doing the thing I'd hoped for. After we talked about going to the grocery store, he brought it up again and warned me about the frozen aisle. In another exchange, he objected to the bargain bin and preferred a shopping cart.

Those were callbacks during short conversations, not evidence of long-term memory. But they made him feel like a character who was listening and responding. I hadn't scripted those replies.

## Fitting everything inside the head

A small board still needs somewhere sensible to go. The microphone and speaker need a clear path for sound, the USB cable needs room and strain relief, and the button needs to stay reachable.

I removed the original insert at the neck and positioned the AtomS3R so I could reach its screen/button from underneath. The electronics stayed hidden, and I didn't have to cut a new opening in the face.

I tested it inside the head rather than assuming that working on the desk was good enough. For my setup, I ended up with the speaker volume at 98%. The original yellow eyes still use their factory controls; they aren't connected to the AI.

The kit also needs USB power. I put an always-on USB power bank inside the shell so I could move the head around without a cable running to the wall.

That doesn't make it a finished portable appliance. The screen and Wi-Fi still draw power while it's idle, and I haven't measured battery life or built a custom sleep mode. For now, I turn it off through the power bank or disconnect the cable.

## What works, and what I want to try next

SH-3PB works inside the head, on Wi-Fi and battery power. I can press the button underneath, talk to him, and ask follow-up questions. He has a distinct voice and plenty to say about the torso situation.

Next, I'd like to use the onboard motion sensor to start a conversation when someone deliberately picks him up. That would mean changing the firmware and making sure a bump on the table doesn't count. It's an idea for the next version, not a feature he has today. Animated eyes or a speaking-mouth light are possibilities too.

Most of the work in this build was in the details: choosing parts that worked together, fitting them into an existing object, getting the audio usable, and rewriting the character until he stopped misunderstanding his own predicament.

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
