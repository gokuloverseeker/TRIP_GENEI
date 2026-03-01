"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateTripPlan, type TripRequest } from "@/lib/api";
import styles from "./page.module.css";

const PREFERENCES = [
    { id: "adventure", emoji: "🏔️", label: "Adventure" },
    { id: "relaxation", emoji: "🌊", label: "Relaxation" },
    { id: "cultural", emoji: "🏛️", label: "Cultural" },
    { id: "spiritual", emoji: "🕌", label: "Spiritual" },
    { id: "mixed", emoji: "🎯", label: "Mixed" },
];

const formatBudget = (v: number) =>
    v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${v.toLocaleString("en-IN")}`;

export default function PlanPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState<TripRequest>({
        source: "",
        destination: "",
        days: 3,
        budget: 15000,
        people: 2,
        comfort: 0.5,
        preference: "mixed",
        start_date: "",
    });

    const set = useCallback((key: keyof TripRequest, value: unknown) => {
        setForm(f => ({ ...f, [key]: value }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!form.source.trim() || !form.destination.trim()) {
            setError("Please enter both source and destination.");
            return;
        }
        if (form.budget < form.people * form.days * 500) {
            setError(`Minimum budget is ₹${(form.people * form.days * 500).toLocaleString("en-IN")} for ${form.people} people, ${form.days} days.`);
            return;
        }
        setLoading(true);
        try {
            const plan = await generateTripPlan(form);
            sessionStorage.setItem("tripPlan", JSON.stringify(plan));
            sessionStorage.setItem("tripRequest", JSON.stringify(form));
            router.push("/results");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong. Is the backend running?");
            setLoading(false);
        }
    };

    const comfortLabel = form.comfort < 0.35 ? "Budget" : form.comfort < 0.7 ? "Mid-Range" : "Premium";
    const comfortColor = form.comfort < 0.35 ? "#00C48C" : form.comfort < 0.7 ? "#4F8EF7" : "#F59E0B";

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className="container flex items-center justify-between" style={{ padding: "1rem 1.5rem" }}>
                    <Link href="/" className={styles.logo}>
                        <span>✈️</span>
                        <span>TripGenie <span className="gradient-text">AI</span></span>
                    </Link>
                    <span className="amd-badge">AMD ROCm Powered</span>
                </div>
            </header>

            {/* Form */}
            <main className={`${styles.formWrap} grid-texture`}>
                <div className={styles.heroGlow} />
                <div className={styles.formContainer}>
                    <div className="text-center" style={{ marginBottom: "2rem" }}>
                        <div className="amd-badge" style={{ display: "inline-flex", marginBottom: "1rem" }}>
                            🚀 Multi-Variable Optimization Engine
                        </div>
                        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                            Plan Your <span className="gradient-text">Smart Trip</span>
                        </h1>
                        <p>Fill in your constraints — we'll handle everything else.</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Row 1: Source + Destination */}
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">📍 From (Source)</label>
                                <input
                                    id="source-input"
                                    className="form-input"
                                    placeholder="e.g. Mumbai"
                                    value={form.source}
                                    onChange={e => set("source", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">🎯 To (Destination)</label>
                                <input
                                    id="destination-input"
                                    className="form-input"
                                    placeholder="e.g. Goa, Manali, Jaipur"
                                    value={form.destination}
                                    onChange={e => set("destination", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 2: Date + Duration */}
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">📅 Start Date (Optional)</label>
                                <input
                                    id="start-date-input"
                                    className="form-input"
                                    type="date"
                                    value={form.start_date || ""}
                                    onChange={e => set("start_date", e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">⏱️ Duration: {form.days} Days</label>
                                <div className="stepper" style={{ marginTop: "0.25rem" }}>
                                    <button type="button" className="stepper-btn"
                                        onClick={() => set("days", Math.max(1, form.days - 1))}>−</button>
                                    <span className="stepper-val">{form.days}</span>
                                    <button type="button" className="stepper-btn"
                                        onClick={() => set("days", Math.min(30, form.days + 1))}>+</button>
                                    <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{form.days <= 2 ? "Weekend" : form.days <= 5 ? "Short break" : "Long trip"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Budget Slider */}
                        <div className="form-group">
                            <label className="form-label" style={{ justifyContent: "space-between", display: "flex" }}>
                                <span>💰 Total Budget</span>
                                <span style={{ color: "var(--amd-red)", fontWeight: "800", fontSize: "1rem" }}>
                                    {formatBudget(form.budget)}
                                </span>
                            </label>
                            <input
                                id="budget-slider"
                                type="range"
                                className="slider slider-red"
                                min={2000}
                                max={500000}
                                step={1000}
                                value={form.budget}
                                style={{ "--value": `${((form.budget - 2000) / (500000 - 2000)) * 100}%` } as React.CSSProperties}
                                onChange={e => set("budget", Number(e.target.value))}
                            />
                            <div className={styles.sliderLabels}>
                                <span>₹2K</span>
                                <span>₹1L</span>
                                <span>₹3L</span>
                                <span>₹5L</span>
                            </div>
                        </div>

                        {/* Travelers */}
                        <div className="form-group">
                            <label className="form-label">👥 Number of Travelers</label>
                            <div className="flex gap-2 items-center" style={{ marginTop: "0.25rem" }}>
                                <div className="stepper">
                                    <button type="button" className="stepper-btn"
                                        onClick={() => set("people", Math.max(1, form.people - 1))}>−</button>
                                    <span className="stepper-val">{form.people}</span>
                                    <button type="button" className="stepper-btn"
                                        onClick={() => set("people", Math.min(20, form.people + 1))}>+</button>
                                </div>
                                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                                    {form.people === 1 ? "Solo" : form.people === 2 ? "Couple" : form.people <= 5 ? "Small Group" : "Large Group"}
                                    {" · "}Budget/person: {formatBudget(Math.floor(form.budget / form.people))}
                                </span>
                            </div>
                        </div>

                        {/* Comfort Slider */}
                        <div className="form-group">
                            <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>🎯 Comfort Level</span>
                                <span style={{ color: comfortColor, fontWeight: "700" }}>{comfortLabel}</span>
                            </label>
                            <input
                                id="comfort-slider"
                                type="range"
                                className="slider slider-green"
                                min={0}
                                max={1}
                                step={0.01}
                                value={form.comfort}
                                style={{ "--value": `${form.comfort * 100}%` } as React.CSSProperties}
                                onChange={e => set("comfort", Number(e.target.value))}
                            />
                            <div className={styles.sliderLabels}>
                                <span>💚 Budget</span>
                                <span>🔵 Mid-Range</span>
                                <span>✨ Premium</span>
                            </div>
                        </div>

                        {/* Preference Pills */}
                        <div className="form-group">
                            <label className="form-label">🧭 Travel Preference</label>
                            <div className="pref-grid" style={{ marginTop: "0.25rem" }}>
                                {PREFERENCES.map(p => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        id={`pref-${p.id}`}
                                        className={`pref-pill ${form.preference === p.id ? "selected" : ""}`}
                                        onClick={() => set("preference", p.id)}
                                    >
                                        {p.emoji} {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Budget Preview */}
                        <div className={styles.budgetPreview}>
                            <div className={styles.budgetPreviewTitle}>📊 Estimated Budget Split Preview</div>
                            <div className={styles.budgetBars}>
                                {[
                                    { label: "Travel", pct: 25, color: "#ED1C24" },
                                    { label: "Hotel", pct: 33, color: "#4F8EF7" },
                                    { label: "Food", pct: 20, color: "#00C48C" },
                                    { label: "Activities", pct: 12, color: "#F59E0B" },
                                    { label: "Buffer", pct: 10, color: "#8B5CF6" },
                                ].map(b => (
                                    <div key={b.label} className={styles.budgetBar}>
                                        <div className={styles.budgetBarLabel}>
                                            <span>{b.label}</span>
                                            <span>{b.pct}%</span>
                                        </div>
                                        <div className={styles.budgetBarTrack}>
                                            <div className={styles.budgetBarFill} style={{ width: `${b.pct * 3}%`, background: b.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                                * Exact split calculated by AMD optimization engine based on your inputs
                            </p>
                        </div>

                        {error && (
                            <div className={styles.errorBox}>
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            id="generate-plan-btn"
                            type="submit"
                            className="btn-primary w-full"
                            disabled={loading}
                            style={{ padding: "1.1rem", fontSize: "1.1rem", marginTop: "0.5rem" }}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                                    Optimizing with AMD ROCm...
                                </>
                            ) : (
                                "🚀 Generate Smart Plan"
                            )}
                        </button>

                        <p className="text-center" style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            AI inference: AMD ROCm → OpenAI → Rule-based (automatic fallback)
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );
}
