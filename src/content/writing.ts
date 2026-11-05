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
  "undeaniable-engine-voice-first-ophanim": {
    "title": "unDEANiable Engine: Building a voice-first companion with an eye of its own",
    "date": "November 5, 2026",
    "summary": "How I combined an animated Ophanim, browser WebRTC audio, GPT-Live conversation, bounded Decisions checks, private Railway hosting and cross-device progress into a personal AI companion, including the debugging that made two-way speech work on iPhone.",
    "bullets": [
      "Designed a voice-first focus companion around three human-controlled actions: choose an objective, execute a time block, and improve through reflection.",
      "Integrated GPT-Live 1 over browser WebRTC for opted-in conversation, GPT-6 Luna Decisions for bounded stay/capture/switch/rest/clarify checks, and the Responses API for short plans.",
      "Built an Ophanim-inspired SVG/CSS character with a central eye, three rotating rings, 18 smaller eyes, hover motion and state-dependent animation.",
      "Moved from Mac-only localhost to a password-protected Railway Bun Function with HTTPS, server-held API keys, persistent JSON state and revision-checked cross-device synchronization.",
      "Verified spoken GPT-Live replies on iPhone; created and saved an original prompt-generated guardian voice while keeping its final listening review, Mac Safari audio and autonomous awareness on the future-work list."
    ],
    "coverImage": "/undeaniable-ophanim.svg",
    "coverAlt": "Original unDEANiable Ophanim app emblem showing a large eye encircled by intersecting violet, blue and lime rings",
    "coverCaption": "The original Ophanim emblem shipped with the app. The working companion adds 18 smaller eyes, three animated rings and application-state reactions; the artwork itself is static.",
    "references": [
      {
        "label": "OpenAI GPT-Live WebRTC guide",
        "url": "https://developers.openai.com/api/docs/guides/voice-webrtc"
      },
      {
        "label": "OpenAI Decisions API",
        "url": "https://openai.com/index/decisions-api/"
      },
      {
        "label": "OpenAI custom voices",
        "url": "https://developers.openai.com/api/docs/guides/custom-voices"
      },
      {
        "label": "Railway persistent volumes",
        "url": "https://docs.railway.com/volumes"
      },
      {
        "label": "OpenAI API pricing",
        "url": "https://platform.openai.com/pricing/"
      }
    ],
    "body": "I didn't want another text box with a chatbot behind it. I already had plenty of ways to type a question into a model. What I wanted was harder to describe: an intelligence I could look at, talk to, hear back from and use to get better at the things I care about.\n\nThe spark came from a conversation about becoming undeniable. Not in the sense of chasing constant productivity, but of putting in enough deliberate practice that the work speaks for itself. Dana had noticed something before I had fully articulated it: working through ideas with AI was helping me focus them, and I was actually finishing more. I wanted to make that process more intentional.\n\nThat became unDEANiable Engine, an experiment in what happens when a voice interface, a bounded decision system and a character with its own visual identity are treated as one product. It is personal and a little strange by design. The interesting challenge was making all those pieces behave like one coherent experience rather than three demos sharing a page.\n\n## Give the companion a job before giving it a personality\n\nMy first instinct was to imagine everything it might do: keep me on task, listen for ideas, coach me through difficult concepts, help with business choices and follow me from computer to phone. It would have been easy to build a giant dashboard to represent all that ambition.\n\nInstead, I gave the initial system three verbs: *choose, execute, improve*.\n\nThe web app asks me to choose one meaningful outcome and a domain such as technical mastery, business, personal life or creative work. I can protect a 15-, 25-, 45- or 60-minute focus block, park a competing idea without switching tasks, and finish with a short reflection on what I actually did. A proof-of-work area tracks completed sessions, focused minutes and recorded outcomes, but those are my own entries, not measurements of what happened on my screen.\n\nThat distinction matters. The system should make me more capable, not merely make me feel observed.\n\nA responsive JavaScript interface became the first working version on my Mac mini. It had an animated companion, an objective field, a timer, an idea vault, a Decisions checkpoint, a short-plan button and a place to record progress. Later versions added private cross-device state sync and better audio diagnostics. It can also operate in manual mode without an API key.\n\n## A small decision is not a conversation\n\nI was drawn to OpenAI's Decisions API because it handles a very specific problem well: choose among a finite set of possible next steps. When I type that a new project idea has interrupted my current task, I don't need a five-paragraph essay. I need a useful classification.\n\nThe checkpoint uses GPT-6 Luna through the Decisions endpoint and asks for one of five routes: stay, capture, switch, rest or clarify. The input includes my stated goal and the situation I describe. It does not claim to know which apps are open or whether I have actually wandered off task. A low-confidence or unusable answer falls back to clarification, and even a high-confidence result is advisory. The app never changes my goal on its own because a model chose a label.\n\nA separate Responses API call, also using GPT-6 Luna in this build, generates short plans or reflections. Its instructions constrain a plan to the time block I selected and ask for a measurable finish line. We caught an early mismatch when a 15-minute session produced a 25-minute suggestion. The correction was not philosophical: pass the selected duration explicitly and require the plan, including reflection, to fit inside it.\n\nThe two endpoints serve different purposes. Decisions handles bounded routing. Responses handles a little open-ended explanation. Application code, not the language model, owns the timer, idea records, permissions and state changes.\n\n## Give the browser ears, but keep the key off the device\n\nThe voice experience was the feature I cared about most. I wanted to speak naturally and hear a character respond, not click a microphone button just to fill a text field.\n\nThe browser requests microphone permission only after I start a voice session. JavaScript calls getUserMedia for an audio track, creates a WebRTC peer connection, attaches that track and opens a data channel for session events. It then generates a session description offer.\n\nMy application server receives that offer and exchanges it with OpenAI's GPT-Live session API using a server-side key. The browser applies the returned session description as its WebRTC answer. From there, microphone input and generated speech travel over the negotiated media tracks. The data channel carries events such as session start and close, transcript deltas and errors. The returned audio track is attached to an HTML audio element for playback.\n\nThat separation was deliberate. The browser can ask to talk without ever possessing the project API key. The server controls session creation, model instructions and the maximum duration. The user controls when the microphone starts and stops. A running voice session does not automatically update goals or operate another application.\n\nIt also meant I had two places to troubleshoot: browser capture and playback on one side, and session creation and server configuration on the other.\n\n## A Mac mini that was missing an ear\n\nThe first live voice attempts were not graceful.\n\nThe unsigned local launcher triggered macOS Gatekeeper. After switching to Terminal, I managed to run npm from my home directory instead of the application directory, which naturally produced a missing package.json error. Once the app was running, Safari reported an invalid microphone constraint.\n\nThat one took an embarrassing but useful turn. My Mac mini had no recognized input device. The hardware was doing exactly what it should: nothing. I found a USB microphone, connected it, and the local microphone test passed without placing an OpenAI call.\n\nStill no voice.\n\nThe speaker test played two tones correctly, so a working output device wasn't enough evidence. We added a visible audio player, a manual Play control for browsers that block autoplay, microphone-signal checks, WebRTC packet counters and more precise session diagnostics. We also learned that failed tests could exhaust the application's daily voice-start allowance before we understood the failure.\n\nAt that point I stopped treating every silent call as a reason to spend another session. The real question was whether audio was leaving the browser, whether a response track was arriving and whether playback had started. Those distinctions made the problem observable, even if we did not fully resolve the Mac Safari behavior.\n\nThe breakthrough came on my iPhone. The same Engine, through its cloud address, obtained microphone permission, created a GPT-Live session and spoke actual words back to me. That was the first confirmed two-way voice result. The unresolved Mac playback issue remains an open device/browser-specific problem, not a reason to claim voice works perfectly everywhere.\n\n## The eye mattered as much as the voice\n\nThe visual identity came from an Ophanim-inspired idea: many eyes set into intersecting celestial rings, reimagined with a futuristic, computational feel. The original concept artwork was intricate, luminous and full of rings, eyes, circuit-like traces and binary motifs. I didn't want an ordinary bouncing chat bubble watching my timer.\n\nI also didn't want to turn an illustrated symbol into a misleading capability claim. The eye represents attention and curiosity. It does not mean the app can see my screen or observe my life.\n\nThe implemented companion uses a central SVG eye and three independently rotating CSS rings. Each ring carries six smaller eye elements. The motion creates the impression of wheels passing through one another, with a subtle hover and glow beneath the figure. Violet, cyan and lime tie the entity to the app's interface. There is a reduced-motion path for people who prefer it.\n\nThe movement has meaning, at least in a deliberately limited way. In idle mode the rings move calmly. They slow during a focused block, accelerate during a thinking state, soften on pause, and brighten for a recorded win. A voice session changes the companion's listening presentation. These are reactions to application state, not a frame-by-frame visualization of speech or a model literally looking around the room.\n\nThe richer binary and circuit symbolism belongs primarily to the concept artwork. The shipped app does not yet have autonomous eye tracking, a synchronized speaking mouth, or a floating always-on-top desktop presence. Separating the inspiration from the implementation is part of the design discipline.\n\n## The character needed a voice of his own\n\nThe first successful spoken version used a built-in GPT-Live voice. It proved the audio path worked, but the voice felt disconnected from the entity on screen. We tried a more resonant masculine preset, Vesper, with guidance to speak in a calm, thoughtful, subtly mysterious way. It sounded better, but I still wanted something original.\n\nI described an adult masculine voice with a low-mid pitch, rich resonance, textured warmth and an unhurried, natural cadence. The target was an intelligent futuristic guardian: curious, approachable and quietly powerful, without robotic effects or theatrical depth. I even wanted him to occasionally say “my child,” but as an affectionate character detail, not a verbal tic or a substitute for an actual useful answer.\n\nThe application now has a one-time prompt-to-voice creation path. It sends that description to OpenAI's voice-creation API, stores the returned voice identifier on the persistent server volume and selects it for new GPT-Live sessions. Railway logs confirmed the custom voice was created and saved. The behavior instructions also include the occasional phrase and boundaries against condescension or false supernatural claims.\n\nThat establishes a successful custom voice creation and integration. It does *not* establish that I have auditioned the generated result and approved its exact sound. That listening review is still to do. OpenAI generates the speech; my work is the product experience, selection logic, configuration and controls around it.\n\n## Get it off one Mac and into my day\n\nA companion tied to a single localhost window would have missed the point. I wanted to open the same Engine on another computer or phone, without copying an API key onto each device.\n\nThe local Node-based service evolved into a private cloud deployment on Railway. The current production application runs as a Bun Function using Node-compatible HTTP code and embedded web assets. It has one running service replica and a dedicated 512 MB persistent volume mounted at /data. That volume stores application state and the saved custom voice identifier; browser assets can be redeployed without treating the container's temporary filesystem as durable storage.\n\nFor access, the cloud app requires HTTPS, a sufficiently long password and a separate session-signing secret before it will start. After login, signed Secure, HttpOnly, SameSite cookies guard private routes. Mutating requests also require the expected origin. The OpenAI key stays on the server.\n\nGoal text, saved ideas and completed focus records synchronize through a revisioned JSON state endpoint. A conflicting revision is rejected rather than silently overwriting changes from another device. Each browser retains a local copy for resilience, while an active timer remains device-local. That is useful synchronized progress, not an autonomous memory system that remembers everything said in a conversation.\n\nCloud hosting revealed another very real engineering lesson. After editing environment variables, Railway showed a deployment as successful while the application itself refused to boot. The logs identified a failed configuration check, and HTTP traffic was returning 502 connection timeouts. Correcting the required password and configuration restored the server. A deployment status is not the same thing as an application health check.\n\nWe verified a healthy Railway instance, successful authenticated desktop and iPhone requests, and a successful GPT-Live session creation from the phone. No other business projects needed to be modified to make that happen.\n\n## Keep the impressive parts honest\n\nThe system has a modest local API allowance, short opt-in voice calls and daily limits on voice, coaching and decisions. Those controls help avoid accidental repeated requests. The reserved-dollar figure displayed by the app is an estimate, not a provider-enforced billing limit. Promotional API credits covered eligible experimentation, while Railway hosting is a separate resource cost. I have not published a trustworthy per-session cost or a measured response-latency benchmark for this build.\n\nThe security model is intentionally narrow, but not magical. One app password is not a complete multi-user identity system. A persistent volume is not proof of tested restore capability. A saved idea is not the same thing as an agent making use of long-term memory. And the Ophanim does not inspect my screen, send messages, act in employer systems or autonomously control my Mac.\n\nThose are possible future directions, but each would need its own permissions, safety checks and evidence that it is actually useful.\n\nThe confirmed result is more specific, and to me more interesting: I can open a privately hosted, responsive interface on a desktop or iPhone, choose a focus objective, use bounded AI decisions and coaching, watch a distinctive animated entity, and have a real spoken conversation with it on my phone. Its voice identity has moved from a generic preset to a newly created custom voice awaiting my final listening test.\n\n## What I'd build next\n\nThe next phase is less about adding features and more about proving that the companion improves my day. I want to track whether protected sessions lead to meaningful work, whether its interruptions are genuinely useful and whether practice sessions make me better at explaining what I've learned.\n\nTechnically, I want to complete the custom-voice audition, improve the Mac Safari voice path, give the entity more expressive speech-linked motion and build a native floating companion only if that would genuinely help. Before relying on the system more heavily, I would also want stronger recovery testing and a clearer long-term data model.\n\nSH-3PB taught me how to give a salvaged object a conversational personality. Dean & Dana HQ taught me that a useful interface depends on infrastructure, boundaries and recovery. unDEANiable combines some of those lessons in a more personal question: can an AI feel present without pretending to be omniscient, and help me focus without trying to run my life?\n\nFor now, it has an eye, a voice, some carefully limited judgment, and a job to do. That is a much better start than another text box."
  },
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
      "body": "Most digital frames are designed to show photos and stay out of the way. I wanted this one to do more: show us what the day looked like, keep shopping and shared lists current, and turn into animated art when nobody needed it.\n\nThat became Dean & Dana HQ, a household web application running in Firefox on an aging Android frame. Getting a dashboard onto the screen was the beginning. Making it dependable meant dealing with shared state, calendar permissions, cloud hosting, backups and a device that did not always wake up where I wanted it.\n\nOne of the best moments was also one of the most ordinary. Dana created an airport-ride event from her phone. It appeared in Google Calendar, then on the frame. That was the point of the whole thing: something useful happening in our home, across the devices we actually use.\n\n## Keep the part that already works\n\nThe frame is an M15R4 built around a Rockchip RK3326, running Android 8.1 / API 27 with 1 GB of RAM. Firefox was already installed and working with the household dashboard, so I kept it.\n\nA new WebView or third-party kiosk browser might have looked cleaner on paper. It also would have meant giving up a known-good browser profile, pairing state and rendering environment on old hardware. Earlier experiments with another kiosk application had been unreliable. Building around Firefox was the safer choice.\n\nHQ remains a web application, designed for touch and the frame's limited resources. A left rail puts Today, Calendar, Shopping, shared lists, household functions and Art within reach. The Art view uses local SVG and CSS scenes: a rainy street, a lake and a cabin. They can move, pause and dim without WebGL, a continuous canvas render loop or an external image service.\n\nKeeping Firefox does leave a visible compromise. Browser chrome can still appear. There is a user-triggered fullscreen action, but automatic toolbar-free fullscreen after every reboot is not implemented.\n\n## Build something the household can use\n\nI started the application locally on a Windows machine. That let me work through the household workflows before adding hosting and migration to the problem.\n\nThe backend is Python with SQLite persistence. The frame and mobile interfaces share state through authenticated HTTP endpoints. Shopping supports preferred stores, quantities, checkoffs, undo and recent items. Named lists support task dates, editing, checkoffs, undo and archive/restore. Calendar views cover the daily agenda, upcoming events and a month view with drill-down.\n\nThe details mattered. An item added from one client needed to appear on another without silently overwriting a newer edit. An offline action needed to fail visibly rather than pretend it had saved. Database connections needed to close cleanly during polling. A crowded calendar cell needed a defined behavior instead of clipping information.\n\nWe tested those flows with real SQLite state and independent authenticated clients, keeping synthetic test data separate from the household's data. Browser suites covered frame and phone viewport sizes, animation and pause behavior, shared edits and offline refusal. Those tests gave us useful evidence, although a Chromium fixture is not the same environment as Firefox on the physical Android frame.\n\nShopping and named-list changes were also observed synchronizing across the household clients. Along with Dana's calendar event, that made the application feel useful beyond a test setup.\n\n## Give each device only the access it needs\n\nA household calendar becomes useful quickly. It can also become over-privileged quickly.\n\nHQ reads our personal Google Calendar data, while work availability is exposed as free/busy only. The household needs to know that a block of time is busy, not the private details of the meeting.\n\nThe frame cannot create calendar events. Paired phones have that capability, restricted by the application to the approved personal calendar path. The server enforces the device role. Hiding a button would not be enough.\n\nThat same approach runs through the rest of the application. Pairing tickets are random, single-use and short-lived, with their stored values hashed. Runtime sessions use opaque Secure, HttpOnly and SameSite cookies. Device kinds and capabilities are determined server-side, and mutations use same-origin and CSRF protections. Old development keys and unmapped sessions are rejected.\n\nThe frame is a trusted household display with a narrower role than a phone. Mobile offline storage is deliberately limited, and the service worker caches the public shell rather than private API responses. Google tokens stay on the server. The application's restrictions narrow what HQ does with those grants, even though Google's underlying scope can be broader than a hypothetical create-only permission.\n\nThese are explicit boundaries, not a promise of perfect security. A compromised cloud administrator account or trusted device remains a real risk.\n\n## Get the laptop out of the way\n\nOnce the local application was useful, the Windows computer became the obvious weakness. If it was stopped, away from home or undergoing maintenance, the household service went with it.\n\nI considered a home Mac mini, but that would have put our home power and internet connection in the grocery-store critical path. Cloudflare Workers and D1 were another option, although they would have required adapting a working Python/SQLite application to a different runtime and storage model.\n\nRailway was the lower-rewrite option.\n\nThe production environment is separate from my commercial projects. It runs one `hq-web` service with one replica, explicit CPU and memory limits, a `/healthz` check and a dedicated 1 GB persistent volume mounted at `/data`. SQLite lives on that volume rather than in the disposable container filesystem.\n\nMoving the code was only part of the job. The original database already held household state we had created and accepted. I wanted to move that state safely, not start empty and hope nothing important was missing.\n\n## Treat migration as a recovery problem\n\nThe migration tooling uses encrypted bundles, schema validation, table and column checks, logical digests and SQLite's backup API. The importer restores into a new directory and refuses to overwrite an existing destination. Old device sessions are removed from the copy so devices can be paired fresh in the cloud.\n\nDuring review, we reproduced a defect that was easy to miss: a SQLite file could pass its integrity checks while several household tables were missing. Application startup would then recreate those tables empty.\n\nOur real database was not shown to be damaged. The validator was too permissive.\n\nThe fix was to require the full expected schema and relationships before accepting a bundle. That became one of my favorite lessons from the project: database integrity is not the same thing as application completeness.\n\nRecovery matters after launch, too. HQ writes encrypted backups to Cloudflare R2. Railway logs have shown successive daily uploads with ciphertext verification, and the recovery key is kept separately from the hosted application. Those observations establish that the encrypted uploads were being made and verified; they are not, by themselves, evidence of a successful restore.\n\nThe transfer tooling uses established AES-GCM support from Python's `cryptography` library. The design work was deciding what to include, what to verify, where keys could exist and when the process should stop rather than guess.\n\n## Teach the frame how to recover\n\nCloud hosting removed the laptop dependency. It did not stop Android from waking up somewhere other than the paired Firefox page.\n\nI built a small Android companion for this exact M15R4 / RK3326 / Android 8.1 target. Its job is HQ recovery, while preserving Firefox's existing profile and pairing.\n\nThe helper runs a foreground service and uses Android Usage Access as a best-effort signal of what is in front. It is not a privileged window inspector. If Firefox is already foreground, it leaves it alone. If the frame is intentionally in Settings or maintenance controls, recovery pauses.\n\nAfter boot, it waits for the device to settle. After a display wake, it waits again. If it sees the known Frameo screen, it requires repeated observations before asking Android to bring Firefox forward.\n\nIt also has limits. Automatic launch attempts are rate-bounded. Repeated failure opens a circuit that requires an explicit resume, avoiding an endless foreground fight. There are PAUSE, RESUME, RECOVER and ROLLBACK paths, and the original Home state is journaled before the Home role changes.\n\nI built the helper against API 27 with the official Android SDK toolchain and OpenJDK, without needing Android Studio on the build laptop.\n\nOn the physical frame, version `v2.0.3-home` reached a healthy state: the service was running, Usage Access was granted, Firefox was foreground, the recovery circuit was clear and HQ was the effective Android Home. A normal restart returned to the paired dashboard. A screen sleep/wake cycle also returned directly to HQ without re-pairing.\n\nThose are useful acceptance results. They do not yet include a completed overnight test after disconnecting USB. The helper also cannot detect a frozen tab or an offline error page while Firefox itself remains foreground.\n\n## Make the browser do less work\n\nOld hardware has a useful way of exposing inefficient code.\n\nThe month-calendar path was repeatedly creating timezone formatters, processing the same events and rebuilding hidden UI during unchanged polls. Caching formatters and date spans, skipping hidden-view work and avoiding unnecessary DOM replacement removed much of that work.\n\nIn a controlled Chromium fixture with 350 synthetic calendar events, one candidate reduced the median month-open action from roughly 1.3 seconds to about 10 milliseconds.\n\nThat was a code-level benchmark of the candidate, not a measured speedup on the physical frame. It excluded Android scheduling, Firefox painting, GPU work, network latency and OS memory pressure. The useful lesson was straightforward: on a resource-constrained client, removing unnecessary work can matter a great deal.\n\n## Where it stands\n\nDean & Dana HQ now runs in Firefox over Wi-Fi without needing the old Windows server or a USB tether for normal use. The Railway service has persistent SQLite state. Shopping and shared lists synchronize across paired clients, personal calendar data appears in HQ, and work availability stays limited to free/busy. Calendar creation is reserved for paired phones. Art mode provides local animated scenes with pause and dim controls.\n\nThe frame has passed normal restart and screen-wake recovery, and successive daily encrypted backup uploads have been observed and verified. Longer-running reliability still needs evidence, including the overnight test after USB disconnection.\n\nThere is more to build. Automatic browser-chrome-free fullscreen after restart and reliable detection of a hung or offline Firefox tab remain open. Retailer-aware shopping actions are also still design work; direct add-to-cart integrations have not shipped.\n\n## What I would carry into the next project\n\nThe most useful decision was to preserve things that already worked. Firefox had a working profile and rendering environment. SQLite fit the application. Keeping both let me spend time on the parts the household actually needed instead of rewriting the stack for fashion points.\n\nI also came away thinking differently about kiosk mode. Boot timing, wake timing, maintenance escape hatches, retry limits and rollback mattered more than hiding a toolbar. A good recovery helper needs to know when to leave the browser alone.\n\nFinally, a household dashboard is a small distributed system. It has multiple clients, stale state, synchronization, permissions, offline behavior, external APIs and persistent data. It also has people who expect it to work when they are trying to leave the house.\n\nI started out wanting to make a photo frame more useful. I ended up connecting a household application, an old browser, cloud infrastructure and a recovery system into something that now lives in our home. That is what made Dean & Dana HQ interesting to build."
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
  "undeaniable-engine-voice-first-ophanim",
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
