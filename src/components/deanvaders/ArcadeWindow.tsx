"use client";
import dynamic from "next/dynamic";
import styles from "./deanvaders.module.css";
const Deanvaders = dynamic(()=>import("./Deanvaders"), {ssr:false,loading:()=> <div className={styles.loading}>Warming up the eye lasers…</div>});
export default function ArcadeWindow(){return <Deanvaders/>;}
