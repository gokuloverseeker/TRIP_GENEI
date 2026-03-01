"use client";
import type { TripPlan } from "@/lib/api";
import styles from "./HotelsTab.module.css";

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function Stars({ r }: { r: number }) {
    return (
        <span className="stars">
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} style={{ color: i <= Math.round(r) ? "#F59E0B" : "var(--surface-3)", fontSize: "0.9rem" }}>★</span>
            ))}
            <span style={{ marginLeft: "0.3rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>{r}</span>
        </span>
    );
}

function ScoreBar({ score }: { score: number }) {
    const pct = (score / 10) * 100;
    const color = pct >= 75 ? "#00C48C" : pct >= 50 ? "#4F8EF7" : "#F59E0B";
    return (
        <div className={styles.scoreBarWrap}>
            <div className={styles.scoreBarTrack}>
                <div className={styles.scoreBarFill} style={{ width: `${pct}%`, background: color }} />
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color }}>{score}/10</span>
        </div>
    );
}

export default function HotelsTab({ plan }: { plan: TripPlan }) {
    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <h2>🏨 Hotel Recommendations</h2>
                <p>Ranked by: Price Fit (40%) + Rating (30%) + Location (30%)</p>
            </div>

            <div className={styles.hotelGrid}>
                {plan.all_hotels.map((hotel, idx) => {
                    const isRecommended = hotel.name === plan.hotel_recommendation.name;
                    return (
                        <div key={idx} className={`${styles.hotelCard} ${isRecommended ? styles.recommended : ""}`}>
                            {isRecommended && (
                                <div className={styles.recommendedBadge}>⭐ TripGenie Pick</div>
                            )}
                            <div className={styles.hotelTop}>
                                <div>
                                    <div className={styles.hotelName}>{hotel.name}</div>
                                    <Stars r={hotel.rating} />
                                </div>
                                <div className={`badge ${hotel.category === "Budget" ? "badge-green" : hotel.category === "Mid-Range" ? "badge-blue" : "badge-gold"}`}>
                                    {hotel.category}
                                </div>
                            </div>

                            <div className={styles.scoreRow}>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Optimization Score</span>
                                <ScoreBar score={hotel.score} />
                            </div>

                            <div className={styles.hotelDetails}>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Per Night</span>
                                    <span className={styles.detailValue} style={{ color: "var(--amd-red)" }}>{fmt(hotel.price_per_night)}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Total Stay ({plan.days} nights)</span>
                                    <span className={styles.detailValue}>{fmt(hotel.total_cost)}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Distance</span>
                                    <span className={styles.detailValue}>{hotel.distance_from_center} km from center</span>
                                </div>
                            </div>

                            <div className={styles.address}>📍 {hotel.address}</div>

                            <div className={styles.amenities}>
                                {hotel.amenities.map(a => (
                                    <span key={a} className={styles.amenityChip}>{a}</span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
