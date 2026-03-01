"""
Static destination knowledge base for TripGenie AI.
Contains attractions, hotels and travel data for major Indian destinations.
In Phase 2 this would be replaced by live API calls (Google Places, MakeMyTrip, etc.)
"""

DESTINATION_DATA = {
    "goa": {
        "display_name": "Goa",
        "distance_from": {
            "mumbai": 590, "pune": 450, "bangalore": 560, "hyderabad": 680,
            "delhi": 1900, "chennai": 850, "kolkata": 2100, "ahmedabad": 1000,
            "default": 800
        },
        "attractions": [
            {
                "name": "Calangute Beach",
                "description": "Queen of beaches — wide sandy stretch with water sports & beach shacks.",
                "duration_hours": 3, "category": "relaxation", "entry_fee": 0,
                "distance_from_hotel": 2.0, "tags": ["relaxation", "adventure", "mixed"]
            },
            {
                "name": "Basilica of Bom Jesus",
                "description": "UNESCO World Heritage site, 16th-century baroque church housing St. Francis Xavier's remains.",
                "duration_hours": 2, "category": "cultural", "entry_fee": 0,
                "distance_from_hotel": 8.0, "tags": ["cultural", "spiritual", "mixed"]
            },
            {
                "name": "Dudhsagar Waterfalls",
                "description": "Four-tiered 310m waterfall on the Goa-Karnataka border — a breathtaking natural wonder.",
                "duration_hours": 6, "category": "adventure", "entry_fee": 400,
                "distance_from_hotel": 60.0, "tags": ["adventure", "mixed"]
            },
            {
                "name": "Anjuna Flea Market",
                "description": "Iconic Wednesday market — handicrafts, clothes, spices, and bohemian vibes.",
                "duration_hours": 3, "category": "cultural", "entry_fee": 0,
                "distance_from_hotel": 12.0, "tags": ["cultural", "mixed"]
            },
            {
                "name": "Fort Aguada",
                "description": "17th-century Portuguese fort with a lighthouse offering panoramic coastal views.",
                "duration_hours": 2, "category": "cultural", "entry_fee": 30,
                "distance_from_hotel": 9.0, "tags": ["cultural", "adventure", "mixed"]
            },
            {
                "name": "Palolem Beach",
                "description": "Crescent-shaped serene beach in South Goa — perfect for swimming and kayaking.",
                "duration_hours": 4, "category": "relaxation", "entry_fee": 0,
                "distance_from_hotel": 40.0, "tags": ["relaxation", "mixed"]
            },
            {
                "name": "Spice Plantation Tour",
                "description": "Walk through aromatic spice farms with guided tour and traditional Goan lunch.",
                "duration_hours": 4, "category": "cultural", "entry_fee": 600,
                "distance_from_hotel": 25.0, "tags": ["cultural", "mixed"]
            },
            {
                "name": "Old Goa Churches Walk",
                "description": "Historic walk through Se Cathedral, Church of St. Francis of Assisi and more.",
                "duration_hours": 3, "category": "spiritual", "entry_fee": 0,
                "distance_from_hotel": 9.0, "tags": ["spiritual", "cultural"]
            },
            {
                "name": "Vagator Beach Sunset",
                "description": "Rocky red cliffs meeting the sea — famous for dramatic sunsets and trance parties.",
                "duration_hours": 2, "category": "relaxation", "entry_fee": 0,
                "distance_from_hotel": 15.0, "tags": ["relaxation", "adventure", "mixed"]
            },
            {
                "name": "Water Sports at Baga",
                "description": "Parasailing, jet-skiing, banana boat rides and more at Baga Beach.",
                "duration_hours": 3, "category": "adventure", "entry_fee": 1500,
                "distance_from_hotel": 4.0, "tags": ["adventure", "mixed"]
            }
        ],
        "hotels": [
            {
                "name": "Sea Shell Budget Inn",
                "category": "Budget",
                "base_price": 800, "rating": 3.8,
                "distance_from_center": 1.5,
                "amenities": ["WiFi", "AC", "Beach Access"],
                "address": "Near Calangute Beach, North Goa"
            },
            {
                "name": "The Coconut Grove Hostel",
                "category": "Budget",
                "base_price": 600, "rating": 4.0,
                "distance_from_center": 2.0,
                "amenities": ["WiFi", "Common Area", "Lockers"],
                "address": "Anjuna, North Goa"
            },
            {
                "name": "Cidade de Goa",
                "category": "Mid-Range",
                "base_price": 3500, "rating": 4.3,
                "distance_from_center": 3.0,
                "amenities": ["Pool", "Spa", "Restaurant", "WiFi", "AC"],
                "address": "Vainguinim Beach, Panaji"
            },
            {
                "name": "Novotel Goa Resort",
                "category": "Mid-Range",
                "base_price": 5000, "rating": 4.4,
                "distance_from_center": 4.0,
                "amenities": ["Pool", "Gym", "3 Restaurants", "WiFi", "Bar"],
                "address": "Candolim Beach, North Goa"
            },
            {
                "name": "Leela Goa",
                "category": "Premium",
                "base_price": 12000, "rating": 4.8,
                "distance_from_center": 6.0,
                "amenities": ["Private Beach", "Spa", "5 Restaurants", "Golf", "Butler"],
                "address": "Mobor, Cavelossim, South Goa"
            },
            {
                "name": "Taj Exotica Goa",
                "category": "Premium",
                "base_price": 15000, "rating": 4.9,
                "distance_from_center": 5.0,
                "amenities": ["Private Pool Villas", "Spa", "Fine Dining", "Beach Butler"],
                "address": "Benaulim, South Goa"
            }
        ]
    },
    "manali": {
        "display_name": "Manali",
        "distance_from": {
            "delhi": 560, "chandigarh": 310, "amritsar": 470,
            "jaipur": 760, "mumbai": 2180, "default": 800
        },
        "attractions": [
            {
                "name": "Solang Valley",
                "description": "Snow adventure hub — skiing, zorbing, cable car rides with Himalayan backdrop.",
                "duration_hours": 5, "category": "adventure", "entry_fee": 200,
                "distance_from_hotel": 14.0, "tags": ["adventure", "mixed"]
            },
            {
                "name": "Rohtang Pass",
                "description": "High mountain pass at 3,978m — stunning glaciers, snow fields and panoramic views.",
                "duration_hours": 7, "category": "adventure", "entry_fee": 550,
                "distance_from_hotel": 51.0, "tags": ["adventure", "mixed"]
            },
            {
                "name": "Hadimba Temple",
                "description": "Ancient wooden temple in cedar forest, dedicated to Hadimba Devi — serene and sacred.",
                "duration_hours": 1.5, "category": "spiritual", "entry_fee": 0,
                "distance_from_hotel": 2.5, "tags": ["spiritual", "cultural"]
            },
            {
                "name": "Old Manali Village Walk",
                "description": "Cobblestone lanes, apple orchards, cafes and Manu temple — the hippie paradise.",
                "duration_hours": 3, "category": "cultural", "entry_fee": 0,
                "distance_from_hotel": 3.0, "tags": ["cultural", "relaxation", "mixed"]
            },
            {
                "name": "Beas River Rafting",
                "description": "White-water rafting on the Beas river — Grade I-III rapids.",
                "duration_hours": 3, "category": "adventure", "entry_fee": 600,
                "distance_from_hotel": 8.0, "tags": ["adventure", "mixed"]
            },
            {
                "name": "Manali Wildlife Sanctuary",
                "description": "Home to snow leopards, Himalayan black bears and migratory birds.",
                "duration_hours": 4, "category": "adventure", "entry_fee": 50,
                "distance_from_hotel": 5.0, "tags": ["adventure", "relaxation"]
            },
            {
                "name": "Sissu Lake",
                "description": "Pristine high-altitude lake en route to Spiti — crystal clear water.",
                "duration_hours": 3, "category": "relaxation", "entry_fee": 0,
                "distance_from_hotel": 60.0, "tags": ["relaxation", "adventure"]
            }
        ],
        "hotels": [
            {
                "name": "Snow Valley Hostel",
                "category": "Budget",
                "base_price": 700, "rating": 3.9,
                "distance_from_center": 0.8,
                "amenities": ["WiFi", "Common Room", "Hot Water"],
                "address": "Old Manali Road, Manali"
            },
            {
                "name": "Apple Country Resort",
                "category": "Mid-Range",
                "base_price": 3000, "rating": 4.2,
                "distance_from_center": 2.5,
                "amenities": ["Mountain View", "Restaurant", "WiFi", "Bonfire"],
                "address": "Naggar Road, Manali"
            },
            {
                "name": "Span Resort",
                "category": "Mid-Range",
                "base_price": 5500, "rating": 4.5,
                "distance_from_center": 8.0,
                "amenities": ["Riverside", "Spa", "Restaurant", "Trout Fishing"],
                "address": "Kullu-Manali Highway"
            },
            {
                "name": "The Himalayan",
                "category": "Premium",
                "base_price": 11000, "rating": 4.7,
                "distance_from_center": 4.0,
                "amenities": ["Mountain Views", "Spa", "Fine Dining", "Trekking"],
                "address": "Prini, Manali"
            }
        ]
    },
    "jaipur": {
        "display_name": "Jaipur",
        "distance_from": {
            "delhi": 280, "agra": 240, "mumbai": 1150, "jodhpur": 335,
            "udaipur": 395, "ahmedabad": 650, "default": 500
        },
        "attractions": [
            {
                "name": "Amber Fort",
                "description": "Magnificent fort-palace complex with hilltop views, intricate mirror work and elephant rides.",
                "duration_hours": 3, "category": "cultural", "entry_fee": 200,
                "distance_from_hotel": 11.0, "tags": ["cultural", "adventure", "mixed"]
            },
            {
                "name": "Hawa Mahal",
                "description": "Iconic 'Palace of Winds' — 953 small windows for royal ladies to observe street life.",
                "duration_hours": 1.5, "category": "cultural", "entry_fee": 50,
                "distance_from_hotel": 2.0, "tags": ["cultural", "mixed"]
            },
            {
                "name": "City Palace",
                "description": "Royal residence-turned-museum with stunning Rajput-Mughal architecture and royal artifacts.",
                "duration_hours": 2.5, "category": "cultural", "entry_fee": 700,
                "distance_from_hotel": 3.0, "tags": ["cultural", "mixed"]
            },
            {
                "name": "Jantar Mantar",
                "description": "UNESCO World Heritage astronomical observatory with 19 architectural instruments.",
                "duration_hours": 1.5, "category": "cultural", "entry_fee": 200,
                "distance_from_hotel": 3.5, "tags": ["cultural", "mixed"]
            },
            {
                "name": "Nahargarh Fort Sunset",
                "description": "Hilltop fort — stunning views of Jaipur's pink city at golden hour.",
                "duration_hours": 2, "category": "adventure", "entry_fee": 50,
                "distance_from_hotel": 7.0, "tags": ["adventure", "cultural", "mixed"]
            },
            {
                "name": "Johari Bazaar Shopping",
                "description": "Famous bazaar for Kundan jewelry, tie-dye textiles, blue pottery and lac bangles.",
                "duration_hours": 3, "category": "cultural", "entry_fee": 0,
                "distance_from_hotel": 2.5, "tags": ["cultural", "mixed"]
            },
            {
                "name": "Birla Mandir",
                "description": "Modern white marble temple dedicated to Lakshmi Narayan — serene and luminous at night.",
                "duration_hours": 1, "category": "spiritual", "entry_fee": 0,
                "distance_from_hotel": 5.0, "tags": ["spiritual", "mixed"]
            }
        ],
        "hotels": [
            {
                "name": "Zostel Jaipur",
                "category": "Budget",
                "base_price": 600, "rating": 4.1,
                "distance_from_center": 1.5,
                "amenities": ["WiFi", "Common Kitchen", "Rooftop"],
                "address": "Bani Park, Jaipur"
            },
            {
                "name": "Pearl Palace Heritage",
                "category": "Budget",
                "base_price": 1200, "rating": 4.4,
                "distance_from_center": 2.0,
                "amenities": ["Rooftop Restaurant", "WiFi", "Heritage Decor"],
                "address": "Hathroi Fort, Jaipur"
            },
            {
                "name": "Samode Haveli",
                "category": "Mid-Range",
                "base_price": 6000, "rating": 4.6,
                "distance_from_center": 3.5,
                "amenities": ["Courtyard Pool", "Heritage Architecture", "Restaurant"],
                "address": "Gangapole, Jaipur"
            },
            {
                "name": "Rambagh Palace",
                "category": "Premium",
                "base_price": 25000, "rating": 4.9,
                "distance_from_center": 4.0,
                "amenities": ["Royal Suite", "Polo Club", "Spa", "Fine Dining"],
                "address": "Bhawani Singh Road, Jaipur"
            }
        ]
    },
    "kerala": {
        "display_name": "Kerala (Munnar & Alleppey)",
        "distance_from": {
            "bangalore": 460, "chennai": 650, "mumbai": 1380, "cochin": 130,
            "default": 700
        },
        "attractions": [
            {
                "name": "Alleppey Houseboat Cruise",
                "description": "Iconic overnight houseboat on Kerala's backwaters — a floating paradise.",
                "duration_hours": 18, "category": "relaxation", "entry_fee": 8000,
                "distance_from_hotel": 2.0, "tags": ["relaxation", "cultural", "mixed"]
            },
            {
                "name": "Munnar Tea Gardens",
                "description": "Rolling hills carpeted with emerald tea estates — sunrise walks and tasting sessions.",
                "duration_hours": 4, "category": "relaxation", "entry_fee": 100,
                "distance_from_hotel": 5.0, "tags": ["relaxation", "mixed"]
            },
            {
                "name": "Periyar Tiger Reserve",
                "description": "Boat safaris on Periyar Lake spotting elephants, deer and exotic birds.",
                "duration_hours": 5, "category": "adventure", "entry_fee": 300,
                "distance_from_hotel": 100.0, "tags": ["adventure", "mixed"]
            },
            {
                "name": "Kathakali Performance",
                "description": "Classical Kerala dance-drama with elaborate costumes and facial expressions.",
                "duration_hours": 2, "category": "cultural", "entry_fee": 300,
                "distance_from_hotel": 3.0, "tags": ["cultural", "mixed"]
            },
            {
                "name": "Varkala Cliff Beach",
                "description": "Dramatic sea cliffs, ayurvedic massage parlors and pristine black-sand beach.",
                "duration_hours": 4, "category": "relaxation", "entry_fee": 0,
                "distance_from_hotel": 50.0, "tags": ["relaxation", "adventure"]
            }
        ],
        "hotels": [
            {
                "name": "Zostel Alleppey",
                "category": "Budget",
                "base_price": 700, "rating": 4.0,
                "distance_from_center": 1.0,
                "amenities": ["Backwater View", "WiFi", "Canoe Rides"],
                "address": "Near Alleppey Boat Jetty"
            },
            {
                "name": "Fragrant Nature Munnar",
                "category": "Mid-Range",
                "base_price": 4000, "rating": 4.4,
                "distance_from_center": 3.0,
                "amenities": ["Tea Estate View", "Restaurant", "Bonfire", "WiFi"],
                "address": "Chinnakanal, Munnar"
            },
            {
                "name": "Kumarakom Lake Resort",
                "category": "Premium",
                "base_price": 18000, "rating": 4.8,
                "distance_from_center": 4.0,
                "amenities": ["Infinity Pool", "Ayurvedic Spa", "Private Butlers", "Heritage Cottages"],
                "address": "Kumarakom, Kerala"
            }
        ]
    }
}

# Default destination for unknown cities
DEFAULT_DESTINATION = {
    "display_name": "India",
    "distance_from": {"default": 500},
    "attractions": [
        {
            "name": "City Heritage Walk",
            "description": "Explore the heart of the city's historic quarter with a local guide.",
            "duration_hours": 3, "category": "cultural", "entry_fee": 100,
            "distance_from_hotel": 2.0, "tags": ["cultural", "mixed"]
        },
        {
            "name": "Local Market Exploration",
            "description": "Dive into bustling local bazaars — street food, handicrafts & authentic vibes.",
            "duration_hours": 2.5, "category": "cultural", "entry_fee": 0,
            "distance_from_hotel": 1.5, "tags": ["cultural", "mixed", "relaxation"]
        },
        {
            "name": "Museum & Art Gallery",
            "description": "Discover the region's art, culture, and history at the city museum.",
            "duration_hours": 2, "category": "cultural", "entry_fee": 100,
            "distance_from_hotel": 3.0, "tags": ["cultural", "mixed"]
        },
        {
            "name": "Sunrise Viewpoint Trek",
            "description": "Early morning trek to the city's best viewpoint — golden hour reward.",
            "duration_hours": 4, "category": "adventure", "entry_fee": 50,
            "distance_from_hotel": 8.0, "tags": ["adventure", "mixed"]
        },
        {
            "name": "Local Cuisine Food Tour",
            "description": "Guided tasting tour of the city's best street food and local restaurants.",
            "duration_hours": 3, "category": "relaxation", "entry_fee": 500,
            "distance_from_hotel": 2.0, "tags": ["relaxation", "cultural", "mixed"]
        },
        {
            "name": "Sacred Temple Complex",
            "description": "Visit the city's most significant spiritual site — architecture and peace.",
            "duration_hours": 2, "category": "spiritual", "entry_fee": 0,
            "distance_from_hotel": 4.0, "tags": ["spiritual", "cultural"]
        },
        {
            "name": "Nature Reserve & Wildlife",
            "description": "Half-day exploration of the nearby nature reserve with local flora and fauna.",
            "duration_hours": 5, "category": "adventure", "entry_fee": 200,
            "distance_from_hotel": 15.0, "tags": ["adventure", "relaxation"]
        }
    ],
    "hotels": [
        {
            "name": "Budget Stay Inn",
            "category": "Budget",
            "base_price": 800, "rating": 3.7,
            "distance_from_center": 2.0,
            "amenities": ["WiFi", "Hot Water", "AC"],
            "address": "City Center Area"
        },
        {
            "name": "Comfort Stays Hotel",
            "category": "Mid-Range",
            "base_price": 3000, "rating": 4.1,
            "distance_from_center": 3.0,
            "amenities": ["WiFi", "Restaurant", "Pool"],
            "address": "Main Market Road"
        },
        {
            "name": "Grand Palace Hotel",
            "category": "Premium",
            "base_price": 10000, "rating": 4.6,
            "distance_from_center": 5.0,
            "amenities": ["Spa", "Fine Dining", "Pool", "Gym", "Concierge"],
            "address": "Premium District"
        }
    ]
}

def get_destination_data(destination: str) -> dict:
    key = destination.lower().strip()
    # fuzzy match
    for k, v in DESTINATION_DATA.items():
        if k in key or key in k:
            return v
    return {**DEFAULT_DESTINATION, "display_name": destination.title()}

def get_distance(destination: str, source: str) -> int:
    data = get_destination_data(destination)
    dist_map = data.get("distance_from", {})
    src_key = source.lower().strip()
    for k, v in dist_map.items():
        if k in src_key or src_key in k:
            return v
    return dist_map.get("default", 600)
