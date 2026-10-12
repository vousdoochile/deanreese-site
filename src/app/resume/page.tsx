import Container from "../../components/Container";
import { siteProfile, resumeHighlights, education, certifications } from "../../content/site";

export default function ResumePage() {
  return (
    <Container>
      <h1 className="text-2xl font-semibold tracking-tight">Resume &amp; qualifications</h1>
      <p className="mt-2 text-neutral-700">{siteProfile.resumeOverview}</p>

      <div className="mt-6 rounded-xl border border-neutral-200 p-5">
        <div className="text-sm font-semibold text-neutral-900">{siteProfile.name}</div>
        <div className="mt-1 text-sm text-neutral-700">
          {siteProfile.headline} · {siteProfile.location}
        </div>
        <a href={siteProfile.linkedinUrl} target="_blank" rel="noreferrer"
          className="mt-3 inline-block text-sm underline">LinkedIn profile</a>

        <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Highlights
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          {resumeHighlights.map((item) => <li key={item}>{item}</li>)}
        </ul>

        <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Education &amp; certifications
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          {[education, ...certifications].map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
        <h2 className="text-sm font-semibold text-neutral-900">Download my current resume</h2>
        <p className="mt-2 text-sm text-neutral-700">
          Updated {siteProfile.resumeEdition} with my Stripe Technical Account Manager role,
          Home Based Daddy portfolio, and earlier payments and banking experience.
        </p>
        <a className="mt-3 inline-block rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
          href={siteProfile.resumePath} target="_blank" rel="noreferrer">
          View or download resume PDF
        </a>
      </div>
    </Container>
  );
}
