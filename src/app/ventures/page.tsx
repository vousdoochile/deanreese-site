import Link from "next/link";
import { ventures, siteProfile } from "../../content/site";

const themes = ["01 / OPERATIONS","02 / SOFTWARE","03 / HUMAN-CENTERED AI","04 / WEBCARE"];

export const metadata = {
  title: "Independent Projects",
  description: "Explore practical AI and software projects built by Dean Reese through Home Based Daddy, LLC.",
};

export default function VenturesPage() {
  return (
    <div className="container-wide">
      <div className="small-header">
        <p className="section-eyebrow">INDEPENDENT BUILDS / HOME BASED DADDY</p>
        <h1 className="section-title">Things I&apos;m building.</h1>
        <p className="section-lede">I like products that help actual people with actual problems. Here&apos;s a look at work outside my day job, from human-centered AI to small-business software.</p>
        <a href={siteProfile.portfolioUrl} target="_blank" rel="noreferrer" className="text-link" style={{display:"inline-block",marginTop:20}}>Visit Home Based Daddy ↗</a>
      </div>
      <div className="venture-grid venture-detail-grid">
        {ventures.map((v,i) => {
          const url = "url" in v && v.url ? v.url : null;
          return (
            <article className="venture-card" key={v.name}>
              <div className={"venture-art variant-" + (i % 4)}>
                <span className="venture-art-small">{themes[i] || "INDEPENDENT WORK"}</span>
                <span className="venture-art-name">{v.name}</span>
              </div>
              <div className="venture-body">
                <p className="venture-meta">Home Based Daddy, LLC</p>
                <h2 className="venture-name">{v.name}</h2>
                <p className="venture-desc">{v.description}</p>
                {url ? <a href={url} target="_blank" rel="noreferrer" className="venture-open">Visit the public project ↗</a> :
                  <span className="venture-open">A project in the HBD portfolio</span>}
              </div>
            </article>
          );
        })}
      </div>
      <section style={{marginBottom:75}}>
        <div className="ask-band">
          <div>
            <p className="hero-kicker" style={{marginBottom:12}}>THE OTHER SIDE OF MY WORK</p>
            <h2>Want the career version?</h2>
            <p>My professional background spans technical account management, payments, banking technology, and enterprise delivery.</p>
          </div>
          <Link href="/work" className="button-neo primary">View experience ↗</Link>
        </div>
      </section>
    </div>
  );
}
