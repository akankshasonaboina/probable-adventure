import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ResultCard } from '../components/ResultCard';
import { financeAPI } from '../services/api';
import { NLUAnalysis } from '../types';

interface NLUPageProps {
  onBack: () => void;
}

export const NLUPage: React.FC<NLUPageProps> = ({ onBack }) => {
  const [text, setText] = useState('I need help with saving money each month while paying off my student loans');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ analysis: NLUAnalysis; text: string } | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      const response = await financeAPI.analyzeNLU(text);
      setResult(response);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="🧠 Natural Language Understanding"
      subtitle="Enter your financial question to see how our AI understands it"
      onBack={onBack}
      showBack
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Enter your financial question or concern:
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="e.g., How can I save money while paying off student loans?"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
          >
            {loading ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </div>

        {loading && <LoadingSpinner />}

        {result && (
          <div className="space-y-4">
            <ResultCard title="Sentiment Analysis">
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.analysis.sentiment.document.label === 'positive' 
                    ? 'bg-green-100 text-green-800'
                    : result.analysis.sentiment.document.label === 'negative'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {result.analysis.sentiment.document.label}
                </div>
                <span className="text-gray-600">
                  Score: {result.analysis.sentiment.document.score.toFixed(2)}
                </span>
              </div>
            </ResultCard>

            <ResultCard title="Key Topics">
              <div className="flex flex-wrap gap-2">
                {result.analysis.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {keyword.text} ({(keyword.relevance * 100).toFixed(0)}%)
                  </span>
                ))}
              </div>
            </ResultCard>

            {result.analysis.entities.length > 0 && (
              <ResultCard title="Identified Entities">
                <div className="space-y-2">
                  {result.analysis.entities.map((entity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium">
                        {entity.type}
                      </span>
                      <span className="text-gray-700">{entity.text}</span>
                    </div>
                  ))}
                </div>
              </ResultCard>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};