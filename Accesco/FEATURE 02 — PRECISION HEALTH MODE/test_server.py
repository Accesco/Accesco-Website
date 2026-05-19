#Delete it after testing
# This is a temporary lightweight server for testing nutrition_engine.py only.
# It bypasses main.py to avoid Firebase and other dependencies.
# Once Firebase credentials are set up and all modules are installed,
# switch back to: uvicorn main:app --reload --port 8000
# and delete this file.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
from nutrition_engine import calculate_household_nutrition

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class HouseholdMember(BaseModel):
    age:                int       = 25
    gender:             str       = "male"
    weightRange:        str       = "60-70"
    activityLevel:      str       = "moderate"
    dietaryPreferences: List[str] = []

class AnalyzeRequest(BaseModel):
    household: List[HouseholdMember]

@app.post("/v1/health/analyze")
def analyze(request: AnalyzeRequest):
    return calculate_household_nutrition([m.model_dump() for m in request.household])