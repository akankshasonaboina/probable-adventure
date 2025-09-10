import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ResultCard } from '../components/ResultCard';
import { financeAPI } from '../services/api';

interface QAPageProps {
  onBack: () => void;
}

export const QAPage: React.FC<QAPageProps> = ({ onBack }) => {
  const [question, setQuestion] = useState('How can I save money while paying off student loans?');
  const [persona, setPersona] = useState<'student' | 'professional'>('student');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>('');

  const handleSubmit = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const result = await financeAPI.generateResponse(question, persona);
      setResponse(result);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (text: string) => {
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

  return (
    <Layout
      title="💬 Personal Finance Q&A"
      subtitle="Ask any financial question and get personalized advice"
      onBack={onBack}
      showBack
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Financial Question:
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="e.g., How should I prioritize paying off debt vs saving for retirement?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Profile:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="student"
                    checked={persona === 'student'}
                    onChange={(e) => setPersona(e.target.value as 'student')}
                    className="mr-2"
                  />
                  Student
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="professional"
                    checked={persona === 'professional'}
                    onChange={(e) => setPersona(e.target.value as 'professional')}
                    className="mr-2"
                  />
                  Professional
                </label>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !question.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
            >
              {loading ? 'Getting Advice...' : 'Get Financial Advice'}
            </button>
          </div>
        </div>

        {loading && <LoadingSpinner />}

        {response && (
          <ResultCard title="AI Financial Advisor Response">
            <div className="prose prose-blue max-w-none">
              {formatResponse(response)}
            </div>
          </ResultCard>
        )}
      </div>
    </Layout>
  );
};