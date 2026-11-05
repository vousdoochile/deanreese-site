import Link from "next/link";
import MakerFeature from "../components/MakerFeature";
import { siteProfile, ventures, experiences, focusAreas } from "../content/site";
import { orderedWritingPosts } from "../content/writing";

const spotlight = [
  experiences.find((e) => e.company === "Stripe"),
  experiences.find((e) => e.company === "Home Based Daddy, LLC"),
  experiences.find((e) => e.company === "Paymentus"),
  experiences.find((e) => e.company === "KlariVis"),
].filter(Boolean);

const visualTags = ["01 / SOFTWARE", "02 / OPERATIONS", "03 / HUMAN-CENTERED AI", "04 / DIGITAL SERVICES"];

export default function HomePage() {
  return (
    <div className="retro-home">
      <section className="hero-shell">
        <div aria-hidden="true" className="orbit-sun" />
        <div aria-hidden="true" className="orbit-line" />
        <div aria-hidden="true" className="orbit-line second" />
        <div aria-hidden="true" className="hero-gridline" />
        <div aria-hidden="true" className="horizon" />
        <div className="container-wide hero-content">
          <div>
            <div className="hero-kicker"><span className="signal-dot" /> TECH BY DAY. BUILDER BY NATURE.</div>
            <h1 className="hero-title">The future<br /><em>should be</em><br /><strong>useful.</strong></h1>
            <p className="hero-description">I&apos;m Dean. I help ambitious teams solve complex technology problems, and I build practical AI products of my own.</p>
            <div className="hero-ctas">
              <Link className="button-neo primary" href="/ventures">See what I&apos;m building <span aria-hidden="true">↗</span></Link>
              <Link className="button-neo secondary" href="/resume">The professional side <span aria-hidden="true">↗</span></Link>
            </div>
            <p className="hero-mini">Technical Account Manager at Stripe <span aria-hidden="true">✦</span> Founder, Home Based Daddy, LLC <span aria-hidden="true">✦</span> AIGP</p>
          </div>
          <div className="portrait-frame">
            <picture>
              <source media="(prefers-reduced-motion: reduce)" srcSet="/dean-reese-retro-still.webp" type="image/webp" />
              <img src="/dean-reese-retro.gif" alt="Animated retro-futurist portrait of Dean Reese with pixel sunglasses dropping into place" width={439} height={437} decoding="async" />
            </picture>
            <span className="portrait-label">Human behind the systems</span>
          </div>
        </div>
      </section>

      <section className="retro-section container-wide" id="projects">
        <div className="section-heading-row">
          <div>
            <p className="section-eyebrow">01 / AFTER HOURS</p>
            <h2 className="section-title">Ideas that escape<br />the notes app.</h2>
            <p className="section-lede">Home Based Daddy is where I turn curiosity into useful products. Some are live, some are growing, and all are built around real problems.</p>
          </div>
          <Link className="text-link" href="/ventures">All projects ↗</Link>
        </div>
        <div className="venture-grid">
          {ventures.map((v, i) => {
            const href = "url" in v && v.url ? v.url : "/ventures";
            const external = href.startsWith("http");
            return (
              <a className="venture-card" href={href} key={v.name} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
                <div className={"venture-art variant-" + (i % 4)}>
                  <span className="venture-art-small">{visualTags[i] || "INDEPENDENT PROJECT"}</span>
                  <span className="venture-art-name">{v.name}</span>
                </div>
                <div className="venture-body">
                  <p className="venture-meta">Home Based Daddy / Selected project</p>
                  <h3 className="venture-name">{v.name}</h3>
                  <p className="venture-desc">{v.description}</p>
                  <span className="venture-open">{external ? "Visit project ↗" : "Explore portfolio ↗"}</span>
                </div>
              </a>
            );
          })}
        </div>
        <div className="maker-home-intro">
          <p className="section-eyebrow">PERSONAL MAKER LAB / AFTER HOURS</p>
          <h3 className="maker-home-title">When the prototype has a personality.</h3>
        </div>
        <MakerFeature />
        <a href={siteProfile.portfolioUrl} className="text-link" style={{display:"inline-block",marginTop:26}} target="_blank" rel="noreferrer">More from Home Based Daddy ↗</a>
      </section>

      <section className="retro-section proof-section">
        <div className="container-wide">
          <div className="section-heading-row">
            <div>
              <p className="section-eyebrow" style={{color:"#6ff0db"}}>02 / THE PROFESSIONAL SIDE</p>
              <h2 className="section-title">Built in the real world.<br />Not just in theory.</h2>
              <p className="section-lede">Enterprise technology, payment infrastructure, customer partnerships, and the hard work of getting complicated systems to deliver value.</p>
            </div>
            <Link className="text-link" href="/work" style={{color:"#6ff0db"}}>Full experience ↗</Link>
          </div>
          <div>
            {spotlight.map((item, i) => item ? (
              <div className="role-row" key={item.company}>
                <div className="role-number">0{i + 1} / {item.dates}</div>
                <div>
                  <div className="role-title">{item.featuredTitle || item.company}</div>
                  <p className="role-desc">{item.featuredDescription || item.bullets[0]}</p>
                </div>
              </div>
            ) : null)}
          </div>
          <p style={{fontSize:12,color:"#aabbd3",marginTop:26}}>Experience and independent projects are distinct. Everything on this site represents my own work and views.</p>
        </div>
      </section>

      <section className="retro-section container-wide">
        <p className="section-eyebrow">03 / HOW I THINK</p>
        <h2 className="section-title">Curiosity, meet follow-through.</h2>
        <p className="section-lede">I like work that combines technical detail with a human reason for doing it.</p>
        <div className="focus-grid">
          {focusAreas.map((f,i) => (
            <div className="focus-tile" key={f.title}>
              <div className="focus-icon" aria-hidden="true">{["✳","◇","✦"][i] || "✳"}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="retro-section container-wide" style={{paddingTop:15}}>
        <div className="section-heading-row">
          <div>
            <p className="section-eyebrow">04 / IDEAS, WRITTEN DOWN</p>
            <h2 className="section-title">Notes from the build.</h2>
          </div>
          <Link className="text-link" href="/writing">More writing ↗</Link>
        </div>
        <div className="writing-list">
          {orderedWritingPosts.slice(0,2).map((post) => (
            <Link href={"/writing/" + post.slug} className="writing-teaser" key={post.slug}>
              <div className="venture-meta">{post.date} · Practical notes</div>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <span className="venture-open">Read the story ↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-wide" style={{paddingBottom:100}}>
        <div className="ask-band">
          <div>
            <p className="hero-kicker" style={{marginBottom:12}}>A LITTLE EXPERIMENT</p>
            <h2>Ask my AI alter ego.</h2>
            <p>Curious about my projects, career, or approach to AI? Ask Dean answers from my published work, not made-up achievements.</p>
          </div>
          <Link href="/chat" className="button-neo primary">Ask Dean <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  );
}
