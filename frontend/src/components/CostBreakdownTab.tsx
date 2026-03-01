"use client";
import type { TripPlan } from "@/lib/api";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import styles from "./CostBreakdownTab.module.css";

const COLORS = ["#ED1C24", "#4F8EF7", "#00C48C", "#F59E0B", "#8B5CF6", "#6B7280"];
const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function CostBreakdownTab({ plan }: { plan: TripPlan }) {
    const bs = plan.budget_split;
    const total = bs.total || plan.total_budget;

    const segments = [
        { name: "Travel", value: bs.travel, pct: bs.travel / total * 100 },
        { name: "Hotel", value: bs.hotel, pct: bs.hotel / total * 100 },
        { name: "Food", value: bs.food, pct: bs.food / total * 100 },
        { name: "Activities", value: bs.activities, pct: bs.activities / total * 100 },
        { name: "Local Transport", value: bs.local_transport, pct: bs.local_transport / total * 100 },
        { name: "Emergency", value: bs.emergency_buffer, pct: bs.emergency_buffer / total * 100 },
    ];

    return (
        <div className={styles.wrap}>
            <h2 style={{ marginBottom: "1.5rem" }}>💰 Cost Breakdown</h2>

            <div className={styles.layout}>
                {/* Pie Chart */}
                <div className="card" style={{ minHeight: 380 }}>
                    <h3 style={{ marginBottom: "1rem" }}>Budget Distribution</h3>
                    <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                            <Pie
                                data={segments}
                                cx="50%"
                                cy="50%"
                                innerRadius={75}
                                outerRadius={130}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {segments.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: "var(--surface-2)", border: "1px solid var(--border-medium)", borderRadius: 10, color: "var(--text-primary)" }}
                                formatter={(v: number) => [fmt(v), ""]}
                            />
                            <Legend
                                formatter={(value) => <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center label */}
                    <div className={styles.pieCenter}>
                        <div className={styles.pieTotalLabel}>Total</div>
                        <div className={styles.pieTotalValue}>{fmt(total)}</div>
                    </div>
                </div>

                {/* Breakdown Table */}
                <div className={styles.rightCol}>
                    <div className="card">
                        <h3 style={{ marginBottom: "1.25rem" }}>Category Breakdown</h3>
                        {segments.map((s, i) => (
                            <div key={s.name} className={styles.row}>
                                <div className={styles.dot} style={{ background: COLORS[i] }} />
                                <div className={styles.rowInfo}>
                                    <span className={styles.rowName}>{s.name}</span>
                                    <div className={styles.rowBar}>
                                        <div className={styles.rowBarFill} style={{ width: `${s.pct}%`, background: COLORS[i] }} />
                                    </div>
                                </div>
                                <div className={styles.rowNumbers}>
                                    <span className={styles.rowValue} style={{ color: COLORS[i] }}>{fmt(s.value)}</span>
                                    <span className={styles.rowPct}>{s.pct.toFixed(1)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Per-person breakdown */}
                    <div className="card" style={{ marginTop: "1rem" }}>
                        <h3 style={{ marginBottom: "1rem" }}>Per Person Cost</h3>
                        {segments.map((s, i) => (
                            <div key={s.name} className={styles.row}>
                                <div className={styles.dot} style={{ background: COLORS[i] }} />
                                <span className={styles.rowName}>{s.name}</span>
                                <span className={styles.rowValue} style={{ color: COLORS[i], marginLeft: "auto" }}>
                                    {fmt(Math.round(s.value / plan.people))}
                                </span>
                            </div>
                        ))}
                        <div className="divider" />
                        <div className={styles.row} style={{ fontWeight: "700" }}>
                            <span>Total per person</span>
                            <span style={{ marginLeft: "auto", color: "var(--amd-red)" }}>{fmt(Math.round(total / plan.people))}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
