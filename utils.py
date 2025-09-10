from typing import Dict, Any, List
from app.ibm_api import analyze_nlu

def build_simple_prompt(user_input: str, persona: str = "general") -> str:
    """Build a simple prompt without NLU enrichment."""
    
    persona_context = {
        "student": "You are a helpful financial advisor speaking to a college student. Use simple language and focus on practical, low-cost solutions.",
        "professional": "You are a financial advisor for working professionals. Provide strategic advice and consider more complex financial instruments.",
        "general": "You are a helpful personal finance assistant. Provide clear, actionable advice."
    }
    
    context = persona_context.get(persona.lower(), persona_context["general"])
    
    return f"""
{context}

User Question: {user_input}

Please respond clearly and concisely with actionable financial advice. Keep your response focused on personal finance topics only.
"""

def build_prompt_with_nlu(user_text: str, persona: str = "general") -> str:
    """Build an enriched prompt using NLU analysis."""
    
    # Get NLU insights
    nlu_analysis = analyze_nlu(user_text)
    
    sentiment = nlu_analysis.get("sentiment", {}).get("document", {})
    keywords = [kw["text"] for kw in nlu_analysis.get("keywords", [])]
    entities = [ent["text"] for ent in nlu_analysis.get("entities", [])]
    
    # Build context-aware prompt
    sentiment_context = ""
    if sentiment.get("label") == "negative":
        sentiment_context = "The user seems concerned or stressed about their financial situation. Provide reassuring and supportive advice."
    elif sentiment.get("label") == "positive":
        sentiment_context = "The user appears optimistic about their financial situation. Provide encouraging guidance to maintain their momentum."
    else:
        sentiment_context = "Provide balanced and objective financial advice."
    
    keyword_context = f"Key topics mentioned: {', '.join(keywords)}" if keywords else "General financial inquiry"
    entity_context = f"Important details: {', '.join(entities)}" if entities else ""
    
    persona_instruction = {
        "student": "Tailor your advice for a college student with limited income and simple financial needs.",
        "professional": "Provide advice suitable for a working professional with more complex financial goals.",
        "general": "Provide advice suitable for the general population."
    }.get(persona.lower(), "Provide helpful financial advice.")
    
    return f"""
You are a personal finance assistant. {sentiment_context}

{persona_instruction}

Context: {keyword_context}
{entity_context}

User Question: {user_text}

Provide clear, actionable financial advice. Focus only on personal finance topics and avoid medical, legal, or therapeutic advice.
"""

def build_student_prompt(income: float, expenses: Dict[str, float], savings_goal: float, 
                        currency: str = "$") -> str:
    """Build budget summary prompt for student persona."""
    
    total_expenses = sum(expenses.values())
    disposable_income = income - total_expenses
    annual_income = income * 12
    
    # Calculate percentages
    expense_percentages = {cat: (amt / total_expenses * 100) for cat, amt in expenses.items()}
    top_expenses = sorted(expenses.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return f"""
Create a student-friendly budget summary:

FINANCIAL SNAPSHOT:
- Monthly Income: {currency}{income:,.2f}
- Annual Income: {currency}{annual_income:,.2f}
- Total Monthly Expenses: {currency}{total_expenses:,.2f}
- After Expenses: {currency}{disposable_income:,.2f}
- Savings Goal: {currency}{savings_goal:,.2f}
- Surplus After Savings: {currency}{disposable_income - savings_goal:,.2f}

TOP SPENDING CATEGORIES:
{chr(10).join([f"- {cat}: {currency}{amt:,.2f} ({expense_percentages[cat]:.1f}% of expenses)" for cat, amt in top_expenses])}

Please provide a summary with these 5 sections in order:
1. **Top Spending Categories** (list the 2 highest)
2. **Money-Saving Tips** (3-4 practical suggestions)
3. **Summary** (2-3 sentences about their financial situation)
4. **Tips** (2-3 actionable next steps)
5. **Conclusion** (encouraging closing statement)

Keep the language simple and encouraging for a student audience.
"""

def build_professional_prompt(income: float, expenses: Dict[str, float], savings_goal: float, 
                             currency: str = "$") -> str:
    """Build budget summary prompt for professional persona."""
    
    total_expenses = sum(expenses.values())
    disposable_income = income - total_expenses
    annual_income = income * 12
    
    # Calculate percentages
    expense_percentages = {cat: (amt / total_expenses * 100) for cat, amt in expenses.items()}
    top_expenses = sorted(expenses.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return f"""
Create a professional budget analysis:

EXECUTIVE SUMMARY:
- Monthly Income: {currency}{income:,.2f}
- Annual Income: {currency}{annual_income:,.2f}
- Total Monthly Expenses: {currency}{total_expenses:,.2f}
- Net Disposable Income: {currency}{disposable_income:,.2f}
- Target Savings: {currency}{savings_goal:,.2f}
- Available Surplus: {currency}{disposable_income - savings_goal:,.2f}

EXPENSE ALLOCATION:
{chr(10).join([f"- {cat}: {currency}{amt:,.2f} ({expense_percentages[cat]:.1f}% of total expenses)" for cat, amt in top_expenses])}

Provide analysis with these sections:
1. **Top 3 Spending Categories** (with strategic insights)
2. **Optimization Strategies** (3-4 professional recommendations)
3. **Financial Health Summary** (analytical overview)
4. **Strategic Recommendations** (growth-focused advice)
5. **Professional Takeaway** (key actionable insight)

Use professional language and focus on strategic financial planning.
"""

def build_persona_prompt(income: float, expenses: Dict[str, float], savings_goal: float, 
                        currency: str, user_type: str) -> str:
    """Route to appropriate persona-specific prompt builder."""
    
    if user_type.lower() == "student":
        return build_student_prompt(income, expenses, savings_goal, currency)
    else:
        return build_professional_prompt(income, expenses, savings_goal, currency)

def build_spending_insight_prompt(monthly_data: Dict[str, Any]) -> str:
    """Build comprehensive spending insight prompt."""
    
    income = monthly_data.get("income", 0)
    expenses = monthly_data.get("expenses", {})
    goals = monthly_data.get("goals", [])
    user_type = monthly_data.get("user_type", "general")
    
    total_expenses = sum(expenses.values())
    surplus = income - total_expenses
    
    # Categorize expenses
    fixed_expenses = {k: v for k, v in expenses.items() if k.lower() in ["rent", "insurance", "loan_payment"]}
    variable_expenses = {k: v for k, v in expenses.items() if k not in fixed_expenses}
    
    # Calculate goal timelines
    goal_analysis = []
    for goal in goals:
        monthly_needed = goal["amount"] / goal["months"]
        achievable = "Yes" if surplus >= monthly_needed else "No"
        goal_analysis.append(f"- {goal['name']}: ${goal['amount']} in {goal['months']} months (${monthly_needed:.2f}/month) - Achievable: {achievable}")
    
    return f"""
Generate comprehensive spending insights for a {user_type}:

# FINANCIAL DATA ANALYSIS

## Income & Expense Overview
- Monthly Income: ${income:,.2f}
- Total Monthly Expenses: ${total_expenses:,.2f}
- Monthly Surplus: ${surplus:,.2f}
- Savings Rate: {(surplus/income*100):.1f}%

## Expense Breakdown
Fixed Expenses (${sum(fixed_expenses.values()):,.2f}):
{chr(10).join([f"  - {cat}: ${amt:,.2f}" for cat, amt in fixed_expenses.items()])}

Variable Expenses (${sum(variable_expenses.values()):,.2f}):
{chr(10).join([f"  - {cat}: ${amt:,.2f}" for cat, amt in variable_expenses.items()])}

## Financial Goals
{chr(10).join(goal_analysis) if goal_analysis else "- No specific goals provided"}

## Benchmarks & Risk Analysis
- Housing ratio: {(expenses.get('rent', 0)/income*100):.1f}% (recommended: <30%)
- Transportation: {(expenses.get('transportation', 0)/income*100):.1f}% (recommended: <15%)
- Food spending: {(expenses.get('food', 0)/income*100):.1f}% (recommended: <12%)

Provide detailed analysis in these 8 structured sections:

1. **Spending Pattern Analysis** - Fixed vs Variable breakdown
2. **Category Deep Dive** - Needs vs Wants classification  
3. **Benchmark Comparison** - How expenses compare to recommended percentages
4. **Goal Feasibility** - Analysis of financial goals achievability
5. **Risk Assessment** - Identify concerning spending ratios
6. **Optimization Opportunities** - Specific areas for improvement
7. **Action Plan** - 3-4 concrete next steps
8. **Long-term Strategy** - Forward-looking recommendations

Use specific numbers from the data and provide actionable insights.
"""

def extract_cleaned_response(response_text: str) -> str:
    """Clean and format the model response."""
    
    # Remove any markdown formatting artifacts
    cleaned = response_text.strip()
    
    # Remove any system prompts that might have leaked through
    if "You are" in cleaned[:50]:
        lines = cleaned.split('\n')
        cleaned = '\n'.join([line for line in lines if not line.strip().startswith("You are")])
    
    return cleaned.strip()