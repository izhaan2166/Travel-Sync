import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

# Curated dataset of travel destinations with rich activity details
DESTINATIONS = [
    {
        "id": 1,
        "name": "Kyoto",
        "country": "Japan",
        "description": "A historic city famous for its classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden houses.",
        "tags": "culture history relaxation nature calm spiritual",
        "budget_tier": "midrange",
        "latitude": 35.0116,
        "longitude": 135.7681,
        "activities": [
            {"name": "Visit Fushimi Inari Shrine", "type": "culture", "cost": 0, "duration": 3, "time": "Morning"},
            {"name": "Stroll through Arashiyama Bamboo Grove", "type": "nature", "cost": 0, "duration": 2, "time": "Morning"},
            {"name": "Explore Kinkaku-ji (Golden Pavilion)", "type": "culture", "cost": 5, "duration": 1.5, "time": "Afternoon"},
            {"name": "Traditional Tea Ceremony in Gion", "type": "culture", "cost": 25, "duration": 2, "time": "Afternoon"},
            {"name": "Dine at Pontocho Alley", "type": "culinary", "cost": 40, "duration": 2.5, "time": "Evening"},
            {"name": "Kiyomizu-dera Temple Sunset Walk", "type": "culture", "cost": 4, "duration": 2, "time": "Evening"}
        ]
    },
    {
        "id": 2,
        "name": "Queenstown",
        "country": "New Zealand",
        "description": "The adventure capital of the world, offering bungee jumping, jet boating, skiing, and stunning alpine lakes and hiking trails.",
        "tags": "adventure nature active adrenaline scenic mountains sports",
        "budget_tier": "luxury",
        "latitude": -45.0312,
        "longitude": 168.6626,
        "activities": [
            {"name": "Nevis Bungy Jump", "type": "adventure", "cost": 180, "duration": 4, "time": "Morning"},
            {"name": "Shotover Jet Boat Ride", "type": "adventure", "cost": 90, "duration": 2, "time": "Morning"},
            {"name": "Milford Sound Day Cruise", "type": "nature", "cost": 120, "duration": 8, "time": "Afternoon"},
            {"name": "Skyline Gondola & Luge Rides", "type": "adventure", "cost": 45, "duration": 3, "time": "Afternoon"},
            {"name": "Dinner at Fergburger", "type": "culinary", "cost": 15, "duration": 1.5, "time": "Evening"},
            {"name": "Stargazing at Bob's Peak", "type": "nature", "cost": 30, "duration": 2, "time": "Evening"}
        ]
    },
    {
        "id": 3,
        "name": "Paris",
        "country": "France",
        "description": "A global center for art, fashion, gastronomy, and culture, defined by its 19th-century cityscape, museums, and romantic atmosphere.",
        "tags": "culture history culinary romance art fashion urban sightseeing",
        "budget_tier": "luxury",
        "latitude": 48.8566,
        "longitude": 2.3522,
        "activities": [
            {"name": "Eiffel Tower Summit Access", "type": "sightseeing", "cost": 30, "duration": 3, "time": "Morning"},
            {"name": "Louvre Museum Guided Tour", "type": "culture", "cost": 25, "duration": 4, "time": "Morning"},
            {"name": "Palace of Versailles Excursion", "type": "history", "cost": 20, "duration": 6, "time": "Afternoon"},
            {"name": "Pastry & Macaron Making Class", "type": "culinary", "cost": 65, "duration": 2.5, "time": "Afternoon"},
            {"name": "Seine River Dinner Cruise", "type": "romance", "cost": 85, "duration": 3, "time": "Evening"},
            {"name": "Montmartre & Moulin Rouge Night Walk", "type": "nightlife", "cost": 15, "duration": 2, "time": "Evening"}
        ]
    },
    {
        "id": 4,
        "name": "Bali",
        "country": "Indonesia",
        "description": "A tropical paradise famed for its forested volcanic mountains, iconic rice paddies, beaches, coral reefs, and yoga retreats.",
        "tags": "relaxation beach nature culture spiritual wellness tropical budget",
        "budget_tier": "budget",
        "latitude": -8.4095,
        "longitude": 115.1889,
        "activities": [
            {"name": "Sunrise Hike at Mount Batur", "type": "adventure", "cost": 35, "duration": 6, "time": "Morning"},
            {"name": "Surfing Lesson at Canggu Beach", "type": "adventure", "cost": 20, "duration": 2, "time": "Morning"},
            {"name": "Ubud Monkey Forest Sanctuary", "type": "nature", "cost": 6, "duration": 2, "time": "Afternoon"},
            {"name": "Balinese Traditional Massage & Spa", "type": "relaxation", "cost": 15, "duration": 2, "time": "Afternoon"},
            {"name": "Sunset Dinner at Jimbaran Bay", "type": "culinary", "cost": 30, "duration": 2.5, "time": "Evening"},
            {"name": "Kecak Dance Show at Uluwatu Temple", "type": "culture", "cost": 10, "duration": 2, "time": "Evening"}
        ]
    },
    {
        "id": 5,
        "name": "Reykjavik",
        "country": "Iceland",
        "description": "The gateway to Iceland's dramatic geothermal landscapes, northern lights, glaciers, waterfalls, and active volcanoes.",
        "tags": "nature adventure scenic cold thermal spas active exploring",
        "budget_tier": "luxury",
        "latitude": 64.1466,
        "longitude": -21.9426,
        "activities": [
            {"name": "Golden Circle Tour (Geysir & Gullfoss)", "type": "nature", "cost": 60, "duration": 7, "time": "Morning"},
            {"name": "South Coast Glacier Hike", "type": "adventure", "cost": 95, "duration": 5, "time": "Morning"},
            {"name": "Relax at the Blue Lagoon", "type": "relaxation", "cost": 80, "duration": 4, "time": "Afternoon"},
            {"name": "Whale Watching from Reykjavik Harbor", "type": "nature", "cost": 75, "duration": 3, "time": "Afternoon"},
            {"name": "Northern Lights Hunt Safari", "type": "nature", "cost": 45, "duration": 4, "time": "Evening"},
            {"name": "Local Craft Beer & Food Tour", "type": "culinary", "cost": 55, "duration": 2.5, "time": "Evening"}
        ]
    },
    {
        "id": 6,
        "name": "Tokyo",
        "country": "Japan",
        "description": "A bustling ultramodern metropolis combining neon skyscrapers, high-tech subways, historic temples, and incredible street food.",
        "tags": "urban technology nightlife culinary culture shopping fast-paced",
        "budget_tier": "midrange",
        "latitude": 35.6762,
        "longitude": 139.6503,
        "activities": [
            {"name": "Tsukiji Outer Market Food Tour", "type": "culinary", "cost": 15, "duration": 3, "time": "Morning"},
            {"name": "Sensō-ji Temple & Asakusa Exploration", "type": "culture", "cost": 0, "duration": 2, "time": "Morning"},
            {"name": "Shibuya Crossing & Hachiko Statue", "type": "urban", "cost": 0, "duration": 1.5, "time": "Afternoon"},
            {"name": "Akihabara Electric Town shopping", "type": "technology", "cost": 0, "duration": 3, "time": "Afternoon"},
            {"name": "Izakaya Hopping in Shinjuku Omoide Yokocho", "type": "nightlife", "cost": 35, "duration": 3, "time": "Evening"},
            {"name": "Robot Restaurant / Neon Entertainment District Tour", "type": "nightlife", "cost": 60, "duration": 2.5, "time": "Evening"}
        ]
    },
    {
        "id": 7,
        "name": "Rome",
        "country": "Italy",
        "description": "A colossal city packed with ancient ruins, Renaissance art, magnificent basilicas, and delicious authentic pasta.",
        "tags": "history culture architecture culinary religion sightseeing ruins",
        "budget_tier": "midrange",
        "latitude": 41.9028,
        "longitude": 12.4964,
        "activities": [
            {"name": "Skip-the-Line Colosseum & Forum Tour", "type": "history", "cost": 35, "duration": 3.5, "time": "Morning"},
            {"name": "Vatican Museums & Sistine Chapel Tour", "type": "culture", "cost": 40, "duration": 4, "time": "Morning"},
            {"name": "Walk from Trevi Fountain to Pantheon", "type": "sightseeing", "cost": 0, "duration": 2, "time": "Afternoon"},
            {"name": "Handmade Pasta & Gelato Masterclass", "type": "culinary", "cost": 50, "duration": 3, "time": "Afternoon"},
            {"name": "Sunset Walk in Trastevere", "type": "culture", "cost": 0, "duration": 2, "time": "Evening"},
            {"name": "Roman Wine Tasting & Appian Way Tour", "type": "culinary", "cost": 35, "duration": 2.5, "time": "Evening"}
        ]
    },
    {
        "id": 8,
        "name": "Cape Town",
        "country": "South Africa",
        "description": "A harbor city set against the dramatic backdrop of Table Mountain, known for its beaches, vineyards, and historical landmarks.",
        "tags": "nature scenic beaches adventure culinary wine mountains animals",
        "budget_tier": "budget",
        "latitude": -33.9249,
        "longitude": 18.4241,
        "activities": [
            {"name": "Cable Car to Table Mountain Summit", "type": "nature", "cost": 22, "duration": 2.5, "time": "Morning"},
            {"name": "Shark Cage Diving at Gansbaai", "type": "adventure", "cost": 150, "duration": 6, "time": "Morning"},
            {"name": "Boulders Beach Penguin Colony Visit", "type": "nature", "cost": 10, "duration": 2, "time": "Afternoon"},
            {"name": "Stellenbosch Vineyard Wine Tasting", "type": "culinary", "cost": 45, "duration": 5, "time": "Afternoon"},
            {"name": "V&A Waterfront Dinner & Live Music", "type": "nightlife", "cost": 30, "duration": 3, "time": "Evening"},
            {"name": "Sunset Drive along Chapman's Peak", "type": "scenic", "cost": 5, "duration": 2, "time": "Evening"}
        ]
    },
    {
        "id": 9,
        "name": "Cairo",
        "country": "Egypt",
        "description": "The capital of Egypt, defined by the majestic Nile River, ancient Pyramids, Islamic architecture, and bustling souks.",
        "tags": "history ancient architecture culture mystery rivers deserts",
        "budget_tier": "budget",
        "latitude": 30.0444,
        "longitude": 31.2357,
        "activities": [
            {"name": "Great Pyramids of Giza & Sphinx Tour", "type": "history", "cost": 20, "duration": 4.5, "time": "Morning"},
            {"name": "Grand Egyptian Museum Visit", "type": "history", "cost": 15, "duration": 3.5, "time": "Morning"},
            {"name": "Bazaar Shopping at Khan el-Khalili", "type": "culture", "cost": 0, "duration": 3, "time": "Afternoon"},
            {"name": "Coptic Cairo & Citadel Guided Walk", "type": "culture", "cost": 10, "duration": 3, "time": "Afternoon"},
            {"name": "Felucca Ride on the Nile at Sunset", "type": "relaxation", "cost": 15, "duration": 1.5, "time": "Evening"},
            {"name": "Nile River Dinner Cruise & Belly Dancing", "type": "nightlife", "cost": 40, "duration": 3, "time": "Evening"}
        ]
    },
    {
        "id": 10,
        "name": "Costa Rica (San Jose & Arenal)",
        "country": "Costa Rica",
        "description": "A rugged, rainforested Central American country with coastlines on the Caribbean and Pacific, famous for biodiversity.",
        "tags": "nature rain forests volcanoes wildlife ecotourism beaches active",
        "budget_tier": "midrange",
        "latitude": 9.9281,
        "longitude": -84.0907,
        "activities": [
            {"name": "Arenal Volcano National Park Hike", "type": "nature", "cost": 15, "duration": 4, "time": "Morning"},
            {"name": "Ziplining Canopy Tour in Monteverde", "type": "adventure", "cost": 55, "duration": 3, "time": "Morning"},
            {"name": "La Fortuna Waterfall Swim", "type": "nature", "cost": 18, "duration": 2.5, "time": "Afternoon"},
            {"name": "Hot Springs Relaxation Session", "type": "relaxation", "cost": 40, "duration": 4, "time": "Afternoon"},
            {"name": "Organic Coffee & Chocolate Farm Tour", "type": "culinary", "cost": 30, "duration": 2, "time": "Evening"},
            {"name": "Night Wildlife Spotting Safari", "type": "nature", "cost": 25, "duration": 2.5, "time": "Evening"}
        ]
    }
]

class TravelRecommender:
    def __init__(self):
        self.df = pd.DataFrame(DESTINATIONS)
        self.vectorizer = TfidfVectorizer(stop_words='english')
        
        # Build features content
        # Combining name, country, description, and tags for rich text representation
        self.df['combined_features'] = self.df.apply(
            lambda r: f"{r['name']} {r['country']} {r['description']} {r['tags']}", axis=1
        )
        self.tfidf_matrix = self.vectorizer.fit_transform(self.df['combined_features'])

    def recommend(self, query: str, selected_tags: list = None, budget_tier: str = None, top_n: int = 3):
        """
        Runs Content-Based Filtering using TF-IDF and Cosine Similarity.
        Supports filtering by budget and pre-weighted tag boosts.
        """
        # Step 1: Filter by budget tier if specified
        filtered_df = self.df.copy()
        if budget_tier and budget_tier.lower() != 'any':
            filtered_df = filtered_df[filtered_df['budget_tier'] == budget_tier.lower()]
        
        if filtered_df.empty:
            filtered_df = self.df.copy() # fallback if too restrictive
            
        # Step 2: Compute TF-IDF similarities
        # Combine user query text with selected tags to enrich user input query vector
        tags_text = " ".join(selected_tags) if selected_tags else ""
        full_query = f"{query} {tags_text}".strip()
        
        if not full_query:
            # If completely empty query, return top items in order
            indices = filtered_df.index[:top_n].tolist()
            similarities = [1.0] * len(indices)
        else:
            query_vec = self.vectorizer.transform([full_query])
            
            # Since tfidf_matrix is aligned with self.df, we map indices
            filtered_indices = filtered_df.index.tolist()
            filtered_matrix = self.tfidf_matrix[filtered_indices]
            
            sim_scores = cosine_similarity(query_vec, filtered_matrix).flatten()
            
            # Sort local indices by similarity score
            sorted_local_indices = np.argsort(sim_scores)[::-1]
            
            # Take top N
            top_local_indices = sorted_local_indices[:top_n]
            indices = [filtered_indices[i] for i in top_local_indices]
            similarities = [float(sim_scores[i]) for i in top_local_indices]

        # Step 3: Build recommendations payload
        results = []
        for idx, sim in zip(indices, similarities):
            item = self.df.loc[idx].to_dict()
            # Clean dataframe features not needed in JSON response
            item.pop('combined_features', None)
            item['match_score'] = round(sim * 100, 1)
            results.append(item)
            
        return results

    def generate_itinerary(self, destination_name: str, days: int = 3):
        """
        Generates a Day-by-Day schedule based on destination activities.
        Distributes activities across days, aligning with preferred times (Morning, Afternoon, Evening).
        """
        dest_matches = [d for d in DESTINATIONS if d['name'].lower() == destination_name.lower()]
        if not dest_matches:
            return {"error": "Destination not found"}
        
        destination = dest_matches[0]
        activities = destination['activities']
        
        # Sort activities into buckets
        mornings = [a for a in activities if a['time'] == 'Morning']
        afternoons = [a for a in activities if a['time'] == 'Afternoon']
        evenings = [a for a in activities if a['time'] == 'Evening']
        
        itinerary = []
        total_cost = 0
        
        for d in range(1, days + 1):
            day_plan = {
                "day": d,
                "schedule": []
            }
            
            # Helper to pull activity
            # Loop cyclicly through activities if length is short
            m_act = mornings[(d - 1) % len(mornings)] if mornings else None
            a_act = afternoons[(d - 1) % len(afternoons)] if afternoons else None
            e_act = evenings[(d - 1) % len(evenings)] if evenings else None
            
            if m_act:
                day_plan["schedule"].append({
                    "time": "09:00 AM",
                    "activity": m_act["name"],
                    "type": m_act["type"],
                    "duration": f"{m_act['duration']} hours",
                    "cost": m_act["cost"]
                })
                total_cost += m_act["cost"]
                
            if a_act:
                day_plan["schedule"].append({
                    "time": "02:00 PM",
                    "activity": a_act["name"],
                    "type": a_act["type"],
                    "duration": f"{a_act['duration']} hours",
                    "cost": a_act["cost"]
                })
                total_cost += a_act["cost"]
                
            if e_act:
                day_plan["schedule"].append({
                    "time": "07:00 PM",
                    "activity": e_act["name"],
                    "type": e_act["type"],
                    "duration": f"{e_act['duration']} hours",
                    "cost": e_act["cost"]
                })
                total_cost += e_act["cost"]
                
            itinerary.append(day_plan)
            
        return {
            "destination": destination["name"],
            "country": destination["country"],
            "coordinates": {"lat": destination["latitude"], "lon": destination["longitude"]},
            "days": days,
            "itinerary": itinerary,
            "estimated_cost_usd": total_cost
        }
