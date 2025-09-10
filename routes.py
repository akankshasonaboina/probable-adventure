from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import json

from app.ibm_api import analyze_nlu, generate_with_watsonx, generate_budget_summary, generate_spending_insights
from app.utils import build_prompt_with_nlu, build_simple_prompt

router = APIRouter()

# Request Models
class NLURequest(BaseModel):
    text: str

class GenerateRequest(BaseModel):
    question: str
    persona: Optional[str] = "general"

class BudgetSummaryRequest(BaseModel):
    income: float
    expenses: Dict[str, float]
    savings_goal: float
    currency: str = "$"
    user_type: str = "general"

class SpendingInsightsRequest(BaseModel):
    income: float
    expenses: Dict[str, float]
    goals: List[Dict[str, Any]]
    user_type: str = "general"

# Routes
@router.post("/nlu")
async def analyze_text(request: NLURequest):
    """Analyze text using IBM Watson NLU (mock implementation)."""
    try:
        result = analyze_nlu(request.text)
        return {
            "status": "success",
            "analysis": result,
            "text": request.text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"NLU analysis failed: {str(e)}")

@router.post("/generate")
async def generate_response(request: GenerateRequest):
    """Generate personalized financial advice using Watsonx (mock implementation)."""
    try:
        # Get NLU analysis
        nlu_result = analyze_nlu(request.question)
        
        # Build enriched prompt
        enriched_prompt = build_prompt_with_nlu(request.question, request.persona)
        
        # Generate response
        response_text = generate_with_watsonx(enriched_prompt)
        
        return {
            "status": "success",
            "response": response_text,
            "persona": request.persona,
            "nlu_analysis": nlu_result,
            "prompt": enriched_prompt
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Response generation failed: {str(e)}")

@router.post("/budget-summary")
async def create_budget_summary(request: BudgetSummaryRequest):
    """Generate comprehensive budget summary."""
    try:
        result = generate_budget_summary(
            income=request.income,
            expenses=request.expenses,
            savings_goal=request.savings_goal,
            currency=request.currency,
            user_type=request.user_type
        )
        
        return {
            "status": "success",
            "summary": result,
            "user_type": request.user_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Budget summary generation failed: {str(e)}")

@router.post("/spending-insights")
async def analyze_spending(request: SpendingInsightsRequest):
    """Generate detailed spending insights and recommendations."""
    try:
        monthly_data = {
            "income": request.income,
            "expenses": request.expenses,
            "goals": request.goals,
            "user_type": request.user_type
        }
        
        result = generate_spending_insights(monthly_data)
        
        return {
            "status": "success",
            "insights": result,
            "user_type": request.user_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Spending analysis failed: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Personal Finance Chatbot API",
        "version": "1.0.0"
    }