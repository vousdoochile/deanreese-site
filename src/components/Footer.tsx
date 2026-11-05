import Link from "next/link";
import { siteProfile } from "../content/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-wide">
        <div className="footer-top">
          <div>
            <div className="footer-mark">Dean Reese<span style={{color:"#6ff0db"}}>.</span></div>
            <p className="footer-summary">Technology, AI and independent projects. I believe the best technology is the kind that makes real life a little better.</p>
          </div>
          <div className="footer-links">
            <Link href="/work">Experience</Link>
            <Link href="/ventures">Projects</Link>
            <Link href="/writing">Writing</Link>
            <Link href="/resume">Resume</Link>
            <Link href="/chat">Ask Dean</Link>
            <a href={siteProfile.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://github.com/vousdoochile" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Based in Arlington, Tennessee · Always curious.</span>
          <span>Independent projects and opinions are my own, not those of my employer.</span>
        </div>
      </div>
    </footer>
  );
}
