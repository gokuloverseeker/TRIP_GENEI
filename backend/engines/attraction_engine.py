"""
Attraction Recommendation Engine — TripGenie AI (AMD Edition)
"""
from data.destinations import get_destination_data


def get_attractions(destination: str, preference: str, days: int) -> list:
    """Return relevant attractions filtered and sorted by preference match."""
    dest_data = get_destination_data(destination)
    attractions = dest_data.get("attractions", [])

    pref = preference.lower()
    
    # Score each attraction by preference match
    scored = []
    for a in attractions:
        tags = a.get("tags", ["mixed"])
        score = 0
        if pref in tags:
            score += 3
        if "mixed" in tags:
            score += 1
        scored.append((score, a))

    scored.sort(key=lambda x: x[0], reverse=True)
    result = [a for _, a in scored]
    
    # Need at least days * 3 attractions (3 per day)
    needed = days * 3
    while len(result) < needed:
        result.extend(result)
    
    return result[:needed + 3]  # a few extras for variety
