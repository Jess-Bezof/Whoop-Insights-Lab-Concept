from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LifestyleInput(BaseModel):
    sleep_duration: float
    alcohol_intake: float
    caffeine_amount: float
    caffeine_timing: float
    late_meal_timing: float
    stress_level: str

class CalculationRequest(BaseModel):
    sleep_duration: float
    stress_level: str
    late_meal_timing: float
    meal_calories: float = 0.0
    caffeine_amount: float = 0.0
    caffeine_timing: float = 0.0
    alcohol_volume_ml: float = 0.0
    alcohol_abv: float = 0.0
    alcohol_hours_since_last_drink: float = 0.0

@app.get("/")
def read_root():
    return {"message": "WHOOP Simulator API is running"}

@app.post("/calculate")
def calculate_recovery(data: CalculationRequest):
    stress_lower = data.stress_level.lower()
    
    # --- Initialize variables to prevent UnboundLocalError ---
    active_calories = 0.0
    standard_drinks = 0.0
    active_units = 0.0
    cleared_units = 0.0
    sleep_performance = 0.0
    quantity_score = 0.0
    quality_multiplier = 1.0
    caffeine_multiplier = 1.0
    alcohol_multiplier = 1.0
    
    # --- 1. Sleep Performance (S) - Multiplicative Logic ---
    # Zero Rule: If hours_of_sleep is 0, then S = 0 immediately.
    if data.sleep_duration == 0:
        sleep_performance = 0.0
        quantity_score = 0.0
        quality_multiplier = 0.0
    else:
        # Quantity Score: Base = (hours_of_sleep / 8)
        # Cap sleep duration at 8 hours for calculation
        effective_sleep = min(data.sleep_duration, 8.0)
        quantity_score = effective_sleep / 8.0
        
        # Quality Multiplier: Start at 1.0
        quality_multiplier = 1.0
        
        # Meal Penalty (Quality):
        # Metabolic Clearance: 200 cal/hr
        # Active Load = max(0, meal_calories - (hours * 200))
        # Subtract 2% from Multiplier for every 100 Active Calories
        if data.meal_calories > 0:
            calories_processed = data.late_meal_timing * 200.0
            active_calories = max(0.0, data.meal_calories - calories_processed)
            
            # 2% per 100 active calories = 0.02 * (active / 100) = active * 0.0002
            meal_penalty_sleep = active_calories * 0.0002
            quality_multiplier -= meal_penalty_sleep
            
        # Stress Penalty: Subtract 0.15 for 'High' stress, and 0.05 for 'Medium' stress
        if stress_lower == "high":
            quality_multiplier -= 0.15
        elif stress_lower == "medium":
            quality_multiplier -= 0.05
            
        # Caffeine Penalty: 
        # Residue = intake_mg * (0.5 ** (hours_before_sleep / 6))
        # Subtract 0.01 from multiplier for every 10mg of residue
        caffeine_multiplier = 1.0
        if data.caffeine_amount > 0:
            residue = data.caffeine_amount * (0.5 ** (data.caffeine_timing / 6.0))
            penalty = (residue / 10.0) * 0.01
            caffeine_multiplier = 1.0 - penalty
            
        caffeine_multiplier = max(0.0, caffeine_multiplier)
        
        # Alcohol Penalty (Sleep): Subtract 5% per ACTIVE standard drink
        # Standard Drink = (volume_ml * (abv / 100) * 0.789) / 14
        
        if data.alcohol_volume_ml > 0 and data.alcohol_abv > 0:
            standard_drinks = (data.alcohol_volume_ml * (data.alcohol_abv / 100.0) * 0.789) / 14.0
            
            # Metabolism Math: Cleared = hours * 1.0
            cleared_units = data.alcohol_hours_since_last_drink * 1.0
            active_units = max(0.0, standard_drinks - cleared_units)
            
            # Subtract 0.05 per ACTIVE standard drink (REM suppression)
            alcohol_penalty_sleep = active_units * 0.05
            alcohol_multiplier = 1.0 - alcohol_penalty_sleep
            
        alcohol_multiplier = max(0.0, alcohol_multiplier)
            
        quality_multiplier = max(0.0, quality_multiplier)
        
        # Final S: (Quantity Score * Quality Multiplier * Caffeine Multiplier * Alcohol Multiplier) * 100
        sleep_performance = quantity_score * quality_multiplier * caffeine_multiplier * alcohol_multiplier * 100
        sleep_performance = max(0, min(100, sleep_performance))
    
    # --- 2. Recovery (R) - Weighted Systemic Logic ---
    # Autonomic Nervous System (ANS) Score: Start at 100
    ans_score = 100
    
    # Subtract 30 points for 'High' stress and 10 points for 'Medium' stress (Direct HRV hit)
    if stress_lower == "high":
        ans_score -= 30
    elif stress_lower == "medium":
        ans_score -= 10
        
    # Subtract 1% from ANS Score for every 50 Active Calories remaining at bedtime
    # 1 point per 50 cal = active / 50
    if active_calories > 0:
        ans_meal_penalty = active_calories / 50.0
        ans_score -= ans_meal_penalty
        
    ans_score = max(0, min(100, ans_score))
    
    # Calculation: R = (0.4 * S) + (0.6 * ANS_Score)
    recovery_score = (0.4 * sleep_performance) + (0.6 * ans_score)
    
    # Alcohol Physiological Penalty (Recovery)
    # P_active = 8 * (active_units ** 1.1)
    # P_residual = (total_units - active_units) * 2
    alcohol_penalty_recovery = 0.0
    
    # Re-calculate active units if not done in sleep block (in case sleep was 0)
    if data.sleep_duration == 0:
        if data.alcohol_volume_ml > 0 and data.alcohol_abv > 0:
            standard_drinks = (data.alcohol_volume_ml * (data.alcohol_abv / 100.0) * 0.789) / 14.0
            cleared_units = data.alcohol_hours_since_last_drink * 1.0
            active_units = max(0.0, standard_drinks - cleared_units)
    
    if standard_drinks > 0:
        p_active = 8.0 * (active_units ** 1.1)
        p_residual = (standard_drinks - active_units) * 2.0
        alcohol_penalty_recovery = p_active + p_residual
        
    recovery_score -= alcohol_penalty_recovery
    
    # The Biological Floor: Final R must be clamped between 10 and 99
    recovery_score = max(10, min(99, recovery_score))
    
    # --- 3. Persistent 2x2 Insight Grid ---
    insight_grid = {}
    
    # Caffeine residue calculation (needed for notifications)
    caffeine_residue = 0.0
    if data.caffeine_amount > 0:
        caffeine_residue = data.caffeine_amount * (0.5 ** (data.caffeine_timing / 6.0))
        
    # 1. Neuro-Toxicity (Alcohol)
    if active_units > 4.0:
        insight_grid["neuro_toxicity"] = {
            "status": "red",
            "message": "High toxicity detected; significant systemic stress and CNS depression."
        }
    elif active_units > 0:
        insight_grid["neuro_toxicity"] = {
            "status": "yellow",
            "message": "Moderate ethanol load; expect suppressed HRV and elevated RHR."
        }
    else:
        insight_grid["neuro_toxicity"] = {
            "status": "green",
            "message": "No active alcohol detected; ANS is primed for peak recovery."
        }

    # 2. Metabolic State (Food)
    if active_calories > 400:
        insight_grid["metabolic_state"] = {
            "status": "red",
            "message": "High metabolic strain; energy diverted from recovery to digestion."
        }
    elif active_calories > 100:
        insight_grid["metabolic_state"] = {
            "status": "yellow",
            "message": "Moderate digestive load; heart rate may stay slightly elevated."
        }
    else:
        insight_grid["metabolic_state"] = {
            "status": "green",
            "message": "Metabolic load is low; repair prioritized over digestion."
        }

    # 3. CNS Stimulants (Caffeine)
    if caffeine_residue > 100:
        insight_grid["cns_stimulants"] = {
            "status": "red",
            "message": "High residue; significant blockage of sleep-inducing adenosine."
        }
    elif caffeine_residue > 20:
        insight_grid["cns_stimulants"] = {
            "status": "yellow",
            "message": "Moderate caffeine residue; may lead to light or restless sleep."
        }
    else:
        insight_grid["cns_stimulants"] = {
            "status": "green",
            "message": "Caffeine cleared; brain can fully access deep REM cycles."
        }

    # 4. Autonomic Load (Stress)
    if stress_lower == "high":
        insight_grid["autonomic_load"] = {
            "status": "red",
            "message": "High stress; body is locked in a sympathetic 'Fight or Flight' state."
        }
    elif stress_lower == "medium":
        insight_grid["autonomic_load"] = {
            "status": "yellow",
            "message": "Moderate mental load; nervous system is mildly overextended."
        }
    else:
        insight_grid["autonomic_load"] = {
            "status": "green",
            "message": "Optimal stress; maintaining healthy parasympathetic balance."
        }
    
    return {
        "sleep_performance": round(sleep_performance, 1),
        "recovery_score": round(recovery_score, 1),
        "details": {
            "quantity_score": round(quantity_score, 2),
            "quality_multiplier": round(quality_multiplier, 2),
            "nervous_system_score": round(ans_score, 1),
            "standard_drinks": round(standard_drinks, 1),
            "active_units": round(active_units, 1),
            "cleared_units": round(cleared_units, 1),
            "alcohol_penalty_recovery": round(alcohol_penalty_recovery, 1),
            "active_calories": round(active_calories, 1),
            "caffeine_residue": round(caffeine_residue, 1)
        },
        "insight_grid": insight_grid
    }

@app.post("/simulate")
def simulate_recovery(data: LifestyleInput):
    # Just acknowledging the data for now
    return {
        "status": "received",
        "data": data,
        "message": "Data received successfully"
    }
