import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ResultCard } from '../components/ResultCard';
import { financeAPI } from '../services/api';
import { BudgetData } from '../types';

interface BudgetPageProps {
  onBack: () => void;
}

export const BudgetPage: React.FC<BudgetPageProps> = ({ onBack }) => {
  const [budgetData, setBudgetData] = useState<BudgetData>({
    income: 4000,
    expenses: {
      rent: 1200,
      food: 400,
      transportation: 300,
      utilities: 150,
      entertainment: 200,
      shopping: 150
    },
    savings_goal: 500,
    currency: '$',
    user_type: 'professional'
  });
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string>('');

  const handleExpenseChange = (category: string, value: string) => {
    setBudgetData(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [category]: parseFloat(value) || 0
      }
    }));
  };

  const addExpenseCategory = () => {
    const category = prompt('Enter expense category name:');
    if (category && !budgetData.expenses[category]) {
      setBudgetData(prev => ({
        ...prev,
        expenses: {
          ...prev.expenses,
          [category]: 0
        }
      }));
    }
  };

  const removeExpenseCategory = (category: string) => {
    setBudgetData(prev => ({
      ...prev,
      expenses: Object.fromEntries(
        Object.entries(prev.expenses).filter(([key]) => key !== category)
      )
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await financeAPI.generateBudgetSummary(budgetData);
      setSummary(result);
    } catch (error) {
      console.error('Budget analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSummary = (text: string) => {
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

  const totalExpenses = Object.values(budgetData.expenses).reduce((sum, amount) => sum + amount, 0);
  const remainingIncome = budgetData.income - totalExpenses;

  return (
    <Layout
      title="📊 Budget Summary Generator"
      subtitle="Provide your financial information to get a comprehensive budget analysis"
      onBack={onBack}
      showBack
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Income ($)
                </label>
                <input
                  type="number"
                  value={budgetData.income}
                  onChange={(e) => setBudgetData(prev => ({ ...prev, income: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Savings Goal ($)
                </label>
                <input
                  type="number"
                  value={budgetData.savings_goal}
                  onChange={(e) => setBudgetData(prev => ({ ...prev, savings_goal: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Type
                </label>
                <select
                  value={budgetData.user_type}
                  onChange={(e) => setBudgetData(prev => ({ ...prev, user_type: e.target.value as 'student' | 'professional' }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="student">Student</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Monthly Expenses
                </label>
                <button
                  onClick={addExpenseCategory}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Category
                </button>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Object.entries(budgetData.expenses).map(([category, amount]) => (
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
                      className="w-24 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => removeExpenseCategory(category)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span>Total Expenses:</span>
                  <span className="font-medium">${totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining Income:</span>
                  <span className={`font-medium ${remainingIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${remainingIncome.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
          >
            {loading ? 'Analyzing Budget...' : 'Generate Budget Summary'}
          </button>
        </div>

        {loading && <LoadingSpinner />}

        {summary && (
          <ResultCard title="Budget Analysis Results">
            <div className="prose prose-blue max-w-none">
              {formatSummary(summary)}
            </div>
          </ResultCard>
        )}
      </div>
    </Layout>
  );
};