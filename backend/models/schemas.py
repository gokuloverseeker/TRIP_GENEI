from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from enum import Enum


class TravelPreference(str, Enum):
    adventure = "adventure"
    relaxation = "relaxation"
    cultural = "cultural"
    spiritual = "spiritual"
    mixed = "mixed"


class TripRequest(BaseModel):
    source: str = Field(..., min_length=2, description="Origin city")
    destination: str = Field(..., min_length=2, description="Destination city")
    days: int = Field(..., ge=1, le=30, description="Trip duration in days")
    budget: float = Field(..., ge=1000, description="Total budget in INR")
    people: int = Field(..., ge=1, le=20, description="Number of travelers")
    comfort: float = Field(..., ge=0.0, le=1.0, description="Comfort level 0=budget 1=premium")
    preference: TravelPreference = TravelPreference.mixed
    start_date: Optional[str] = None

    @validator("budget")
    def budget_per_person_minimum(cls, v, values):
        people = values.get("people", 1)
        days = values.get("days", 1)
        min_budget = people * days * 500  # minimum 500 INR/person/day
        if v < min_budget:
            raise ValueError(f"Budget too low. Minimum ₹{min_budget} for {people} people over {days} days.")
        return v


class RebalanceRequest(BaseModel):
    original_request: TripRequest
    new_budget: Optional[float] = None
    new_comfort: Optional[float] = None
    new_days: Optional[int] = None


class BudgetSplit(BaseModel):
    travel: float
    hotel: float
    food: float
    activities: float
    local_transport: float
    emergency_buffer: float
    total: float


class HotelOption(BaseModel):
    name: str
    category: str
    price_per_night: float
    total_cost: float
    rating: float
    distance_from_center: float
    score: float
    amenities: List[str]
    address: str


class AttractionItem(BaseModel):
    name: str
    description: str
    duration_hours: float
    category: str
    entry_fee: float
    distance_from_hotel: float


class DayActivity(BaseModel):
    time_slot: str  # morning / afternoon / evening
    attraction: str
    description: str
    duration: str
    distance_from_previous: str
    estimated_cost: float


class ItineraryDay(BaseModel):
    day: int
    date: Optional[str]
    theme: str
    activities: List[DayActivity]
    meals_suggestion: str
    transport_tip: str
    estimated_daily_cost: float


class TripPlan(BaseModel):
    source: str
    destination: str
    days: int
    people: int
    total_budget: float
    budget_split: BudgetSplit
    travel_mode: str
    travel_cost_per_person: float
    hotel_recommendation: HotelOption
    all_hotels: List[HotelOption]
    itinerary: List[ItineraryDay]
    preference: str
    comfort_level: str
    ai_backend: str  # AMD ROCm / OpenAI / Rule-based
    tips: List[str]
    carbon_footprint_kg: float
