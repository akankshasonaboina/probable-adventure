import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ResultCard } from '../components/ResultCard';
import { financeAPI } from '../services/api';
import { SpendingData } from '../types';

interface InsightsPageProps {
  onBack: () => void;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ onBack }) => {
  const [spendingData, setSpendingData] = useState<SpendingData>({
    income: 5000,
    expenses: {
      rent: 1500,
      food: 600,
      transportation: 400,
      utilities: 200,
      entertainment: 300,
      shopping: 250,
      insurance: 150
    },
    goals: [
      { name: 'Emergency Fund', amount: 10000, months: 12 },
      { name: 'Vacation', amount: 3000, months: 6 }
    ],
    user_type: 'professional'
  });
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string>('');

  const handleExpenseChange = (category: string, value: string) => {
    setSpendingData(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [category]: parseFloat(value) || 0
      }
    }));
  };

  const handleGoalChange = (index: number, field: string, value: string | number) => {
    setSpendingData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === index ? { ...goal, [field]: value } : goal
      )
    }));
  };

  const addGoal = () => {
    setSpendingData(prev => ({
      ...prev,
      goals: [...prev.goals, { name: 'New Goal', amount: 1000, months: 12 }]
    }));
  };

  const removeGoal = (index: number) => {
    setSpendingData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await financeAPI.generateSpendingInsights(spendingData);
      setInsights(result);
    } catch (error) {
      console.error('Insights analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatInsights = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h4 key={index} className="font-semibold text-gray-800 mt-4 mb-2">
            {line.replace(/\*\*/g, '')}
          </h4>
        );
      }
      if (line.startsWith('•')) {
        return (
          <li key={index} className="ml-4 mb-1 text-gray-700">
            {line.substring(1).trim()}
          </li>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <li key={index} className="ml-4 mb-1 text-gray-700 list-decimal">
            {line.replace(/^\d+\.\s*/, '')}
          </li>
        );
      }
      if (line.trim()) {
        return (
          <p key={index} className="mb-2 text-gray-700 leading-relaxed">
            {line}
          </p>
        );
      }
      return <br key={index} />;
    });
  };

  const totalExpenses = Object.values(spendingData.expenses).reduce((sum, amount) => sum + amount, 0);
  const surplus = spendingData.income - totalExpenses;

  return (
    <Layout
      title="🔍 Spending Insights & Analysis"
      subtitle="Get detailed insights into your spending patterns and goal progress"
      onBack={onBack}
      showBack
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Income & Profile */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Income ($)
                </label>
                <input
                  type="number"
                  value={spendingData.income}
                  onChange={(e) => setSpendingData(prev => ({ ...prev, income: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Type
                </label>
                <select
                  value={spendingData.user_type}
                  onChange={(e) => setSpendingData(prev => ({ ...prev, user_type: e.target.value as 'student' | 'professional' }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="student">Student</option>
                  <option value="professional">Professional</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Total Expenses:</span>
                    <span className="font-medium">${totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Surplus:</span>
                    <span className={`font-medium ${surplus >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${surplus.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Savings Rate:</span>
                    <span className="font-medium">
                      {((surplus / spendingData.income) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expenses */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Monthly Expenses
              </label>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Object.entries(spendingData.expenses).map(([category, amount]) => (
                  <div key={category} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={category}
                      readOnly
                      className="flex-1 p-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => handleExpenseChange(category, e.target.value)}
                      className="w-20 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Financial Goals
                </label>
                <button
                  onClick={addGoal}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Goal
                </button>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {spendingData.goals.map((goal, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-gray-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={goal.name}
                        onChange={(e) => handleGoalChange(index, 'name', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => removeGoal(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ×
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={goal.amount}
                        onChange={(e) => handleGoalChange(index, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="Amount ($)"
                        className="p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        value={goal.months}
                        onChange={(e) => handleGoalChange(index, 'months', parseFloat(e.target.value) || 1)}
                        placeholder="Months"
                        className="p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      Monthly needed: ${(goal.amount / goal.months).toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
          >
            {loading ? 'Analyzing Spending...' : 'Generate Spending Insights'}
          </button>
        </div>

        {loading && <LoadingSpinner />}

        {insights && (
          <ResultCard title="Comprehensive Spending Analysis">
            <div className="prose prose-blue max-w-none">
              {formatInsights(insights)}
            </div>
          </ResultCard>
        )}
      </div>
    </Layout>
  );
};