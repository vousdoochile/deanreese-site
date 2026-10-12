import Container from "../../components/Container";
import { experiences, siteProfile, type Experience } from "../../content/site";

export default function WorkPage() {
  return (
    <Container>
      <h1 className="text-2xl font-semibold tracking-tight">Experience &amp; selected work</h1>
      <p className="mt-2 text-neutral-700">{siteProfile.workOverview}</p>
      <div className="mt-10 space-y-8">
        {experiences.map((role) => <Role key={role.company} role={role} />)}
      </div>
    </Container>
  );
}

function Role({ role }: { role: Experience }) {
  return (
    <section className="rounded-xl border border-neutral-200 p-5">
      <div className="text-sm font-semibold">{role.company}</div>
      <div className="mt-1 text-neutral-800">{role.title}</div>
      <div className="mt-1 text-sm text-neutral-500">{role.dates}</div>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
        {role.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
      </ul>
      {role.link ? (
        <a href={role.link} target="_blank" rel="noreferrer"
          className="mt-4 inline-block text-sm underline">Explore the portfolio</a>
      ) : null}
    </section>
  );
}
