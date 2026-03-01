"""
Hotel Recommendation Engine — TripGenie AI (AMD Edition)
Scoring formula: Score = (PriceFit × 0.4) + (Rating × 0.3) + (DistanceScore × 0.3)
"""
from typing import List
from models.schemas import HotelOption
from engines.budget_optimizer import get_comfort_label


def score_hotel(hotel: dict, hotel_budget_per_night: float, max_distance: float = 20.0) -> float:
    """
    Returns a normalized score 0–10.
    Price fit: how close to budget (penalise over-budget heavily)
    Rating: normalized 0–10
    Distance: closer = better
    """
    # Price fit (0–10)
    price = hotel["base_price"]
    if price <= hotel_budget_per_night:
        price_fit = min(10, 10 * (hotel_budget_per_night - price) / max(hotel_budget_per_night, 1) + 7)
    else:
        overage = (price - hotel_budget_per_night) / max(hotel_budget_per_night, 1)
        price_fit = max(0, 7 - overage * 15)

    # Rating (0–10)
    rating_score = (hotel["rating"] / 5.0) * 10

    # Distance score (0–10, closer = higher)
    dist = hotel.get("distance_from_center", 5.0)
    dist_score = max(0, 10 - (dist / max_distance) * 10)

    score = (price_fit * 0.4) + (rating_score * 0.3) + (dist_score * 0.3)
    return round(score, 2)


def get_hotel_budget_per_night(hotel_allocation: float, days: int) -> float:
    return hotel_allocation / max(days, 1)


def recommend_hotels(
    destination_data: dict,
    hotel_budget_total: float,
    days: int,
    people: int,
    comfort: float
) -> tuple:
    """
    Returns (best_hotel: HotelOption, all_hotels: List[HotelOption])
    """
    budget_per_night = get_hotel_budget_per_night(hotel_budget_total, days)
    comfort_label = get_comfort_label(comfort)

    scored = []
    for h in destination_data.get("hotels", []):
        score = score_hotel(h, budget_per_night)
        total_cost = h["base_price"] * days
        scored.append({
            **h,
            "score": score,
            "total_cost": total_cost,
            "price_per_night": h["base_price"]
        })

    # Sort by score descending
    scored.sort(key=lambda x: x["score"], reverse=True)

    # Filter: prefer comfort-matched category
    COMFORT_MAP = {"budget": ["Budget"], "mid": ["Mid-Range", "Budget"], "premium": ["Premium", "Mid-Range"]}
    preferred_cats = COMFORT_MAP.get(comfort_label, ["Mid-Range"])

    # Pick best matching hotel; fallback to top scored
    best = None
    for h in scored:
        if h["category"] in preferred_cats:
            best = h
            break
    if not best:
        best = scored[0]

    def to_model(h: dict) -> HotelOption:
        return HotelOption(
            name=h["name"],
            category=h["category"],
            price_per_night=h["price_per_night"],
            total_cost=h["total_cost"],
            rating=h["rating"],
            distance_from_center=h["distance_from_center"],
            score=h["score"],
            amenities=h.get("amenities", []),
            address=h.get("address", "")
        )

    return to_model(best), [to_model(h) for h in scored]
