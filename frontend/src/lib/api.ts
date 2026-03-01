const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface TripRequest {
  source: string;
  destination: string;
  days: number;
  budget: number;
  people: number;
  comfort: number;
  preference: "adventure" | "relaxation" | "cultural" | "spiritual" | "mixed";
  start_date?: string;
}

export interface RebalanceRequest {
  original_request: TripRequest;
  new_budget?: number;
  new_comfort?: number;
  new_days?: number;
}

export interface BudgetSplit {
  travel: number;
  hotel: number;
  food: number;
  activities: number;
  local_transport: number;
  emergency_buffer: number;
  total: number;
}

export interface HotelOption {
  name: string;
  category: string;
  price_per_night: number;
  total_cost: number;
  rating: number;
  distance_from_center: number;
  score: number;
  amenities: string[];
  address: string;
}

export interface DayActivity {
  time_slot: string;
  attraction: string;
  description: string;
  duration: string;
  distance_from_previous: string;
  estimated_cost: number;
}

export interface ItineraryDay {
  day: number;
  date?: string;
  theme: string;
  activities: DayActivity[];
  meals_suggestion: string;
  transport_tip: string;
  estimated_daily_cost: number;
}

export interface TripPlan {
  source: string;
  destination: string;
  days: number;
  people: number;
  total_budget: number;
  budget_split: BudgetSplit;
  travel_mode: string;
  travel_cost_per_person: number;
  hotel_recommendation: HotelOption;
  all_hotels: HotelOption[];
  itinerary: ItineraryDay[];
  preference: string;
  comfort_level: string;
  ai_backend: string;
  tips: string[];
  carbon_footprint_kg: number;
}

export async function generateTripPlan(req: TripRequest): Promise<TripPlan> {
  const res = await fetch(`${API_BASE}/api/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Server error ${res.status}`);
  }
  return res.json();
}

export async function rebalanceTripPlan(req: RebalanceRequest): Promise<TripPlan> {
  const res = await fetch(`${API_BASE}/api/rebalance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Server error ${res.status}`);
  }
  return res.json();
}
