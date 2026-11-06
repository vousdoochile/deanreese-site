export type Experience = {
  company: string;
  title: string;
  dates: string;
  bullets: string[];
  link?: string;
  featuredTitle?: string;
  featuredDescription?: string;
};

// Public, approved information. Edit this file when updating your work or projects.
// The visible pages and chatbot both use these same values after the next deployment.
export const siteProfile = {
  name: "Dean Reese",
  location: "Arlington, TN",
  headline: "Technical Account Manager at Stripe",
  segment: "Media, Entertainment, Gaming & Sports (MEGS)",
  focusLine: "Payments · Enterprise Technical Advisory · Applied AI",
  introduction: "I help enterprise teams navigate complex payments technology, solve technical challenges, and turn new opportunities into practical outcomes. Outside Stripe, I build AI-enabled products and digital services through Home Based Daddy, LLC.",
  founderOverview: "I founded Home Based Daddy, LLC to build practical products and services, including BillFound, Kueola, Sunny Texts, and HBD WebCare. The work spans software delivery, AI-powered workflows, customer experience, and business operations.",
  workOverview: "Enterprise technical relationships, payments delivery, operational leadership, and practical AI systems.",
  resumeOverview: "Technical account management, payments, customer advisory, and applied AI.",
  contactText: "For professional conversations, connect with me on LinkedIn.",
  chatbotDescription: "The Q&A assistant answers questions from approved information about my experience and projects. It will say when something is not documented.",
  seoDescription: "Dean Reese is a Technical Account Manager at Stripe supporting MEGS customers, with experience across enterprise payments, technical delivery, and applied AI products.",
  linkedinUrl: "https://www.linkedin.com/in/dean-reese",
  portfolioUrl: "https://homebaseddaddy.com/",
  sunnyTextsUrl: "https://sunnytexts.com",
  resumePath: "/Dean%20Reese%20-%20Resume.pdf?v=20261012",
  resumeEdition: "October 2026",
} as const;

export const experiences: Experience[] = [
  {
    "company": "Stripe",
    "title": "Technical Account Manager, Media, Entertainment, Gaming & Sports (MEGS)",
    "dates": "May 2026 to Present",
    "bullets": [
      "Support complex customers in the Media, Entertainment, Gaming & Sports segment through proactive technical account management.",
      "Partner with customer stakeholders and internal teams to investigate payment integration challenges and identify practical paths forward.",
      "Translate technical findings and tradeoffs into clear recommendations for engineering, product, and business audiences.",
      "Coordinate cross-functional escalations and follow-through to support stable, reliable customer experiences.",
      "Look for ways to improve technical operations, product adoption, and repeatable customer outcomes."
    ],
    "featuredTitle": "Stripe · Technical Account Manager",
    "featuredDescription": "Technical advisory and customer partnerships in the Media, Entertainment, Gaming & Sports segment, since May 2026."
  },
  {
    "company": "Home Based Daddy, LLC",
    "title": "Founder, AI-enabled products and digital services",
    "dates": "Founder-led venture",
    "bullets": [
      "Build and operate a portfolio of practical software, AI-assisted workflows, and customer-focused digital services.",
      "Developed Sunny Texts, an AI-powered SMS companion with Twilio messaging, OpenAI-generated responses, and subscription workflows.",
      "Building BillFound, Kueola, and HBD WebCare, with a focus on solving operational problems for smaller businesses.",
      "Work across product definition, integrations, customer experience, automation, and launch execution."
    ],
    "link": "https://homebaseddaddy.com/",
    "featuredTitle": "Home Based Daddy · Founder",
    "featuredDescription": "Building and operating AI-enabled software, automation, and digital services across a growing portfolio of ventures."
  },
  {
    "company": "Paymentus",
    "title": "Account Director II, Banking & Fintech Delivery",
    "dates": "2025 to 2026",
    "bullets": [
      "Led post-sale delivery and operational success for enterprise banking and fintech clients using the Paymentus Instant Payment Network.",
      "Coordinated Product, Engineering, Implementation, Compliance, Support, and partners to support complex payment outcomes.",
      "Led high-severity escalations, production issue coordination, and go-live readiness.",
      "Served as an executive escalation contact, guiding communication and risk management.",
      "Supported forecasting, capacity planning, and delivery prioritization."
    ],
    "featuredTitle": "Paymentus · Banking & Fintech Delivery",
    "featuredDescription": "Enterprise delivery across bill pay, loan payments, account-to-account transfers, and digital money movement."
  },
  {
    "company": "KlariVis",
    "title": "Client Success & Training Manager",
    "dates": "July 2023 to July 2025",
    "bullets": [
      "Led delivery and enablement for 40+ banks and credit unions using core-connected analytics platforms.",
      "Managed and coached client advocacy and enablement professionals across onboarding, training, and executive engagement.",
      "Moved the delivery model toward proactive advisory work with structured success plans and escalation paths.",
      "Built a centralized knowledge base and scalable training and self-service resources."
    ],
    "featuredTitle": "KlariVis · Client Success & Enablement",
    "featuredDescription": "Led delivery and enablement for 40+ banks and credit unions; built scalable knowledge and training systems."
  },
  {
    "company": "First American Docutech",
    "title": "Technical Customer Relationship Manager",
    "dates": "May 2021 to June 2023",
    "bullets": [
      "Owned technical delivery and executive relationships for Platinum-tier financial services clients.",
      "Coordinated cross-functional responses to complex implementation and production issues.",
      "Supported renewals and expansion through trusted technical and operational advisory relationships."
    ]
  },
  {
    "company": "Trust Company Bank",
    "title": "Director, Banking Technology & Payments Operations",
    "dates": "March 2010 to April 2016",
    "bullets": [
      "Led banking technology and payments operations supporting core banking, consumer payments, authentication, and fraud platforms.",
      "Held operational P&L, budget, forecasting, vendor, and staffing accountability.",
      "Managed operations leaders and technical professionals supporting day-to-day reliability and service.",
      "Led remediation work connected to audits and regulatory and payments compliance."
    ]
  }
];

export const ventures = [
  {
    "name": "BillFound",
    "description": "Software focused on finding completed work that has not been invoiced."
  },
  {
    "name": "Kueola",
    "description": "Scheduling and follow-up software for repeat customers."
  },
  {
    "name": "Sunny Texts",
    "description": "An AI-powered SMS companion for adults 55+, built with Twilio, OpenAI, Next.js, Supabase, and Stripe.",
    "url": "https://sunnytexts.com"
  },
  {
    "name": "HBD WebCare",
    "description": "Website design and ongoing care services for businesses."
  }
];

// Personal maker builds are separate from Home Based Daddy commercial ventures.
export const makerProjects = [
  {
    name: "unDEANiable Engine",
    expandedName: "Ophanim Voice & Focus Companion",
    category: "Personal applied-AI engineering project",
    status: "Working cloud and iPhone voice prototype · November 2026",
    description: "I wanted more than a chatbot window: a voice-first companion that helps me choose meaningful work, protect focus, capture competing ideas and reflect on what I actually finished. unDEANiable pairs a speaking AI with an animated, many-eyed Ophanim entity and a deliberately small set of human-controlled actions.",
    technicalSummary: "Built a responsive browser app with JavaScript, SVG/CSS and WebRTC; GPT-Live 1 for spoken conversation, GPT-6 Luna through the Decisions API for bounded attention checkpoints, and the Responses API for short coaching plans. The private Node-compatible service runs as a Railway Bun Function with HTTPS, password-backed signed sessions and JSON state on a persistent 512 MB volume. A prompt-generated Ophanim voice has been created and saved for future GPT-Live sessions.",
    stack: ["JavaScript + SVG/CSS", "Browser WebRTC", "GPT-Live 1", "GPT-6 Luna / Decisions + Responses", "Railway Bun Function", "Persistent JSON state"],
    verified: [
      "Private web application loads on desktop and iPhone; authenticated Railway requests and a live GPT-Live session creation succeeded, and spoken AI replies were heard on iPhone",
      "The browser captures microphone audio only in opted-in sessions, exchanges WebRTC session descriptions via the server, and plays returned audio on a browser media track",
      "Focus timer, idea vault, self-reported session records, coaching plans and bounded Decisions checkpoints are implemented; synced state uses a revision check to reject conflicting writes",
      "The app's Ophanim has three independently animated eye-lined rings, a central eye, hover motion and application-state reactions, with a reduced-motion alternative",
      "Railway logs confirm creation and persistence of the original prompt-generated voice; its initial listening review found a natural masculine sound, but not the distinctive Ophanim character intended"
    ],
    planned: "The entity does not watch the screen, monitor work in the background, control other apps or possess autonomous long-term memory. The custom voice needs further design and listening comparisons, Mac Safari live playback remains unresolved, and richer speech-synchronized animation or a native floating desktop companion are future experiments.",
    image: "/undeaniable-ophanim.svg",
    imageAlt: "Original unDEANiable app emblem: a luminous central eye inside intersecting violet, blue and lime rings",
    imageCaption: "Original Ophanim emblem from the working app / static identity asset",
    writingSlug: "undeaniable-engine-voice-first-ophanim"
  },
  {
    name: "Dean & Dana HQ Frame",
    expandedName: "Private Household Dashboard & Kiosk",
    category: "Personal systems-integration project",
    status: "Working household system · November 2026",
    description: "I turned an Android photo frame into a dedicated household dashboard that synchronizes calendars, shopping, shared lists, reminders, and animated art across the frame and paired phones. The physical frame now returns to HQ through a custom Android companion while shared household state runs on a private cloud service.",
    technicalSummary: "Built around an M15R4/RK3326 frame running Android 8.1 (API 27) and Firefox, with a custom foreground recovery helper using Usage Access and a separately approved default-Home role. The Python/SQLite household service runs as an isolated Railway production service with a persistent 1 GB volume, Google Calendar role boundaries, one-use device pairing, and encrypted Cloudflare R2 backups.",
    stack: ["Android 8.1 / RK3326", "Firefox", "Python + SQLite", "Railway + persistent volume", "Google Calendar API", "Cloudflare R2"],
    verified: [
      "Frame and paired phones share shopping and named-list state; real household calendar reads and a Dana-created airport-ride event were observed across Google Calendar and HQ",
      "Custom kiosk helper reached healthy v2.0.3-home state with Firefox foreground, Usage Access active, HQ set as effective Home, and the recovery circuit clear",
      "A normal Android restart and a screen sleep/wake cycle returned the physical frame to the paired HQ dashboard without re-pairing",
      "Railway production is live with one replica, a dedicated 1 GB /data volume and /healthz monitoring; encrypted R2 backups have been observed uploading and verifying successfully on successive days"
    ],
    planned: "Automatic browser-chrome-free fullscreen and frozen/offline-tab detection are not implemented. A post-USB overnight soak is not claimed, and direct retailer/cart integrations remain exploratory rather than shipped.",
    image: "/dean-dana-hq-frame.webp",
    imageAlt: "Stylized Dean and Dana HQ digital frame showing the Rainy Lantern Street animated household dashboard scene",
    imageCaption: "Personal systems integration / working household system",
    writingSlug: "dean-dana-hq-frame-engineering"
  },
  {
    name: "SH-3PB",
    expandedName: "Severed Head 3 Popcorn Bucket",
    category: "Personal maker project",
    status: "Working conversational prototype · October 2026",
    description: "I turned a salvaged protocol-droid popcorn-bucket head into a working, voice-enabled AI character. The droid speaks with a distinct personality, carries on follow-up conversations, and has the electronics and power supply concealed inside the original shell.",
    technicalSummary: "Integrated an M5Stack AtomS3R (ESP32-S3) with an Atomic Voice Base, 2.4 GHz Wi-Fi, XiaoZhi Lite's cloud conversation service, a custom character prompt, and a USB power bank. Reworked the existing neck opening for access to the physical talk button.",
    stack: ["ESP32-S3 / AtomS3R", "Atomic Voice Base", "XiaoZhi Lite", "Wi-Fi audio", "USB power bank"],
    verified: [
      "Wi-Fi registration, on-device microphone and speaker, and two-way spoken conversation working",
      "English-language voice and character behavior configured through XiaoZhi",
      "Conversational follow-ups and an in-session reference to an earlier grocery-store discussion observed",
      "Electronics installed and functioning inside the collectible head"
    ],
    planned: "Pickup activation using the onboard BMI270 IMU remains a proposed firmware enhancement. The original eye lights are manually controlled; no speech-synchronized lighting has been implemented.",
    image: "/sh3pb-protocol-droid.webp",
    imageAlt: "Weathered protocol droid head repurposed as a popcorn bucket, with both yellow eyes illuminated",
    imageCaption: "Personal build / fan-made prototype",
    writingSlug: "sh3pb-protocol-droid-ai-build"
  }
] as const;

export const focusAreas = [
  {
    "title": "Payments & integrations",
    "description": "Technical advisory, payment flows, implementation readiness, and troubleshooting across complex systems."
  },
  {
    "title": "Enterprise relationships",
    "description": "Cross-functional coordination, executive communication, escalations, and durable operational improvements."
  },
  {
    "title": "Applied AI",
    "description": "Hands-on AI products, workflow automation, knowledge systems, and responsible deployment."
  }
];

export const resumeHighlights: string[] = [
  "Technical Account Manager at Stripe since May 2026, supporting the Media, Entertainment, Gaming & Sports segment.",
  "10+ years of enterprise-facing experience across payments, banking technology, and technical delivery.",
  "Advisory relationships with technical and executive stakeholders, including issue investigation, escalation coordination, and implementation planning.",
  "Previously led banking and fintech delivery at Paymentus, including bill pay, loan payments, and money movement.",
  "Led onboarding, enablement, and advisory work for 40+ banks and credit unions at KlariVis.",
  "Founder of Home Based Daddy, LLC, building AI-powered software, business automations, and digital services.",
  "Hands-on experience connecting AI, messaging, application, and payment services in customer-facing products.",
  "Prior leadership of bank payments operations, budgeting, audit readiness, and cross-functional teams."
];
export const education = "Associate of Science, General Studies, Volunteer State Community College";
export const certifications: string[] = [
  "Artificial Intelligence Governance Professional (AIGP), IAPP",
  "ITIL 4 Foundations, Axelos",
  "AI Agents Fundamentals, Hugging Face",
  "AI in Financial Services, Upstart",
  "Digital Product Management, University of Virginia",
  "Product Analytics, Product School",
  "Six Sigma Yellow Belt"
];
