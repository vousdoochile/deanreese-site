import Link from "next/link";
import ArcadeWindow from "../components/deanvaders/ArcadeWindow";
import arcadeStyles from "../components/deanvaders/deanvaders.module.css";
import ProjectShelf from "../components/ProjectShelf";
import { siteProfile } from "../content/site";
import { orderedWritingPosts } from "../content/writing";

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
            <p className="hero-description">I&apos;m Dean. I work in payments, build businesses, and occasionally give a popcorn bucket a personality. I like making useful things for real people, especially the people I love.</p>
            <div className="hero-ctas">
              <Link className="button-neo primary" href="/ventures">See what I&apos;m building <span aria-hidden="true">↗</span></Link>
              <a className="button-neo secondary" href={siteProfile.linkedinUrl}>Say hello <span aria-hidden="true">↗</span></a>
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
            <p className="section-lede">A few favorites from my personal maker lab. Pick what catches your eye, then get the story behind the build.</p>
          </div>
          <Link className="text-link" href="/ventures">Browse all projects ↗</Link>
        </div>
        <ProjectShelf featured />
        <div className="business-home-band">
          <div>
            <p className="section-eyebrow">THE BUSINESS SIDE / HOME BASED DADDY</p>
            <p>Practical software and services for real-world problems.</p>
          </div>
          <Link className="text-link" href="/ventures#businesses">Explore the businesses ↗</Link>
        </div>
      </section>

      <section className="retro-section proof-section">
        <div className="container-wide">
          <div className="section-heading-row">
            <div>
              <p className="section-eyebrow" style={{color:"#6ff0db"}}>02 / THE PROFESSIONAL SIDE</p>
              <h2 className="section-title">Built in the real world.<br />Not just in theory.</h2>
              <p className="section-lede">A career in technology, with people at the center.</p>
            </div>
            <Link className="text-link" href="/work" style={{color:"#6ff0db"}}>Full experience ↗</Link>
          </div>
          <p className="credibility-summary">By day, I&apos;m a Technical Account Manager at Stripe. Before that, I worked across payments delivery, banking technology, and customer enablement at Paymentus and KlariVis. The common thread: helping people make complicated systems work in real life.</p>
          <p style={{fontSize:12,color:"#aabbd3",marginTop:26}}>Experience and independent projects are distinct. Everything on this site represents my own work and views.</p>
        </div>
      </section>

      <section className="retro-section container-wide">
        <p className="section-eyebrow">03 / WHY I BUILD</p>
        <h2 className="section-title">A little more freedom.<br />A lot more curiosity.</h2>
        <div className="why-build-copy">
          <p>I&apos;m building a business and a life with more room to choose what I work on and how I spend my time. That&apos;s what freedom means to me. Not doing nothing. Doing more of what matters.</p>
          <p>Sometimes that means useful software. Sometimes it means a game for Dana or a droid with opinions. I grew up loving cartoons, video games, and the worlds they let me step into. I still love that feeling. Now I get to build some of those worlds myself.</p>
          <p>I want the things I make to help people, make them smile, or give them a little breathing room. Ideally, all three.</p>
        </div>
      </section>

      <section className={`container-wide ${arcadeStyles.homeSection}`} id="arcade" aria-label="Dean’s mini arcade">
        <div className={arcadeStyles.homeCopy}>
          <p className={arcadeStyles.label}>A LITTLE BREATHING ROOM</p>
          <h2>Sometimes useful<br />means fun.</h2>
          <p>My head. Eye lasers. An unreasonable number of emails, bills, Zoom meetings, and Jira tickets. Welcome to Deanvaders.</p>
          <p>Catch a coffee, clear your schedule, and take a tiny break from being a responsible adult.</p>
          <div className={arcadeStyles.roster}><span>✉ Inbox overload</span><span>☕ Coffee-powered</span><span>↔ Keyboard + touch</span></div>
          <Link href="/play">Want a little more room? Open the arcade ↗</Link>
        </div>
        <ArcadeWindow />
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
            <p className="hero-kicker" style={{marginBottom:12}}>GOOD PEOPLE. INTERESTING IDEAS.</p>
            <h2>Building something of your own?</h2>
            <p>I&apos;d love to hear about it. Fellow founders, curious makers, people figuring it out as they go: say hello. You don&apos;t need a polished pitch.</p>
            <p className="human-contact-note">Want to explore first? <Link href="/chat">Ask my AI alter ego</Link> about my published work.</p>
          </div>
          <a href={siteProfile.linkedinUrl} className="button-neo primary">Say hello on LinkedIn <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </div>
  );
}
