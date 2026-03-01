"use client";
import { useState } from "react";
import type { TripPlan, TripRequest } from "@/lib/api";
import styles from "./ModifyPlanTab.module.css";

interface Props {
    plan: TripPlan;
    request: TripRequest;
    onRebalance: (budget?: number, comfort?: number, days?: number) => Promise<void>;
    rebalancing: boolean;
}

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function ModifyPlanTab({ plan, request, onRebalance, rebalancing }: Props) {
    const [budget, setBudget] = useState(plan.total_budget);
    const [comfort, setComfort] = useState(request.comfort);
    const [days, setDays] = useState(plan.days);

    const comfortLabel = comfort < 0.35 ? "Budget" : comfort < 0.7 ? "Mid-Range" : "Premium";
    const comfortColor = comfort < 0.35 ? "#00C48C" : comfort < 0.7 ? "#4F8EF7" : "#F59E0B";

    const hasChanges =
        budget !== plan.total_budget ||
        comfort !== request.comfort ||
        days !== plan.days;

    const handleApply = () => {
        onRebalance(
            budget !== plan.total_budget ? budget : undefined,
            comfort !== request.comfort ? comfort : undefined,
            days !== plan.days ? days : undefined,
        );
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <h2>⚙️ Modify & Rebalance</h2>
                <p>Adjust any parameter — the AMD optimization engine recalculates everything instantly.</p>
            </div>

            <div className={styles.layout}>
                <div className={styles.controls}>

                    {/* Budget */}
                    <div className="card">
                        <div className={styles.controlHeader}>
                            <h3>💰 Budget</h3>
                            <span style={{ color: "var(--amd-red)", fontWeight: "800", fontSize: "1.25rem" }}>{fmt(budget)}</span>
                        </div>
                        <input
                            id="modify-budget-slider"
                            type="range"
                            className="slider slider-red"
                            min={2000} max={500000} step={1000}
                            value={budget}
                            style={{ "--value": `${((budget - 2000) / (500000 - 2000)) * 100}%` } as React.CSSProperties}
                            onChange={e => setBudget(Number(e.target.value))}
                        />
                        <div className={styles.sliderLabels}>
                            <span>₹2K</span><span>₹1L</span><span>₹3L</span><span>₹5L</span>
                        </div>
                        {budget !== plan.total_budget && (
                            <div className={styles.changePill}>
                                {budget > plan.total_budget ? "⬆️" : "⬇️"} {budget > plan.total_budget ? "+" : ""}
                                {fmt(budget - plan.total_budget)} from current
                            </div>
                        )}
                    </div>

                    {/* Comfort */}
                    <div className="card">
                        <div className={styles.controlHeader}>
                            <h3>🎯 Comfort Level</h3>
                            <span style={{ color: comfortColor, fontWeight: "700" }}>{comfortLabel}</span>
                        </div>
                        <input
                            id="modify-comfort-slider"
                            type="range"
                            className="slider slider-green"
                            min={0} max={1} step={0.01}
                            value={comfort}
                            style={{ "--value": `${comfort * 100}%` } as React.CSSProperties}
                            onChange={e => setComfort(Number(e.target.value))}
                        />
                        <div className={styles.sliderLabels}>
                            <span>💚 Budget</span><span>🔵 Mid</span><span>✨ Premium</span>
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="card">
                        <div className={styles.controlHeader}>
                            <h3>⏱️ Duration</h3>
                            <div className="stepper">
                                <button className="stepper-btn" onClick={() => setDays(d => Math.max(1, d - 1))}>−</button>
                                <span className="stepper-val">{days}</span>
                                <button className="stepper-btn" onClick={() => setDays(d => Math.min(30, d + 1))}>+</button>
                            </div>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            {days <= 2 ? "Weekend trip" : days <= 5 ? "Short break" : days <= 10 ? "Standard vacation" : "Long holiday"}
                        </p>
                    </div>

                    {/* Apply Button */}
                    <button
                        id="apply-rebalance-btn"
                        className="btn-primary w-full"
                        disabled={!hasChanges || rebalancing}
                        onClick={handleApply}
                        style={{ padding: "1rem", fontSize: "1rem", opacity: hasChanges ? 1 : 0.5 }}
                    >
                        {rebalancing ? (
                            <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Rebalancing with AMD ROCm…</>
                        ) : (
                            "⚡ Apply & Rebalance Plan"
                        )}
                    </button>
                    {!hasChanges && <p className="text-center" style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Make changes above to enable rebalancing</p>}
                </div>

                {/* Current plan preview */}
                <div className={styles.preview}>
                    <div className="card">
                        <h3 style={{ marginBottom: "1.25rem" }}>Current Plan Snapshot</h3>
                        {[
                            { label: "✈️ Travel", v: fmt(plan.budget_split.travel) },
                            { label: "🏨 Hotel", v: fmt(plan.budget_split.hotel) },
                            { label: "🍽️ Food", v: fmt(plan.budget_split.food) },
                            { label: "🎯 Activities", v: fmt(plan.budget_split.activities) },
                            { label: "🛺 Local Transport", v: fmt(plan.budget_split.local_transport) },
                            { label: "🛡️ Buffer", v: fmt(plan.budget_split.emergency_buffer) },
                        ].map(item => (
                            <div key={item.label} className={styles.snapshotRow}>
                                <span>{item.label}</span>
                                <span style={{ fontWeight: "600" }}>{item.v}</span>
                            </div>
                        ))}
                        <div className="divider" />
                        <div className={styles.snapshotRow} style={{ fontWeight: "800" }}>
                            <span>Total</span>
                            <span style={{ color: "var(--amd-red)" }}>{fmt(plan.total_budget)}</span>
                        </div>
                    </div>

                    <div className="card" style={{ marginTop: "1rem" }}>
                        <h3 style={{ marginBottom: "1rem" }}>Rebalancing Engine</h3>
                        <div className={styles.engineInfo}>
                            <div className={styles.engineBadge}>
                                <span className="amd-badge" style={{ display: "inline-flex" }}>🔴 AMD ROCm Primary</span>
                            </div>
                            <p style={{ fontSize: "0.85rem", marginTop: "0.75rem" }}>
                                Changes propagate through the full optimization stack — travel mode, hotel category,
                                food allocation, and activity buffer all recalculate simultaneously under your new constraints.
                            </p>
                            <div className={styles.engineSteps}>
                                {["Budget re-allocation", "Mode re-selection", "Hotel re-scoring", "Itinerary rebuild"].map((s, i) => (
                                    <div key={s} className={styles.engineStep}>
                                        <span className={styles.engineStepNum}>{i + 1}</span>
                                        <span>{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
