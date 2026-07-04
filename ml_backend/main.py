from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from model import TravelRecommender

app = FastAPI(title="TravelSync ML Recommendation Service")

# Enable CORS for local Vite development frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in local/dev mode
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML recommender
recommender = TravelRecommender()

class RecommendationRequest(BaseModel):
    query: str
    tags: Optional[List[str]] = []
    budget_tier: Optional[str] = "any"
    top_n: Optional[int] = 3

@app.get("/")
def read_root():
    return {"message": "TravelSync Machine Learning Recommendation API is running."}

@app.post("/recommend")
def get_recommendations(request: RecommendationRequest):
    try:
        recommendations = recommender.recommend(
            query=request.query,
            selected_tags=request.tags,
            budget_tier=request.budget_tier,
            top_n=request.top_n
        )
        return {"success": True, "results": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")

@app.get("/itinerary")
def get_itinerary(destination: str, days: int = 3):
    try:
        itinerary = recommender.generate_itinerary(
            destination_name=destination,
            days=days
        )
        if "error" in itinerary:
            raise HTTPException(status_code=404, detail=itinerary["error"])
        return {"success": True, "itinerary": itinerary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Itinerary generation failed: {str(e)}")
