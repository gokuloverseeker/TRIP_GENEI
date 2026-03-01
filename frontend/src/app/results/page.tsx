"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { TripPlan, TripRequest } from "@/lib/api";
import { rebalanceTripPlan } from "@/lib/api";
import OverviewTab from "@/components/OverviewTab";
import ItineraryTab from "@/components/ItineraryTab";
import CostBreakdownTab from "@/components/CostBreakdownTab";
import HotelsTab from "@/components/HotelsTab";
import ModifyPlanTab from "@/components/ModifyPlanTab";
import ThemeToggle from "@/components/ThemeToggle";
import styles from "./page.module.css";

const TABS = [
    { id: "overview", label: "📋 Overview" },
    { id: "itinerary", label: "🗓️ Itinerary" },
    { id: "costs", label: "💰 Costs" },
    { id: "hotels", label: "🏨 Hotels" },
    { id: "modify", label: "⚙️ Modify Plan" },
];

export default function ResultsPage() {
    const router = useRouter();
    const [plan, setPlan] = useState<TripPlan | null>(null);
    const [request, setRequest] = useState<TripRequest | null>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [rebalancing, setRebalancing] = useState(false);
    const [rebalanceError, setRebalanceError] = useState("");

    useEffect(() => {
        const p = sessionStorage.getItem("tripPlan");
        const r = sessionStorage.getItem("tripRequest");
        if (!p || !r) { router.push("/plan"); return; }
        setPlan(JSON.parse(p));
        setRequest(JSON.parse(r));
    }, [router]);

    const handleRebalance = useCallback(async (
        newBudget?: number,
        newComfort?: number,
        newDays?: number
    ) => {
        if (!request || !plan) return;
        setRebalancing(true);
        setRebalanceError("");
        try {
            const newPlan = await rebalanceTripPlan({
                original_request: request,
                new_budget: newBudget,
                new_comfort: newComfort,
                new_days: newDays,
            });
            setPlan(newPlan);
            // Update stored request
            const updated = {
                ...request,
                budget: newBudget ?? request.budget,
                comfort: newComfort ?? request.comfort,
                days: newDays ?? request.days,
            };
            setRequest(updated);
            sessionStorage.setItem("tripPlan", JSON.stringify(newPlan));
            sessionStorage.setItem("tripRequest", JSON.stringify(updated));
            setActiveTab("overview"); // jump back to overview
        } catch (e: unknown) {
            setRebalanceError(e instanceof Error ? e.message : "Rebalance failed");
        } finally {
            setRebalancing(false);
        }
    }, [request, plan]);

    if (!plan) {
        return (
            <div className={styles.loadingScreen}>
                <div className="spinner" />
                <p>Loading your trip plan…</p>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className="container flex items-center justify-between" style={{ padding: "1rem 1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
                    <div className="flex items-center gap-2">
                        <Link href="/" className={styles.logoSmall}>✈️ TripGenie <span className="gradient-text">AI</span></Link>
                        <span style={{ color: "var(--text-muted)" }}>›</span>
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                            {plan.source} → {plan.destination}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`badge ${plan.ai_backend.includes("ROCm") ? "badge-red" : plan.ai_backend.includes("OpenAI") ? "badge-blue" : "badge-green"}`}>
                            {plan.ai_backend.includes("ROCm") ? "🔴" : plan.ai_backend.includes("OpenAI") ? "🤖" : "⚙️"} {plan.ai_backend}
                        </span>
                        <ThemeToggle />
                        <Link href="/plan" className="btn-secondary" style={{ padding: "0.4rem 0.9rem", fontSize: "0.85rem" }}>
                            ← New Plan
                        </Link>
                    </div>
                </div>
            </header>

            {/* Trip Summary Strip */}
            <div className={styles.summaryStrip}>
                <div className="container">
                    <div className={styles.summaryRow}>
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Destination</span>
                            <span className={styles.summaryValue}>{plan.destination}</span>
                        </div>
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Duration</span>
                            <span className={styles.summaryValue}>{plan.days} Days</span>
                        </div>
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Travelers</span>
                            <span className={styles.summaryValue}>{plan.people} {plan.people === 1 ? "Person" : "People"}</span>
                        </div>
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Total Budget</span>
                            <span className={styles.summaryValue} style={{ color: "var(--amd-red)" }}>
                                ₹{plan.total_budget.toLocaleString("en-IN")}
                            </span>
                        </div>
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Travel Mode</span>
                            <span className={styles.summaryValue}>{plan.travel_mode}</span>
                        </div>
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>CO₂</span>
                            <span className={styles.summaryValue} style={{ color: "var(--green)" }}>{plan.carbon_footprint_kg} kg</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rebalancing overlay */}
            {rebalancing && (
                <div className={styles.rebalancingBar}>
                    <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    <span>AMD ROCm rebalancing your plan…</span>
                </div>
            )}
            {rebalanceError && (
                <div className={styles.errorBar}>⚠️ {rebalanceError}</div>
            )}

            {/* Tabs */}
            <div className="container" style={{ padding: "1.5rem 1.5rem 0" }}>
                <div className="tab-bar">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            id={`tab-${t.id}`}
                            className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
                            onClick={() => setActiveTab(t.id)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <main className="container" style={{ padding: "1.5rem", paddingBottom: "3rem" }}>
                {activeTab === "overview" && <OverviewTab plan={plan} />}
                {activeTab === "itinerary" && <ItineraryTab plan={plan} />}
                {activeTab === "costs" && <CostBreakdownTab plan={plan} />}
                {activeTab === "hotels" && <HotelsTab plan={plan} />}
                {activeTab === "modify" && (
                    <ModifyPlanTab
                        plan={plan}
                        request={request!}
                        onRebalance={handleRebalance}
                        rebalancing={rebalancing}
                    />
                )}
            </main>
        </div>
    );
}
