import type { Metadata } from "next";
import Link from "next/link";
import ArcadeWindow from "../../components/deanvaders/ArcadeWindow";
import styles from "../../components/deanvaders/deanvaders.module.css";
export const metadata:Metadata={title:"Deanvaders | Get your head in the game",description:"One head. Two lasers. Entirely too many meetings. A tiny original arcade game from Dean Reese."};
export default function PlayPage(){return <div className={styles.page}>
  <div className={styles.pageIntro}><div><p className={styles.label}>AFTER HOURS / MINI ARCADE</p><h1>DEANVADERS</h1><p>Get your head in the game.</p></div><Link href="/">← Back to Dean</Link></div>
  <ArcadeWindow/>
</div>;}
