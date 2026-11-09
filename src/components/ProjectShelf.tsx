import Link from "next/link";
import { makerProjects } from "../content/site";

// Deliberately curated, not newest-first: play, a useful household build, and a character.
const featuredNames = ["Dana’s Dog Dash", "Dean & Dana HQ Frame", "SH-3PB"];

export default function ProjectShelf({ featured = false }: { featured?: boolean }) {
  const projects = featured
    ? featuredNames.flatMap((name) => makerProjects.filter((project) => project.name === name))
    : makerProjects;

  return (
    <div className="project-shelf">
      {projects.map((project) => (
        <article className="project-tile" key={project.name}>
          <Link className="project-tile-main" href={`/writing/${project.writingSlug}`}>
            <div className="project-thumbnail">
              <img src={project.image} alt={project.imageAlt} width={640} height={400} loading="lazy" />
            </div>
            <div className="project-tile-copy">
              <p className="project-tile-label">{project.cardLabel}</p>
              <h3>{project.name}</h3>
              <p className="project-tile-summary">{project.cardSummary}</p>
              <span className="project-tile-read">Read the build story <span aria-hidden="true">↗</span></span>
            </div>
          </Link>
          {"url" in project && typeof project.url === "string" ? (
            <a className="project-tile-play" href={project.url} target="_blank" rel="noreferrer">
              Play the game <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </article>
      ))}
    </div>
  );
}
