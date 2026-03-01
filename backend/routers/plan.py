"""
Plan API Router — TripGenie AI (AMD Edition)
POST /api/plan  →  Full trip generation
"""
import logging
from fastapi import APIRouter, HTTPException
from models.schemas import TripRequest, TripPlan, BudgetSplit
from engines.budget_optimizer import allocate_budget, calculate_carbon_footprint, get_comfort_label
from engines.hotel_engine import recommend_hotels
from engines.attraction_engine import get_attractions
from engines.itinerary_generator import generate_itinerary
from data.destinations import get_destination_data, get_distance

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/plan", response_model=TripPlan)
async def generate_trip_plan(request: TripRequest):
    try:
        dest = request.destination
        src = request.source
        days = request.days
        budget = request.budget
        people = request.people
        comfort = request.comfort
        preference = request.preference.value

        # 1. Get destination data
        dest_data = get_destination_data(dest)
        distance_km = get_distance(dest, src)

        # 2. Budget allocation
        budget_split_dict, travel_mode, travel_cost_pp = allocate_budget(
            budget, distance_km, people, days, comfort
        )

        # 3. Hotel recommendation
        hotel_budget = budget_split_dict.get("hotel", budget * 0.33)
        best_hotel, all_hotels = recommend_hotels(dest_data, hotel_budget, days, people, comfort)

        # 4. Attractions
        attractions = get_attractions(dest, preference, days)

        # 5. Itinerary (AI or rule-based)
        comfort_label = get_comfort_label(comfort)
        hotel_category_label = best_hotel.category
        itinerary, tips, ai_backend = await generate_itinerary(
            src, dest, days, budget, people, comfort, preference,
            budget_split_dict, travel_mode, hotel_category_label,
            attractions, request.start_date
        )

        # 6. Carbon footprint
        carbon = calculate_carbon_footprint(distance_km, travel_mode, people)

        # 7. Build response
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
            ai_backend=ai_backend,
            tips=tips,
            carbon_footprint_kg=carbon
        )

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Trip generation error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Trip generation failed: {str(e)}")
