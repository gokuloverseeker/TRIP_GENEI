"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import ThemeToggle from "@/components/ThemeToggle";

const STATS = [
  { label: "Planning Time Saved", value: "97%", sub: "3 hours → 30 seconds" },
  { label: "Budget Accuracy", value: "98%", sub: "AI-optimized allocation" },
  { label: "AI Backend", value: "ROCm", sub: "AMD GPU accelerated" },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Optimization",
    desc: "Multi-variable constraint solving in under 5 seconds — travel, hotel, food, activities all balanced automatically."
  },
  {
    icon: "💰",
    title: "Smart Budget Allocation",
    desc: "Dynamic budget split across all categories. Emergency buffer included. Rebalances when you change any parameter."
  },
  {
    icon: "🏨",
    title: "Scored Hotel Picks",
    desc: "Hotels ranked by Price Fit, Rating & Location using our proprietary scoring formula — best value always on top."
  },
  {
    icon: "🗺️",
    title: "Day-Wise Itinerary",
    desc: "Morning, afternoon, evening slots. Geographically clustered. Zero backtracking. Built for maximum experience."
  },
  {
    icon: "🔴",
    title: "AMD ROCm Powered",
    desc: "Local LLM inference on AMD GPU hardware — no cloud, no latency. Llama 3.1 running on your AMD Instinct or Ryzen AI."
  },
  {
    icon: "🌱",
    title: "Carbon Footprint Meter",
    desc: "Know your trip's environmental impact. Switch travel modes to reduce your CO₂ footprint."
  },
];

const DESTINATIONS = ["Goa", "Manali", "Jaipur", "Kerala", "Ladakh", "Hampi"];

export default function LandingPage() {
  const [destIdx, setDestIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setDestIdx(i => (i + 1) % DESTINATIONS.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className={styles.main}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className="container flex items-center justify-between" style={{ padding: "1.25rem 1.5rem" }}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>✈️</span>
            <span>TripGenie <span className="gradient-text">AI</span></span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="amd-badge">AMD ROCm Powered</span>
            <ThemeToggle />
            <Link href="/plan" className="btn-primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.9rem" }}>
              Plan My Trip →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className={`${styles.hero} grid-texture`}>
        <div className={styles.heroGlow} />
        <div className="container text-center" style={{ position: "relative", zIndex: 1 }}>
          <div className={`amd-badge animate-fade-in`} style={{ marginBottom: "1.5rem", display: "inline-flex" }}>
            🔴 AMD ROCm · Llama 3.1 · Zero Cloud Dependency
          </div>
          <h1 className={`${styles.heroTitle} animate-fade-in stagger-1`}>
            Plan Your Perfect Trip<br />
            in <span className="gradient-text">30 Seconds</span>
          </h1>
          <p className={`${styles.heroSub} animate-fade-in stagger-2`}>
            AI-powered travel optimization that handles every variable — budget, hotels,<br />
            activities, routes — so you don't have to.
          </p>

          {/* Destination ticker */}
          <div className={`${styles.destTicker} animate-fade-in stagger-3`}>
            <span>✈️ Next stop:</span>
            <span className={styles.destName} key={destIdx}>{DESTINATIONS[destIdx]}</span>
          </div>

          <div className={`flex justify-center gap-2 animate-fade-in stagger-4`} style={{ marginTop: "2.5rem", flexWrap: "wrap" }}>
            <Link href="/plan" className="btn-primary" style={{ fontSize: "1.1rem", padding: "1rem 2.5rem" }}>
              🚀 Generate Smart Plan
            </Link>
            <a href="#features" className="btn-secondary" style={{ fontSize: "1rem" }}>
              See How It Works
            </a>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
                <div className={styles.statSub}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className={styles.section} id="how">
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: "3rem" }}>
            From <span className="gradient-text">Constraints → Complete Plan</span>
          </h2>
          <div className={styles.stepsRow}>
            {[
              { step: "01", title: "Input Your Constraints", desc: "Source, destination, budget, dates, group size, comfort level, preference type." },
              { step: "02", title: "AMD ROCm Optimizes", desc: "Local LLM + rule engine solves multi-variable constraints under your exact budget." },
              { step: "03", title: "Get Complete Itinerary", desc: "Day-wise plan, scored hotels, cost breakdown pie chart, travel mode — all in one view." },
              { step: "04", title: "Live Rebalancing", desc: "Change any parameter. The engine instantly recalculates every category dynamically." },
            ].map((s) => (
              <div key={s.step} className={styles.stepCard}>
                <div className={styles.stepNum}>{s.step}</div>
                <h3>{s.title}</h3>
                <p style={{ marginTop: "0.5rem" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.section} id="features" style={{ background: "var(--surface-1)" }}>
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: "3rem" }}>
            Everything Built-In
          </h2>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={`card ${styles.featureCard}`}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 style={{ marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.9rem" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={`${styles.ctaSection} grid-texture`}>
        <div className={styles.ctaGlow} />
        <div className="container text-center" style={{ position: "relative", zIndex: 1 }}>
          <h2>Ready to plan smarter?</h2>
          <p style={{ marginTop: "1rem", marginBottom: "2rem", fontSize: "1.1rem" }}>
            Zero manual research. Zero budget miscalculations. Just your perfect trip.
          </p>
          <Link href="/plan" className="btn-primary" style={{ fontSize: "1.1rem", padding: "1rem 2.5rem" }}>
            🚀 Start Planning Free
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className="container flex items-center justify-between" style={{ padding: "1.5rem" }}>
          <div className={styles.logo} style={{ fontSize: "1rem" }}>
            <span>✈️</span>
            <span>TripGenie AI</span>
          </div>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Powered by AMD ROCm · Built for hackathons · © 2026
          </span>
        </div>
      </footer>
    </main>
  );
}
