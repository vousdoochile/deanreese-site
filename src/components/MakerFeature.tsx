import Link from "next/link";
import { makerProjects } from "../content/site";

/**
 * Separate personal prototypes from the commercial Home Based Daddy venture grid.
 * The same approved data powers the website and Ask Dean.
 */
export default function MakerFeature() {
  return (
    <div className="maker-feature-list">
      {makerProjects.map((project) => (
        <article className="maker-feature" key={project.name}>
          <div className="maker-feature-image">
            <img src={project.image} alt={project.imageAlt} width={640} height={640} loading="lazy" />
            <span className="maker-image-caption">{project.imageCaption}</span>
          </div>
          <div className="maker-feature-copy">
            <p className="maker-eyebrow">{project.category} / {project.status}</p>
            <h3>{project.name}: {project.expandedName}</h3>
            <p className="maker-feature-description">{project.description}</p>
            <p className="maker-feature-technical">{project.technicalSummary}</p>
            <div className="maker-tech-tags" aria-label="Project technology">
              {project.stack.map((item) => <span key={item}>{item}</span>)}
            </div>
            <p className="maker-feature-next"><strong>Next:</strong> {project.planned}</p>
            <Link className="maker-story-link" href={`/writing/${project.writingSlug}`}>
              Read the technical build story ↗
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
