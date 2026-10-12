import Container from "../components/Container";
import Link from "next/link";
import { siteProfile, experiences, ventures, focusAreas } from "../content/site";

const featured = experiences.filter((role) => role.featuredTitle && role.featuredDescription);

export default function HomePage() {
  return (
    <Container>
      <section className="mt-2">
        <div className="grid items-start gap-8 md:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                {siteProfile.focusLine}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{siteProfile.name}</h1>
              <p className="mt-2 text-lg font-medium text-neutral-800">
                {siteProfile.headline}
              </p>
              <p className="mt-1 text-sm text-neutral-600">{siteProfile.segment}</p>
            </div>
            <p className="text-lg leading-7 text-neutral-800">{siteProfile.introduction}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/work" className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white">
                Explore my work
              </Link>
              <Link href="/resume" className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-900">
                Resume
              </Link>
              <a href={siteProfile.linkedinUrl} target="_blank" rel="noreferrer"
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-900">
                LinkedIn
              </a>
            </div>
          </div>
          <div className="flex justify-start md:justify-end">
            <img src="/DR.jpg" alt={siteProfile.name}
              className="h-28 w-28 rounded-full border border-neutral-200 object-cover" />
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Selected work</h2>
        <div className="mt-4 grid gap-3">
          {featured.map((role) => (
            <WorkItem key={role.company} title={role.featuredTitle!} desc={role.featuredDescription!} />
          ))}
        </div>
        <Link href="/work" className="mt-4 inline-block text-sm underline">See all experience</Link>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Building beyond the day job
        </h2>
        <p className="mt-4 leading-7 text-neutral-700">{siteProfile.founderOverview}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ventures.map((venture) => (
            <div key={venture.name} className="rounded-xl border border-neutral-200 p-4">
              <div className="text-sm font-semibold">{venture.name}</div>
              <p className="mt-1 text-sm leading-6 text-neutral-700">{venture.description}</p>
              {"url" in venture && venture.url ? (
                <a href={venture.url} target="_blank" rel="noreferrer"
                  className="mt-2 inline-block text-sm underline">Learn more</a>
              ) : null}
            </div>
          ))}
        </div>
        <a href={siteProfile.portfolioUrl} target="_blank" rel="noreferrer"
          className="mt-4 inline-block text-sm underline">Explore Home Based Daddy</a>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Areas of focus
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {focusAreas.map((focus) => (
            <Proof key={focus.title} title={focus.title} body={focus.description} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Ask about my work</h2>
        <p className="mt-3 text-neutral-700">{siteProfile.chatbotDescription}</p>
        <Link href="/chat" className="mt-3 inline-block text-sm underline">Try the Q&amp;A assistant</Link>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Contact</h2>
        <p className="mt-3 text-neutral-700">{siteProfile.contactText}</p>
        <a href={siteProfile.linkedinUrl} target="_blank" rel="noreferrer"
          className="mt-3 inline-block text-sm underline">Connect on LinkedIn</a>
      </section>
    </Container>
  );
}

function WorkItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm leading-6 text-neutral-700">{desc}</div>
    </div>
  );
}

function Proof({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm leading-6 text-neutral-700">{body}</div>
    </div>
  );
}
