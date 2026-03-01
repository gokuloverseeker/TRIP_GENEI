"""
Rebalance API Router — TripGenie AI (AMD Edition)
POST /api/rebalance  →  Dynamic plan adjustment on budget/comfort/days change
"""
import logging
from fastapi import APIRouter, HTTPException
from models.schemas import RebalanceRequest, TripPlan, BudgetSplit
from engines.budget_optimizer import allocate_budget, calculate_carbon_footprint, get_comfort_label
from engines.hotel_engine import recommend_hotels
from engines.attraction_engine import get_attractions
from engines.itinerary_generator import generate_itinerary
from data.destinations import get_destination_data, get_distance

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/rebalance", response_model=TripPlan)
async def rebalance_trip(request: RebalanceRequest):
    try:
        orig = request.original_request
        
        # Apply overrides
        budget = request.new_budget if request.new_budget is not None else orig.budget
        comfort = request.new_comfort if request.new_comfort is not None else orig.comfort
        days = request.new_days if request.new_days is not None else orig.days

        dest = orig.destination
        src = orig.source
        people = orig.people
        preference = orig.preference.value

        # Validate minimal budget
        min_budget = people * days * 500
        if budget < min_budget:
            raise ValueError(f"Budget too low. Minimum ₹{min_budget} for {people} people over {days} days.")

        # Rerun all engines with new values
        dest_data = get_destination_data(dest)
        distance_km = get_distance(dest, src)

        budget_split_dict, travel_mode, travel_cost_pp = allocate_budget(
            budget, distance_km, people, days, comfort
        )

        hotel_budget = budget_split_dict.get("hotel", budget * 0.33)
        best_hotel, all_hotels = recommend_hotels(dest_data, hotel_budget, days, people, comfort)

        attractions = get_attractions(dest, preference, days)
        comfort_label = get_comfort_label(comfort)

        itinerary, tips, ai_backend = await generate_itinerary(
            src, dest, days, budget, people, comfort, preference,
            budget_split_dict, travel_mode, best_hotel.category,
            attractions, orig.start_date
        )

        carbon = calculate_carbon_footprint(distance_km, travel_mode, people)

        budget_split = BudgetSplit(
            travel=budget_split_dict.get("travel", 0),
            hotel=budget_split_dict.get("hotel", 0),
            food=budget_split_dict.get("food", 0),
            activities=budget_split_dict.get("activities", 0),
            local_transport=budget_split_dict.get("local_transport", 0),
            emergency_buffer=budget_split_dict.get("emergency", 0),
            total=budget_split_dict.get("total", budget)
        )

        return TripPlan(
            source=src,
            destination=dest_data.get("display_name", dest),
            days=days,
            people=people,
            total_budget=budget,
            budget_split=budget_split,
            travel_mode=travel_mode.title(),
            travel_cost_per_person=travel_cost_pp,
            hotel_recommendation=best_hotel,
            all_hotels=all_hotels,
            itinerary=itinerary,
            preference=preference,
            comfort_level=comfort_label.title(),
            ai_backend=f"{ai_backend} (rebalanced)",
            tips=tips,
            carbon_footprint_kg=carbon
        )

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Rebalance error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Rebalance failed: {str(e)}")
