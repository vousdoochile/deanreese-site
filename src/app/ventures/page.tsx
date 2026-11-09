import Link from "next/link";
import ProjectShelf from "../../components/ProjectShelf";
import { ventures, siteProfile } from "../../content/site";

export const metadata = {
  title: "Independent Projects",
  description: "Explore practical AI, software, games, and hardware projects built by Dean Reese.",
};

export default function VenturesPage() {
  return (
    <div className="container-wide projects-index">
      <header className="small-header">
        <p className="section-eyebrow">THE PROJECT SHELF</p>
        <h1 className="section-title">Things I&apos;m building.</h1>
        <p className="section-lede">Games for my family, hardware with a personality, and software that makes life easier. Pick a project and see how it came together.</p>
        <nav className="project-section-nav" aria-label="Project collections">
          <a href="#maker-lab">Personal maker lab <span aria-hidden="true">↓</span></a>
          <a href="#businesses">Home Based Daddy businesses <span aria-hidden="true">↓</span></a>
        </nav>
      </header>
      <section className="project-collection" id="maker-lab" aria-labelledby="maker-projects-heading">
        <div className="section-heading-row">
          <div>
            <p className="section-eyebrow">PERSONAL MAKER LAB</p>
            <h2 id="maker-projects-heading" className="collection-title">Curiosity, made real.</h2>
          </div>
          <p className="collection-note">The full story is one click away.</p>
        </div>
        <ProjectShelf />
      </section>
      <section className="project-collection business-collection" id="businesses" aria-labelledby="business-heading">
        <div className="section-heading-row">
          <div>
            <p className="section-eyebrow">HOME BASED DADDY, LLC</p>
            <h2 id="business-heading" className="collection-title">The business side.</h2>
            <p className="section-lede">Independent products and services, separate from the personal maker lab.</p>
          </div>
          <a href={siteProfile.portfolioUrl} target="_blank" rel="noreferrer" className="text-link">Visit Home Based Daddy ↗</a>
        </div>
        <div className="business-shelf">
          {ventures.map((venture, i) => (
            <article className="business-tile" key={venture.name}>
              <span className={`business-mark variant-${i}`} aria-hidden="true">{["BF", "K", "ST", "HBD"][i]}</span>
              <div>
                <h3>{venture.name}</h3>
                <p>{venture.description}</p>
                {"url" in venture && venture.url ? (
                  <a href={venture.url} target="_blank" rel="noreferrer" className="text-link">Visit project ↗</a>
                ) : <span className="business-portfolio-label">In the HBD portfolio</span>}
              </div>
            </article>
          ))}
        </div>
      </section>
      <div className="project-footer-links">
        <Link className="text-link" href="/writing">Browse all writing ↗</Link>
        <Link className="text-link" href="/work">Looking for the career version? ↗</Link>
      </div>
    </div>
  );
}
