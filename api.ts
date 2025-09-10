import { NLUAnalysis, BudgetData, SpendingData } from '../types';

// Mock API service that simulates IBM Watson and Watsonx integration
class FinanceAPI {
  private baseURL = 'http://localhost:8000/api/v1';

  // Mock NLU Analysis
  async analyzeNLU(text: string): Promise<{ analysis: NLUAnalysis; text: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const sentiments = ['positive', 'negative', 'neutral'] as const;
    const selectedSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    const sentimentScores = { positive: 0.8, negative: 0.2, neutral: 0.6 };

    const financialKeywords = ['money', 'savings', 'budget', 'expenses', 'income', 'investment', 'debt', 'loan'];
    const keywords = financialKeywords
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(kw => ({ text: kw, relevance: Math.random() * 0.5 + 0.5 }));

    const entities = [];
    if (text.toLowerCase().includes('month')) entities.push({ text: 'month', type: 'TIME' });
    if (text.toLowerCase().includes('year')) entities.push({ text: 'year', type: 'TIME' });
    if (text.includes('$') || text.toLowerCase().includes('dollar')) entities.push({ text: 'dollar', type: 'MONEY' });

    return {
      analysis: {
        sentiment: {
          document: {
            score: sentimentScores[selectedSentiment],
            label: selectedSentiment
          }
        },
        keywords,
        entities: entities.slice(0, 3)
      },
      text
    };
  }

  // Mock Q&A Generation
  async generateResponse(question: string, persona: string = 'general'): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1200));

    if (question.toLowerCase().includes('student loan')) {
      return `**Managing Student Loans While Saving**

**Understanding Your Situation:**
Balancing student loan payments with savings requires a strategic approach that prioritizes both debt reduction and financial security.

**Practical Steps:**
1. **Build a small emergency fund** - Start with $500-1000 while paying loans
2. **Use the debt avalanche method** - Pay minimums on all loans, extra on highest interest rate
3. **Look for additional income** - Side hustles, tutoring, or part-time work
4. **Reduce unnecessary expenses** - Review subscriptions, dining out, entertainment
5. **Take advantage of tax benefits** - Student loan interest deduction

**Saving Strategies:**
• Automate small savings amounts ($25-50/month)
• Use cash-back apps and rewards programs
• Consider income-driven repayment plans if federal loans
• Look into loan forgiveness programs if eligible

**Long-term Approach:**
Focus on building good financial habits now. Even small amounts saved consistently will compound over time.`;
    }

    return `**Personalized Financial Guidance**

Thank you for your question. As your personal finance assistant, I'm here to help you make informed financial decisions.

**General Financial Guidance:**
• Start with a budget to understand your money flow
• Build an emergency fund of 3-6 months expenses
• Pay off high-interest debt first
• Invest for long-term goals
• Review and adjust your plan regularly

**Next Steps:**
Feel free to ask specific questions about budgeting, saving, debt management, or investment planning. I can also help analyze your spending patterns.

**Remember:**
Personal finance is personal - what works for others may need adjustment for your unique situation.`;
  }

  // Mock Budget Summary
  async generateBudgetSummary(data: BudgetData): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const totalExpenses = Object.values(data.expenses).reduce((sum, amount) => sum + amount, 0);
    const disposableIncome = data.income - totalExpenses;
    const annualIncome = data.income * 12;

    const topExpenses = Object.entries(data.expenses)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    if (data.user_type === 'student') {
      return `**Student Budget Summary**

**Financial Overview:**
Your monthly income of ${data.currency}${data.income.toLocaleString()} provides a foundation for your financial goals. After analyzing your spending patterns, here are the key insights:

**Top Spending Categories:**
• ${topExpenses[0][0]}: ${data.currency}${topExpenses[0][1].toLocaleString()} (${((topExpenses[0][1]/totalExpenses)*100).toFixed(1)}%)
• ${topExpenses[1][0]}: ${data.currency}${topExpenses[1][1].toLocaleString()} (${((topExpenses[1][1]/totalExpenses)*100).toFixed(1)}%)

**Money-Saving Tips:**
• Consider meal planning to reduce food costs
• Look for student discounts on transportation and entertainment
• Share textbooks or buy used when possible
• Use campus resources like gym and library instead of paid alternatives

**Summary:**
With ${data.currency}${disposableIncome.toLocaleString()} remaining after expenses, you're in a position to work toward your ${data.currency}${data.savings_goal.toLocaleString()} savings goal.

**Tips:**
• Set up automatic transfers to savings
• Track expenses using a budgeting app
• Review and adjust monthly

**Conclusion:**
You're building great financial habits early - keep up the good work!`;
    }

    return `**Professional Budget Analysis**

**Executive Summary:**
Monthly Income: ${data.currency}${data.income.toLocaleString()}
Annual Income: ${data.currency}${annualIncome.toLocaleString()}
Total Monthly Expenses: ${data.currency}${totalExpenses.toLocaleString()}
Net Disposable Income: ${data.currency}${disposableIncome.toLocaleString()}

**Top 3 Spending Categories:**
• ${topExpenses[0][0]}: ${data.currency}${topExpenses[0][1].toLocaleString()} (${((topExpenses[0][1]/totalExpenses)*100).toFixed(1)}%)
• ${topExpenses[1][0]}: ${data.currency}${topExpenses[1][1].toLocaleString()} (${((topExpenses[1][1]/totalExpenses)*100).toFixed(1)}%)
• ${topExpenses[2][0]}: ${data.currency}${topExpenses[2][1].toLocaleString()} (${((topExpenses[2][1]/totalExpenses)*100).toFixed(1)}%)

**Optimization Strategies:**
• Negotiate insurance rates for potential savings
• Consider high-yield savings accounts for emergency fund
• Review subscription services quarterly
• Implement the 50/30/20 budgeting rule

**Financial Health Summary:**
Your current savings rate of ${((disposableIncome/data.income)*100).toFixed(1)}% is ${disposableIncome/data.income >= 0.2 ? 'excellent' : 'good but could be improved'}.

**Strategic Recommendations:**
• Automate investments and savings
• Consider tax-advantaged retirement accounts
• Build 6-month emergency fund
• Explore additional income streams

**Professional Takeaway:**
Focus on maximizing your savings rate while maintaining your quality of life.`;
  }

  // Mock Spending Insights
  async generateSpendingInsights(data: SpendingData): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1100));

    const totalExpenses = Object.values(data.expenses).reduce((sum, amount) => sum + amount, 0);
    const surplus = data.income - totalExpenses;
    const savingsRate = (surplus / data.income * 100).toFixed(1);

    return `**Comprehensive Spending Analysis**

**1. Spending Pattern Analysis**
• Monthly Income: $${data.income.toLocaleString()}
• Total Expenses: $${totalExpenses.toLocaleString()}
• Monthly Surplus: $${surplus.toLocaleString()}
• Savings Rate: ${savingsRate}%

**2. Category Deep Dive**
${Object.entries(data.expenses).map(([category, amount]) => 
  `• ${category}: $${amount.toLocaleString()} (${((amount/totalExpenses)*100).toFixed(1)}%)`
).join('\n')}

**3. Benchmark Comparison**
• Housing: ${data.expenses.rent ? ((data.expenses.rent/data.income)*100).toFixed(1) : '0'}% (recommended: <30%)
• Transportation: ${data.expenses.transportation ? ((data.expenses.transportation/data.income)*100).toFixed(1) : '0'}% (recommended: <15%)
• Food: ${data.expenses.food ? ((data.expenses.food/data.income)*100).toFixed(1) : '0'}% (recommended: <12%)

**4. Goal Feasibility**
${data.goals.map(goal => {
  const monthlyNeeded = goal.amount / goal.months;
  const achievable = surplus >= monthlyNeeded ? 'Yes' : 'No';
  return `• ${goal.name}: $${goal.amount.toLocaleString()} in ${goal.months} months ($${monthlyNeeded.toFixed(0)}/month) - Achievable: ${achievable}`;
}).join('\n')}

**5. Risk Assessment**
${surplus < 0 ? '⚠️ Monthly deficit detected - immediate action required' : '✅ Positive cash flow maintained'}

**6. Optimization Opportunities**
• Reduce dining out by 20% to save $${Math.round((data.expenses.food || 0) * 0.2)}/month
• Review subscription services for potential cuts
• Consider carpooling or public transit options

**7. Action Plan**
1. Automate savings transfers
2. Use budgeting apps for tracking
3. Review and adjust monthly
4. Build emergency fund first

**8. Long-term Strategy**
Focus on increasing your savings rate to 20% of income while maintaining your current lifestyle quality.`;
  }
}

export const financeAPI = new FinanceAPI();