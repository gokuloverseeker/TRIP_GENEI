"""
Itinerary Generator — TripGenie AI (AMD Edition)
Orchestrates AI + rule-based fallback to produce structured day-wise plans.
"""
import random
from typing import List, Optional
from datetime import datetime, timedelta

from models.schemas import ItineraryDay, DayActivity
from engines.amd_ai_client import generate_itinerary_ai


TIME_SLOTS = ["morning", "afternoon", "evening"]

ACTIVITY_DISTRIBUTION = {
    "adventure":   ["adventure", "adventure", "mixed"],
    "relaxation":  ["relaxation", "relaxation", "cultural"],
    "cultural":    ["cultural", "cultural", "mixed"],
    "spiritual":   ["spiritual", "cultural", "relaxation"],
    "mixed":       ["cultural", "adventure", "relaxation"],
}

DAY_THEMES = [
    "Arrival & First Impressions",
    "Adventure & Exploration",
    "Culture & Heritage Deep Dive",
    "Nature & Local Experiences",
    "Spiritual & Culinary Journey",
    "Leisurely Discovery",
    "Hidden Gems & Departure Prep",
]


def filter_attractions_by_preference(attractions: list, preference: str) -> list:
    pref_tags = ACTIVITY_DISTRIBUTION.get(preference, ["mixed"])
    scored = []
    for a in attractions:
        tags = a.get("tags", ["mixed"])
        score = sum(1 for t in pref_tags if t in tags)
        scored.append((score, a))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [a for _, a in scored]


def build_rule_based_itinerary(
    attractions: list,
    days: int,
    start_date: Optional[str],
    daily_activity_budget: float,
    people: int,
    preference: str
) -> List[ItineraryDay]:
    """Fallback rule-based itinerary generator."""
    sorted_attractions = filter_attractions_by_preference(attractions, preference)
    # Rotate through attractions for each day
    itinerary = []
    used = []
    all_attractions = sorted_attractions * 3  # repeat if needed

    for day_num in range(1, days + 1):
        date_str = None
        if start_date:
            try:
                d = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=day_num - 1)
                date_str = d.strftime("%b %d, %Y")
            except Exception:
                pass

        theme = DAY_THEMES[(day_num - 1) % len(DAY_THEMES)]
        activities = []
        day_cost = 0

        # Pick 3 attractions for morning/afternoon/evening
        day_picks = []
        for a in all_attractions:
            if a["name"] not in used and len(day_picks) < 3:
                day_picks.append(a)
                used.append(a["name"])
        # Padding if not enough
        while len(day_picks) < 3:
            day_picks.append(random.choice(sorted_attractions))

        for i, slot in enumerate(TIME_SLOTS):
            attr = day_picks[i]
            cost = attr["entry_fee"] * people
            day_cost += cost
            dist = "Starting point" if i == 0 else f"{random.randint(2, int(max(attr['distance_from_hotel'], 3)))} km from previous"
            activities.append(DayActivity(
                time_slot=slot,
                attraction=attr["name"],
                description=attr["description"],
                duration=f"{attr['duration_hours']:.0f}–{attr['duration_hours'] + 1:.0f} hours",
                distance_from_previous=dist,
                estimated_cost=cost
            ))

        food_cost = daily_activity_budget * 0.35 * people
        day_cost += food_cost

        itinerary.append(ItineraryDay(
            day=day_num,
            date=date_str,
            theme=theme,
            activities=activities,
            meals_suggestion="Breakfast at hotel, lunch at local eatery, dinner at recommended restaurant",
            transport_tip="Use local auto-rickshaw or cab aggregator app for ₹50–150 per ride",
            estimated_daily_cost=round(day_cost, 2)
        ))

    return itinerary


def parse_ai_itinerary(
    ai_data: dict,
    days: int,
    start_date: Optional[str]
) -> List[ItineraryDay]:
    """Convert AI JSON response to ItineraryDay objects."""
    itinerary = []
    raw_days = ai_data.get("itinerary", [])

    for i, rd in enumerate(raw_days[:days], 1):
        date_str = None
        if start_date:
            try:
                d = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=i - 1)
                date_str = d.strftime("%b %d, %Y")
            except Exception:
                pass

        activities = []
        for act in rd.get("activities", []):
            activities.append(DayActivity(
                time_slot=act.get("time_slot", "morning"),
                attraction=act.get("attraction", "Local Exploration"),
                description=act.get("description", "Explore the local area."),
                duration=act.get("duration", "2-3 hours"),
                distance_from_previous=act.get("distance_from_previous", "Nearby"),
                estimated_cost=float(act.get("estimated_cost", 0))
            ))

        itinerary.append(ItineraryDay(
            day=i,
            date=date_str,
            theme=rd.get("theme", f"Day {i} Exploration"),
            activities=activities,
            meals_suggestion=rd.get("meals_suggestion", "Local cuisine recommended"),
            transport_tip=rd.get("transport_tip", "Use local transport"),
            estimated_daily_cost=float(rd.get("estimated_daily_cost", 0))
        ))

    return itinerary


async def generate_itinerary(
    source: str,
    destination: str,
    days: int,
    budget: float,
    people: int,
    comfort: float,
    preference: str,
    budget_split: dict,
    travel_mode: str,
    hotel_range: str,
    attractions: list,
    start_date: Optional[str] = None,
) -> tuple:
    """Main orchestrator. Returns (itinerary_list, tips, backend_name)."""
    daily_activity_budget = budget_split.get("activities", budget * 0.12) / max(days, 1)

    # Try AI generation
    ai_data, backend = await generate_itinerary_ai(
        source, destination, days, budget, people, comfort, preference,
        budget_split, travel_mode, hotel_range, attractions
    )

    tips = [
        f"Carry cash for local vendors in {destination} — not all accept UPI.",
        "Book travel tickets at least 7 days in advance for better rates.",
        "Travel during off-peak hours to avoid crowds at popular sites.",
        f"Emergency helpline: 112 | Tourist helpline: 1800-111-363",
        "Keep a digital and physical copy of your IDs and tickets.",
    ]

    if ai_data and "itinerary" in ai_data:
        if "tips" in ai_data:
            tips = ai_data["tips"]
        return parse_ai_itinerary(ai_data, days, start_date), tips, backend
    else:
        # Rule-based fallback
        itinerary = build_rule_based_itinerary(
            attractions, days, start_date, daily_activity_budget, people, preference
        )
        return itinerary, tips, "Rule-Based Engine"
