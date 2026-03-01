"""
Budget Optimization Engine — TripGenie AI (AMD Edition)
Core rule-based multi-constraint budget solver.
"""
from typing import Tuple


COMFORT_PROFILES = {
    "budget":    {"travel": 0.30, "hotel": 0.28, "food": 0.20, "activities": 0.10, "local_transport": 0.07, "emergency": 0.05},
    "mid":       {"travel": 0.25, "hotel": 0.33, "food": 0.20, "activities": 0.12, "local_transport": 0.05, "emergency": 0.05},
    "premium":   {"travel": 0.20, "hotel": 0.38, "food": 0.20, "activities": 0.14, "local_transport": 0.04, "emergency": 0.04},
}

# Mode factors: (speed_factor, price_per_km, co2_per_km_g)
TRAVEL_MODES = {
    "bus":    {"factor": 1.0, "price_per_km": 0.8,  "co2": 68,  "min_km": 0,   "max_km": 500},
    "train":  {"factor": 1.2, "price_per_km": 1.2,  "co2": 41,  "min_km": 100, "max_km": 2000},
    "flight": {"factor": 2.0, "price_per_km": 5.5,  "co2": 255, "min_km": 500, "max_km": 99999},
    "car":    {"factor": 1.1, "price_per_km": 2.5,  "co2": 120, "min_km": 0,   "max_km": 800},
}


def get_comfort_label(comfort: float) -> str:
    if comfort < 0.35:
        return "budget"
    elif comfort < 0.7:
        return "mid"
    else:
        return "premium"


def select_travel_mode(distance_km: int, budget_per_person: float, days: int) -> str:
    """Select best travel mode based on distance & budget."""
    # Very tight on time — prefer flight for long distances
    if distance_km > 800:
        if budget_per_person > 8000:
            return "flight"
        return "train" if distance_km <= 1500 else "flight"
    if distance_km > 300:
        if budget_per_person > 4000:
            return "train"
        return "bus"
    # Short distance
    if budget_per_person > 5000:
        return "car"
    return "bus"


def calculate_travel_cost(distance_km: int, mode: str, people: int) -> float:
    """Calculate total travel cost (round trip) for group."""
    mode_data = TRAVEL_MODES.get(mode, TRAVEL_MODES["train"])
    one_way = distance_km * mode_data["price_per_km"]
    round_trip_per_person = one_way * 2
    # Apply group discount for bus/train
    if mode in ("bus", "train") and people >= 4:
        round_trip_per_person *= 0.92
    return round_trip_per_person * people


def calculate_carbon_footprint(distance_km: int, mode: str, people: int) -> float:
    """Carbon footprint in kg CO₂."""
    co2_per_km = TRAVEL_MODES.get(mode, TRAVEL_MODES["train"])["co2"]
    return round((distance_km * 2 * co2_per_km * people) / 1000, 2)


def allocate_budget(
    total_budget: float,
    distance_km: int,
    people: int,
    days: int,
    comfort: float
) -> Tuple[dict, str, float]:
    """
    Returns (budget_split_dict, travel_mode, travel_cost_per_person)
    Performs dynamic rebalancing if travel cost eats up too much budget.
    """
    comfort_label = get_comfort_label(comfort)
    profile = COMFORT_PROFILES[comfort_label].copy()
    budget_per_person = total_budget / people

    # Step 1: Select travel mode
    mode = select_travel_mode(distance_km, budget_per_person, days)

    # Step 2: Calculate travel cost
    travel_cost_total = calculate_travel_cost(distance_km, mode, people)
    travel_cost_pp = travel_cost_total / people

    # Step 3: Check if travel cost fits within the travel allocation
    allocated_travel = total_budget * profile["travel"]
    if travel_cost_total > allocated_travel * 1.3:
        # Downgrade: try cheaper mode
        if mode == "flight":
            mode = "train"
            travel_cost_total = calculate_travel_cost(distance_km, "train", people)
        elif mode == "train":
            mode = "bus"
            travel_cost_total = calculate_travel_cost(distance_km, "bus", people)
        travel_cost_pp = travel_cost_total / people

    remaining_budget = total_budget - travel_cost_total

    # Re-distribute remaining budget proportionally (excluding travel)
    other_keys = ["hotel", "food", "activities", "local_transport", "emergency"]
    other_total = sum(profile[k] for k in other_keys)

    split = {k: round((profile[k] / other_total) * remaining_budget, 2) for k in other_keys}
    split["travel"] = round(travel_cost_total, 2)
    split["total"] = round(sum(split.values()), 2)

    return split, mode, round(travel_cost_pp, 2)
