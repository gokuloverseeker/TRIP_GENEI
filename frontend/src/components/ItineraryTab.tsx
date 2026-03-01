"use client";
import type { TripPlan } from "@/lib/api";
import styles from "./ItineraryTab.module.css";

const SLOT_ICONS: Record<string, string> = {
    morning: "🌅",
    afternoon: "☀️",
    evening: "🌙",
};

const SLOT_COLORS: Record<string, string> = {
    morning: "#F59E0B",
    afternoon: "#ED1C24",
    evening: "#4F8EF7",
};

export default function ItineraryTab({ plan }: { plan: TripPlan }) {
    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <h2>📅 Day-Wise Itinerary</h2>
                <p>{plan.destination} · {plan.days} Days · {plan.preference} preference</p>
            </div>

            {plan.itinerary.map((day) => (
                <div key={day.day} className={styles.dayCard}>
                    {/* Day header */}
                    <div className={styles.dayHeader}>
                        <div className={styles.dayBadge}>Day {day.day}</div>
                        <div>
                            <div className={styles.dayTheme}>{day.theme}</div>
                            {day.date && <div className={styles.dayDate}>{day.date}</div>}
                        </div>
                        <div className={styles.dayCost}>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Est. Cost</span>
                            <span style={{ fontWeight: "700", color: "var(--amd-red)" }}>
                                ₹{day.estimated_daily_cost.toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className={styles.timeline}>
                        {day.activities.map((act, i) => {
                            const color = SLOT_COLORS[act.time_slot] || "#9CA3AF";
                            return (
                                <div key={i} className={styles.timelineItem}>
                                    <div className={styles.timelineDot} style={{ borderColor: color, background: `${color}20` }}>
                                        <span>{SLOT_ICONS[act.time_slot] || "📍"}</span>
                                    </div>
                                    {i < day.activities.length - 1 && <div className={styles.timelineLine} />}
                                    <div className={styles.actCard}>
                                        <div className={styles.actHeader}>
                                            <span className={styles.slotLabel} style={{ color }}>
                                                {act.time_slot.charAt(0).toUpperCase() + act.time_slot.slice(1)}
                                            </span>
                                            <span className={styles.actDuration}>{act.duration}</span>
                                            {act.estimated_cost > 0 && (
                                                <span className={styles.actCost}>₹{act.estimated_cost.toLocaleString("en-IN")}</span>
                                            )}
                                        </div>
                                        <h3 className={styles.actName}>{act.attraction}</h3>
                                        <p className={styles.actDesc}>{act.description}</p>
                                        {act.distance_from_previous && (
                                            <div className={styles.actDist}>
                                                📍 {act.distance_from_previous}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Day footer */}
                    <div className={styles.dayFooter}>
                        <div className={styles.footerItem}>
                            <span>🍽️</span>
                            <span>{day.meals_suggestion}</span>
                        </div>
                        <div className={styles.footerItem}>
                            <span>🚕</span>
                            <span>{day.transport_tip}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
