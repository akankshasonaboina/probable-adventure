import os
import json
from typing import Dict, Any, Optional
from functools import lru_cache
import random

# Mock IBM Watson NLU Analysis
def analyze_nlu(text: str) -> Dict[str, Any]:
    """
    Mock implementation of IBM Watson NLU analysis.
    In production, this would connect to actual IBM Watson NLU service.
    """
    
    # Mock sentiment analysis
    sentiments = ["positive", "negative", "neutral"]
    sentiment_scores = {"positive": 0.8, "negative": 0.2, "neutral": 0.6}
    
    selected_sentiment = random.choice(sentiments)
    
    # Mock keyword extraction
    financial_keywords = ["money", "savings", "budget", "expenses", "income", "investment", "debt", "loan", "financial", "spending"]
    keywords = random.sample(financial_keywords, min(3, len(financial_keywords)))
    
    # Mock entity extraction
    entities = []
    if "month" in text.lower():
        entities.append({"text": "month", "type": "TIME"})
    if "year" in text.lower():
        entities.append({"text": "year", "type": "TIME"})
    if "$" in text or "dollar" in text.lower():
        entities.append({"text": "dollar", "type": "MONEY"})
    
    return {
        "sentiment": {
            "document": {
                "score": sentiment_scores[selected_sentiment],
                "label": selected_sentiment
            }
        },
        "keywords": [{"text": kw, "relevance": round(random.uniform(0.5, 1.0), 2)} for kw in keywords],
        "entities": entities[:3]  # Limit to 3 entities
    }

@lru_cache(maxsize=1)
def get_watsonx_model():
    """
    Mock implementation of Watsonx model initialization.
    In production, this would initialize the actual IBM Watsonx Granite model.
    """
    print("Mock: Initializing Watsonx Granite 3-2-8B Instruct model...")
    return "mock_granite_model"

def generate_with_watsonx(prompt: str) -> str:
    """
    Mock implementation of Watsonx text generation.
    In production, this would call the actual IBM Granite model.
    """
    
    # Mock responses based on prompt content
    if "budget summary" in prompt.lower():
        return """
        Based on your financial information, here's your personalized budget summary:

        **Financial Overview:**
        Your monthly income provides a solid foundation for your financial goals. After analyzing your spending patterns, I can see opportunities for optimization.

        **Key Insights:**
        - Your largest expense categories are housing and transportation
        - You have room to increase your savings rate
        - Consider automating your savings to reach your goals faster

        **Recommendations:**
        1. Set up automatic transfers to savings
        2. Review subscription services for potential cuts
        3. Consider the 50/30/20 budgeting rule
        4. Track expenses for better awareness

        **Next Steps:**
        Focus on building your emergency fund first, then work toward your other financial goals.
        """
    
    elif "spending insights" in prompt.lower():
        return """
        **Spending Analysis & Insights:**

        **1. Spending Breakdown:**
        • Fixed Expenses: 65% of income
        • Variable Expenses: 25% of income  
        • Savings: 10% of income

        **2. Category Analysis:**
        • Housing: 35% (within recommended range)
        • Transportation: 15% (consider carpooling options)
        • Food: 12% (meal planning could reduce this)
        • Entertainment: 8% (reasonable for lifestyle balance)

        **3. Optimization Opportunities:**
        • Reduce dining out by 20% to save $200/month
        • Negotiate insurance rates for potential savings
        • Consider switching to a high-yield savings account

        **4. Goal Progress:**
        At your current savings rate, you're on track to meet your emergency fund goal in 8 months.

        **5. Recommendations:**
        • Automate savings transfers
        • Use budgeting apps for tracking
        • Review and adjust monthly

        **6. Risk Factors:**
        Your current spending is sustainable, but building a larger emergency fund should be prioritized.
        """
    
    elif "financial question" in prompt.lower():
        return """
        Here's my advice for your financial question:

        **Understanding Your Situation:**
        Managing finances while dealing with student loans requires a strategic approach that balances debt repayment with building financial security.

        **Practical Steps:**
        1. **Create a minimal emergency fund** - Start with $500-1000 while paying loans
        2. **Use the debt avalanche method** - Pay minimums on all loans, extra on highest interest rate
        3. **Look for additional income** - Side hustles, freelancing, or part-time work
        4. **Reduce unnecessary expenses** - Review subscriptions, dining out, entertainment
        5. **Take advantage of tax benefits** - Student loan interest deduction

        **Saving Strategies:**
        • Automate small savings amounts ($25-50/month)
        • Use cash-back apps and rewards programs
        • Consider income-driven repayment plans if federal loans
        • Look into loan forgiveness programs if eligible

        **Long-term Approach:**
        Focus on building good financial habits now. Even small amounts saved consistently will compound over time.
        """
    
    else:
        return """
        Thank you for your question. As your personal finance assistant, I'm here to help you make informed financial decisions.

        **General Financial Guidance:**
        • Start with a budget to understand your money flow
        • Build an emergency fund of 3-6 months expenses
        • Pay off high-interest debt first
        • Invest for long-term goals
        • Review and adjust your plan regularly

        **Next Steps:**
        Feel free to ask specific questions about budgeting, saving, debt management, or investment planning. I can also help analyze your spending patterns if you provide your financial information.

        **Remember:**
        Personal finance is personal - what works for others may need adjustment for your unique situation.
        """

def generate_budget_summary(income: float, expenses: Dict[str, float], savings_goal: float, 
                          currency: str, user_type: str) -> Dict[str, Any]:
    """Generate a comprehensive budget summary using mock Watsonx model."""
    
    total_expenses = sum(expenses.values())
    disposable_income = income - total_expenses
    annual_income = income * 12
    annual_expenses = total_expenses * 12
    
    # Create persona-specific prompt
    prompt = f"""
    Create a financial summary for a {user_type} with:
    - Monthly Income: {currency}{income:,.2f}
    - Total Monthly Expenses: {currency}{total_expenses:,.2f}
    - Savings Goal: {currency}{savings_goal:,.2f}
    - Disposable Income: {currency}{disposable_income:,.2f}
    
    Expense Breakdown:
    {chr(10).join([f"- {cat}: {currency}{amt:,.2f} ({amt/total_expenses*100:.1f}%)" for cat, amt in expenses.items()])}
    
    Provide budget summary with insights and recommendations.
    """
    
    response_text = generate_with_watsonx(prompt)
    
    return {
        "prompt": prompt,
        "response": response_text,
        "financial_data": {
            "annual_income": annual_income,
            "annual_expenses": annual_expenses,
            "monthly_disposable": disposable_income,
            "savings_potential": max(0, disposable_income - savings_goal)
        }
    }

def generate_spending_insights(monthly_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate spending insights using mock Watsonx model."""
    
    income = monthly_data.get("income", 0)
    expenses = monthly_data.get("expenses", {})
    goals = monthly_data.get("goals", [])
    
    total_expenses = sum(expenses.values())
    surplus = income - total_expenses
    
    prompt = f"""
    Analyze spending behavior for:
    - Income: ${income:,.2f}
    - Total Expenses: ${total_expenses:,.2f}
    - Monthly Surplus: ${surplus:,.2f}
    - Goals: {', '.join([f"{g['name']} (${g['amount']}, {g['months']} months)" for g in goals])}
    
    Provide detailed spending insights and recommendations.
    """
    
    response_text = generate_with_watsonx(prompt)
    
    return {
        "prompt": prompt,
        "response": response_text,
        "analysis": {
            "total_expenses": total_expenses,
            "surplus": surplus,
            "savings_rate": (surplus / income * 100) if income > 0 else 0,
            "goals_achievable": all(surplus >= g["amount"] / g["months"] for g in goals)
        }
    }