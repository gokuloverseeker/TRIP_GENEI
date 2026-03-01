"use client";
import type { TripPlan } from "@/lib/api";
import styles from "./OverviewTab.module.css";

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="stars">
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className={i <= Math.round(rating) ? "star" : "star star-empty"}>★</span>
            ))}
            <span style={{ marginLeft: "0.25rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>{rating}</span>
        </div>
    );
}

export default function OverviewTab({ plan }: { plan: TripPlan }) {
    const bs = plan.budget_split;

    const budgetItems = [
        { label: "✈️ Travel", value: bs.travel, color: "#ED1C24", pct: bs.travel / bs.total * 100 },
        { label: "🏨 Hotel", value: bs.hotel, color: "#4F8EF7", pct: bs.hotel / bs.total * 100 },
        { label: "🍽️ Food", value: bs.food, color: "#00C48C", pct: bs.food / bs.total * 100 },
        { label: "🎯 Activities", value: bs.activities, color: "#F59E0B", pct: bs.activities / bs.total * 100 },
        { label: "🛺 Local Transport", value: bs.local_transport, color: "#8B5CF6", pct: bs.local_transport / bs.total * 100 },
        { label: "🛡️ Emergency", value: bs.emergency_buffer, color: "#6B7280", pct: bs.emergency_buffer / bs.total * 100 },
    ];

    return (
        <div className={styles.wrap}>
            {/* Trip Card */}
            <div className={styles.tripCard}>
                <div className={styles.tripCardLeft}>
                    <div className="amd-badge" style={{ display: "inline-flex" }}>
                        {plan.ai_backend.includes("ROCm") ? "🔴 AMD ROCm" : plan.ai_backend.includes("OpenAI") ? "🤖 OpenAI" : "⚙️ Rule Engine"} · {plan.comfort_level}
                    </div>
                    <h2 style={{ marginTop: "1rem", fontSize: "1.75rem" }}>
                        {plan.source} <span style={{ color: "var(--amd-red)" }}>→</span> {plan.destination}
                    </h2>
                    <div className={styles.tripMeta}>
                        <span>📅 {plan.days} Days</span>
                        <span>👥 {plan.people} {plan.people === 1 ? "Person" : "People"}</span>
                        <span>🧭 {plan.preference.charAt(0).toUpperCase() + plan.preference.slice(1)}</span>
                        <span>🚗 {plan.travel_mode}</span>
                    </div>
                    <div className={styles.budgetTotal}>
                        <span className={styles.budgetTotalLabel}>Total Budget</span>
                        <span className={styles.budgetTotalValue}>{fmt(plan.total_budget)}</span>
                    </div>
                    <div className={styles.perPerson}>
                        {fmt(Math.round(plan.total_budget / plan.people))} per person
                    </div>
                </div>
                <div className={styles.tripCardRight}>
                    <div className={styles.metricCard}>
                        <div className={styles.metricIcon}>✈️</div>
                        <div className={styles.metricLabel}>Travel Cost/person</div>
                        <div className={styles.metricValue}>{fmt(plan.travel_cost_per_person)}</div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={styles.metricIcon}>🏨</div>
                        <div className={styles.metricLabel}>Hotel/night</div>
                        <div className={styles.metricValue}>{fmt(plan.hotel_recommendation.price_per_night)}</div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={styles.metricIcon}>🌱</div>
                        <div className={styles.metricLabel}>CO₂ Footprint</div>
                        <div className={styles.metricValue} style={{ color: "var(--green)" }}>{plan.carbon_footprint_kg} kg</div>
                    </div>
                </div>
            </div>

            {/* Budget Split Visual */}
            <div className="card" style={{ marginTop: "1.5rem" }}>
                <h3 style={{ marginBottom: "1.25rem" }}>💰 Budget Allocation</h3>
                <div className={styles.budgetBars}>
                    {budgetItems.map(item => (
                        <div key={item.label} className={styles.budgetRow}>
                            <div className={styles.budgetRowLabel}>
                                <span>{item.label}</span>
                                <span style={{ color: item.color, fontWeight: "700" }}>{fmt(item.value)}</span>
                            </div>
                            <div className={styles.barTrack}>
                                <div
                                    className={styles.barFill}
                                    style={{ width: `${item.pct}%`, background: item.color }}
                                />
                                <span className={styles.barPct}>{item.pct.toFixed(1)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hotel Highlight */}
            <div className={styles.twoCol}>
                <div className="card">
                    <h3 style={{ marginBottom: "1rem" }}>🏨 Recommended Hotel</h3>
                    <div className={styles.hotelHighlight}>
                        <div style={{ fontSize: "1.1rem", fontWeight: "700" }}>{plan.hotel_recommendation.name}</div>
                        <StarRating rating={plan.hotel_recommendation.rating} />
                        <div className={`badge badge-blue`} style={{ marginTop: "0.4rem", display: "inline-flex" }}>
                            {plan.hotel_recommendation.category}
                        </div>
                        <div className={styles.hotelMeta}>
                            <span>📍 {plan.hotel_recommendation.address}</span>
                            <span>💰 {fmt(plan.hotel_recommendation.price_per_night)}/night</span>
                            <span>📊 Score: {plan.hotel_recommendation.score}/10</span>
                        </div>
                        <div className={styles.amenityChips}>
                            {plan.hotel_recommendation.amenities.map(a => (
                                <span key={a} className={styles.amenityChip}>{a}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tips */}
                <div className="card">
                    <h3 style={{ marginBottom: "1rem" }}>💡 TripGenie Tips</h3>
                    <ul className={styles.tipsList}>
                        {plan.tips.map((tip, i) => (
                            <li key={i} className={styles.tipItem}>
                                <span className={styles.tipNum}>{i + 1}</span>
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
