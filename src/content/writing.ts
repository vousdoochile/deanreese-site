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
  "dean-dana-hq-frame-engineering": {
      "title": "Dean & Dana HQ: Engineering a household operating system into an Android frame",
      "date": "November 5, 2026",
      "summary": "How I turned an aging Android photo frame into a private household dashboard by preserving Firefox, moving Python/SQLite state to Railway, integrating Google Calendar and shared lists, engineering encrypted recovery, and building a bounded Android kiosk helper instead of replacing the browser.",
      "bullets": [
          "Converted an M15R4/RK3326 Android 8.1 frame into a dedicated household client while preserving its working Firefox profile and pairing.",
          "Built a Python/SQLite household service for calendars, shopping, named lists, reminders and animated art, then migrated persistent state to an isolated Railway service with a dedicated volume.",
          "Separated device capabilities: the Frame can display household data and edit lists, while calendar creation is reserved for paired phones and work-calendar data is reduced to free/busy.",
          "Designed encrypted migration and Cloudflare R2 recovery around schema validation, digests and overwrite refusal; successive daily encrypted backups have been observed uploading and verifying.",
          "Built a custom Android foreground-recovery helper with Usage Access, delayed boot/wake behavior, pause/resume, retry limits, a circuit breaker and rollback; normal restart and sleep/wake recovery have passed on the physical frame."
      ],
      "coverImage": "/dean-dana-hq-frame.webp",
      "coverAlt": "Stylized Dean and Dana HQ digital frame showing the Rainy Lantern Street animated dashboard scene",
      "coverCaption": "A public-safe rendering of the working HQ Frame interface. Private URLs, calendar details and household data are intentionally omitted.",
      "references": [
          {
              "label": "Railway volumes",
              "url": "https://docs.railway.com/volumes"
          },
          {
              "label": "Google Calendar API authorization",
              "url": "https://developers.google.com/workspace/calendar/api/auth"
          },
          {
              "label": "Android UsageStatsManager",
              "url": "https://developer.android.com/reference/android/app/usage/UsageStatsManager"
          },
          {
              "label": "Python sqlite3 backup API",
              "url": "https://docs.python.org/3/library/sqlite3.html#sqlite3.Connection.backup"
          },
          {
              "label": "Cloudflare R2",
              "url": "https://developers.cloudflare.com/r2/"
          }
      ],
      "body": "Most digital frames are designed to show photos and stay out of the way. I wanted this one to do considerably more: tell us what the day looked like, keep shared lists current, show household calendar context, make recurring shopping less annoying, and turn into animated art when nobody needed it.\n\nThe easy version would have been to point a browser at a dashboard and call it finished. The actual project became a systems-integration exercise across an aging Android device, Firefox, a Python/SQLite backend, Google Calendar, cloud hosting, encrypted recovery, paired mobile clients, and a small Android watchdog whose job is mostly to know when *not* to interfere.\n\nThat distinction matters. Dean & Dana HQ is not a new operating system, and I did not write Firefox, Android, Railway, SQLite, Google Calendar or Cloudflare R2. The engineering work was in connecting those pieces, setting boundaries between them, building the household application, and making an inexpensive frame behave more like a dependable appliance.\n\n## Starting with the hardware I actually had\n\nThe physical frame is an M15R4 built around a Rockchip RK3326, running Android 8.1 / API 27 with 1 GB of RAM. Firefox was already installed and, importantly, already working with the household dashboard.\n\nThat made the first architectural decision surprisingly consequential: I kept Firefox.\n\nReplacing it with a new WebView or a third-party kiosk browser sounded cleaner on paper, but it would have meant throwing away a known-good browser profile, pairing state and rendering environment on old hardware. Earlier experiments with another kiosk application had also been unreliable. The safer path was to treat Firefox as an existing subsystem and engineer around it.\n\nThe frame therefore remains a real browser client. HQ is a web application designed for touch and the frame's constrained hardware. The left rail keeps Today, Calendar, Shopping, shared lists, household functions and Art within reach. Art mode uses local SVG and CSS scenes rather than WebGL or a continuous canvas render loop. The rainy street, lake and cabin scenes can move, pause and dim without depending on an external image service.\n\nKeeping Firefox also left one visible compromise: browser chrome can still appear. HQ has a user-triggered fullscreen action, but automatic toolbar-free fullscreen after every reboot is not implemented. I would rather describe that accurately than pretend the frame has a kiosk capability it does not.\n\n## Building the household application before the cloud\n\nThe application started locally on a Windows machine because that was the fastest way to prove the household workflows before introducing hosting and migration complexity.\n\nThe backend is Python with SQLite persistence. The Frame UI and mobile UI share that state through authenticated HTTP endpoints. Shopping supports preferred stores, quantities, checkoffs, undo and recent items. Named lists support task dates, editing, check/undo and archive/restore. Calendar views include the daily agenda, upcoming views and month drill-down.\n\nThe shared-state behavior was important from the beginning. A shopping item added from one client needed to appear on another without silently overwriting a newer edit. Offline actions needed to fail visibly instead of pretending they had saved. Database connections needed to close cleanly during polling. Even a crowded calendar cell needed a defined behavior rather than clipping data.\n\nThose sound like small UX details. Collectively, they are the difference between a demo and something two people can actually use.\n\nWe validated those flows with real SQLite state and independent authenticated test clients, while keeping synthetic test data separate from the real household. Browser suites covered multiple frame and phone viewport sizes, motion/pause behavior, shared edits and offline refusal. Those checks were engineering evidence, not a claim that a Chromium fixture was identical to Android Firefox.\n\n## Calendar integration with deliberate asymmetry\n\nCalendar integration is where a household dashboard can become useful very quickly, and over-privileged even faster.\n\nHQ reads our personal Google Calendar data and exposes work availability as free/busy only. It does not need private work-meeting details to tell the household that a block of time is busy.\n\nThe Frame itself is intentionally not allowed to create calendar events. Paired phones have the writer capability, bound to the approved personal calendar path. The server enforces that role; hiding a button in the UI is not the security boundary.\n\nOne of the useful acceptance moments was wonderfully ordinary: Dana created an airport-ride event, it appeared in Google Calendar, and the same event showed up on the Frame. Shopping and named-list edits were also observed synchronizing across the household clients.\n\nThat is a modest result compared with a commercial calendar product. For this project, it was exactly the point: a real household action moved across systems without exposing more data or capability than the display needed.\n\n## Why I moved the backend to Railway\n\nOnce the local version was useful, the Windows computer became the obvious architectural weakness. If the laptop was stopped, away from home or in the middle of maintenance, the household service went with it.\n\nI considered keeping the backend on a home Mac mini. That would have made my home power and internet connection part of the grocery-store critical path. I also considered moving the application to Cloudflare Workers and D1, which would have meant adapting an already-working Python/SQLite application to a different runtime and storage model.\n\nRailway was the lower-rewrite option.\n\nThe current HQ production environment is deliberately isolated from my commercial projects. It runs one hq-web service, one replica, a dedicated 1 GB persistent volume mounted at /data, a /healthz check, and explicit CPU/memory limits. SQLite lives on the persistent volume, not in the disposable container filesystem.\n\nThat sounds simple now. Getting there safely was not a copy-the-folder exercise.\n\n## Treating migration like a recovery problem\n\nThe original household database already contained the thing I cared about: state we had created and accepted. I did not want a cloud migration to become an excuse to rebuild it empty and hope nothing important was missing.\n\nThe migration path therefore used encrypted bundles, schema validation, table/column checks, logical digests, SQLite's backup API and refusal rules around existing destinations. The importer restored into a new directory rather than overwriting a live one. Old device sessions were intentionally removed from the copy so cloud devices would be paired fresh.\n\nDuring that review, we reproduced a real defect in the migration tooling: a consistent SQLite file could still be incomplete if several household tables were missing, and application startup would recreate those tables empty. That was not evidence that our real database was damaged. It was evidence that the validator was too permissive.\n\nThe fix was to make the transfer helper require the full expected schema and relationships before accepting a bundle. This is one of my favorite lessons from the project: database integrity is not the same thing as application completeness.\n\nRecovery mattered after launch too. HQ writes encrypted backups to Cloudflare R2. Railway logs have shown successive daily backup uploads with ciphertext verification. The recovery key is kept separately from the hosted application.\n\nI did not invent the cryptography. The transfer tooling uses established AES-GCM support from the cryptography library. My contribution was designing when encryption is applied, what gets included, what must be verified, where keys are allowed to exist, and when the process must stop instead of guessing.\n\n## Making old Android hardware recover like an appliance\n\nCloud hosting solved the laptop dependency. It did not solve the frame's other problem: Android could still wake up somewhere other than the paired Firefox page.\n\nThe permanent-kiosk work deliberately avoided replacing the browser. I built a small Android companion for the exact M15R4 / RK3326 / Android 8.1 target. Its package is scoped to HQ recovery and it preserves Firefox's existing profile and pairing.\n\nThe helper uses a foreground service and Android Usage Access as a best-effort foreground signal. It does not act like a privileged window inspector. If Firefox is already in front, it leaves Firefox alone. If the frame is intentionally in Settings or maintenance controls, recovery is paused. After boot it waits for the device to settle. After a display wake it waits again. If the known Frameo screen appears, it requires repeated observations before asking Android to bring Firefox forward.\n\nMost importantly, it has limits. Automatic launch attempts are rate-bounded. Repeated failure opens a circuit that requires an explicit resume instead of creating an endless foreground fight. There are PAUSE, RESUME, RECOVER and ROLLBACK paths, and the original Home state is journaled before the Home role is changed.\n\nThe helper was built against Android API 27 using the official Android SDK toolchain and OpenJDK rather than depending on Android Studio on the build laptop.\n\nAfter installation, the physical acceptance results caught up with the design. The helper reached a healthy v2.0.3-home state with the service running, Usage Access granted, Firefox foreground, the recovery circuit clear and HQ selected as the effective Android Home. A normal Android restart returned to the paired HQ dashboard. A screen sleep/wake cycle also returned directly to HQ without re-pairing.\n\nWhat I have *not* proved is just as important: I do not have a completed post-USB overnight soak to claim, and the helper cannot tell that a Firefox tab is frozen or sitting on an offline error page while Firefox is technically still foreground.\n\n## Performance work without benchmark theater\n\nOld hardware has a useful way of exposing inefficient code.\n\nDuring the hosted-release work, the month-calendar path repeatedly created timezone formatters, processed the same events and rebuilt hidden UI on unchanged polls. In a controlled Chromium fixture with 350 synthetic calendar events, one candidate reduced the median month-open action from roughly 1.3 seconds to about 10 milliseconds after caching formatters/date spans, skipping hidden-view work and avoiding unnecessary DOM replacement.\n\nThat is a code-level benchmark, not a claim that the physical Frame became 100 times faster. The fixture excluded Android scheduling, Firefox painting, GPU work, network latency and OS memory pressure.\n\nThe useful lesson was not the ratio. It was that a resource-constrained client rewards removing work more than adding hardware.\n\n## Security belongs in the architecture\n\nHQ is private household software, so I did not want the security model to be \"nobody knows the URL.\"\n\nPairing tickets are random, one-use and short-lived; stored ticket values are hashed. Runtime sessions use opaque Secure, HttpOnly, SameSite cookies. Device kind and capability are determined server-side. Mutation requests use same-origin and CSRF protections. Old development keys and unmapped sessions are rejected.\n\nThe Frame is treated as a trusted household display, but with a narrower role than a phone. Mobile offline storage is intentionally limited, and the service worker caches the public shell rather than private API responses.\n\nGoogle tokens remain server-side. The app's role enforcement narrows what HQ does with those grants, while acknowledging that the underlying Google scope can be broader than a hypothetical create-only permission.\n\nThat is not a claim of perfect security. A compromised cloud administrator account or trusted device is still a real security assumption. The goal was to make the boundaries explicit and testable.\n\n## What works today\n\nToday, the frame runs Dean & Dana HQ in Firefox over Wi-Fi without needing the old Windows server or a USB tether for normal use.\n\nThe cloud service is live on Railway with persistent SQLite state. Shopping and shared lists synchronize across paired clients. Personal calendar information appears in HQ, work availability is reduced to free/busy, and calendar creation is kept off the Frame. The Art view provides animated local scenes with motion/pause and dim controls. The Android companion has passed normal restart and screen wake recovery. Encrypted R2 backups have been observed uploading and verifying successfully on successive days.\n\nThe frame is also still visibly a piece of real hardware running an old browser. That is part of the project, not something I need to hide.\n\n## What is still future work\n\nI have not implemented automatic browser-chrome-free fullscreen after every restart.\n\nI have not implemented a reliable detector for a hung Firefox tab or an offline error page when Firefox remains foreground.\n\nI am not claiming a completed overnight test after USB disconnection, because we never recorded that acceptance result.\n\nAnd while we have started thinking about retailer-aware shopping actions, direct add-to-cart integrations are still design work, not a shipped HQ feature.\n\n## What I learned\n\nThe most useful architecture decision in this project was not replacing something simply because I could. Firefox already worked, so I preserved it and built the recovery system around it. SQLite already matched the application's shape, so I moved it onto durable storage instead of rewriting the backend for fashion points.\n\nThe second lesson was that \"kiosk mode\" is really a recovery-policy problem. Boot timing, wake timing, maintenance escape hatches, retry limits, rollback and knowing when to leave the browser alone mattered more than hiding a toolbar.\n\nThe third was that a household dashboard is a small distributed system. It has multiple clients, stale state, synchronization, permissions, offline behavior, external APIs, persistent data and people who expect it to work when they are trying to leave the house.\n\nThat is what made Dean & Dana HQ interesting to build.\n\nIt started as a way to make a photo frame more useful. It ended up being a practical exercise in integrating hardware, browser software, cloud infrastructure, data synchronization, security boundaries, recovery and human behavior into one system that now lives in our home."
  },

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
  "dean-dana-hq-frame-engineering",
  "sh3pb-protocol-droid-ai-build",
  "klarivis-knowledge-base-ai",
  "deposit-forecasting-householding",
  "profitability-calculator",
] as const;

export const orderedWritingPosts = writingOrder.map((slug) => ({
  slug,
  ...writingPosts[slug],
}));
