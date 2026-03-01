"""
AMD AI Client — TripGenie AI
3-tier fallback: AMD ROCm (Ollama) → OpenAI → Rule-based engine
"""
import os
import json
import httpx
import logging
from typing import Tuple

logger = logging.getLogger(__name__)

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")


SYSTEM_PROMPT = """You are TripGenie AI, an intelligent travel optimization engine powered by AMD ROCm technology.
You generate budget-optimized, day-wise travel plans.
You must consider total budget constraints, group size, duration, and preference weighting.
Ensure travel sequences are geographically logical and minimize backtracking.
Keep recommendations practical, location-realistic and culturally accurate for India.
Always respond with valid JSON only — no markdown, no explanation."""

def build_user_prompt(
    source: str, destination: str, days: int, budget: float,
    people: int, comfort: float, preference: str,
    budget_split: dict, travel_mode: str, hotel_range: str,
    attractions: list[dict]
) -> str:
    comfort_label = "Budget" if comfort < 0.35 else ("Mid-Range" if comfort < 0.7 else "Premium")
    attraction_names = [a["name"] for a in attractions[:12]]

    return f"""Plan a {days}-day trip for {people} {"person" if people == 1 else "people"} from {source} to {destination}.

User Inputs:
- Source: {source}
- Destination: {destination}  
- Duration: {days} days
- Total Budget: ₹{budget:,.0f}
- People: {people}
- Comfort Level: {comfort_label} ({comfort:.1f}/1.0)
- Travel Preference: {preference}
- Travel Mode: {travel_mode}
- Recommended Hotel Category: {hotel_range}

Pre-calculated Budget Split:
- Travel: ₹{budget_split.get('travel', 0):,.0f}
- Hotel: ₹{budget_split.get('hotel', 0):,.0f}
- Food: ₹{budget_split.get('food', 0):,.0f}
- Activities: ₹{budget_split.get('activities', 0):,.0f}
- Local Transport: ₹{budget_split.get('local_transport', 0):,.0f}
- Emergency Buffer: ₹{budget_split.get('emergency', 0):,.0f}

Available Attractions: {', '.join(attraction_names)}

Generate a day-wise itinerary. Return ONLY valid JSON in this exact format:
{{
  "itinerary": [
    {{
      "day": 1,
      "theme": "Arrival & Exploration",
      "activities": [
        {{"time_slot": "morning", "attraction": "attraction name", "description": "2 sentence description", "duration": "2-3 hours", "distance_from_previous": "Starting point", "estimated_cost": 0}},
        {{"time_slot": "afternoon", "attraction": "attraction name", "description": "2 sentence description", "duration": "2-3 hours", "distance_from_previous": "2 km from morning spot", "estimated_cost": 200}},
        {{"time_slot": "evening", "attraction": "attraction name", "description": "2 sentence description", "duration": "1-2 hours", "distance_from_previous": "3 km", "estimated_cost": 0}}
      ],
      "meals_suggestion": "Breakfast at hotel, lunch at local dhaba, dinner at beach shack",
      "transport_tip": "Use local auto-rickshaw for ₹50–100 per ride",
      "estimated_daily_cost": 1500
    }}
  ],
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}}"""


async def call_ollama(prompt: str) -> Tuple[str, str]:
    """Call AMD ROCm-accelerated Ollama local LLM."""
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{OLLAMA_HOST}/api/generate",
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": f"{SYSTEM_PROMPT}\n\n{prompt}",
                    "stream": False,
                    "options": {"temperature": 0.7, "top_p": 0.9}
                }
            )
            response.raise_for_status()
            data = response.json()
            return data["response"], "AMD ROCm (Ollama)"
    except Exception as e:
        logger.warning(f"Ollama unavailable: {e}")
        raise


async def call_openai(prompt: str) -> Tuple[str, str]:
    """Fallback to OpenAI API."""
    if not OPENAI_API_KEY:
        raise ValueError("No OpenAI API key")
    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
                json={
                    "model": OPENAI_MODEL,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "response_format": {"type": "json_object"}
                }
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"], "OpenAI GPT"
    except Exception as e:
        logger.warning(f"OpenAI unavailable: {e}")
        raise


def parse_ai_response(text: str) -> dict:
    """Extract JSON from LLM response."""
    text = text.strip()
    # Strip markdown code blocks if present
    if text.startswith("```"):
        lines = text.split("\n")
        text = "\n".join(lines[1:-1])
    # Find JSON object
    start = text.find("{")
    end = text.rfind("}") + 1
    if start != -1 and end > start:
        return json.loads(text[start:end])
    raise ValueError("No valid JSON found in response")


async def generate_itinerary_ai(
    source: str, destination: str, days: int, budget: float,
    people: int, comfort: float, preference: str,
    budget_split: dict, travel_mode: str, hotel_range: str,
    attractions: list
) -> Tuple[dict, str]:
    """
    Try AMD ROCm → OpenAI → Rule-based fallback.
    Returns (parsed_json_dict, backend_name)
    """
    comfort_label = "Budget" if comfort < 0.35 else ("Mid-Range" if comfort < 0.7 else "Premium")
    prompt = build_user_prompt(
        source, destination, days, budget, people, comfort, preference,
        budget_split, travel_mode, hotel_range, attractions
    )

    # Tier 1: AMD ROCm via Ollama
    try:
        raw, backend = await call_ollama(prompt)
        data = parse_ai_response(raw)
        logger.info(f"AI response from {backend}")
        return data, backend
    except Exception as e:
        logger.warning(f"AMD ROCm failed: {e}, trying OpenAI...")

    # Tier 2: OpenAI
    try:
        raw, backend = await call_openai(prompt)
        data = parse_ai_response(raw)
        logger.info(f"AI response from {backend}")
        return data, backend
    except Exception as e:
        logger.warning(f"OpenAI failed: {e}, using rule-based fallback...")

    # Tier 3: Rule-based fallback (always works)
    return None, "Rule-Based Engine"
