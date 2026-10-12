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
