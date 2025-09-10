import React from 'react';
import { Brain, MessageCircle, PieChart, TrendingUp } from 'lucide-react';
import { Layout } from '../components/Layout';
import { FeatureCard } from '../components/FeatureCard';
import { motion } from 'framer-motion';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Brain,
      title: 'NLU Analysis',
      description: 'Analyze the sentiment and key concepts in your financial questions using advanced natural language understanding.',
      page: 'nlu',
      delay: 0.1
    },
    {
      icon: MessageCircle,
      title: 'Q&A Assistant',
      description: 'Get personalized financial advice through natural conversation with our AI assistant.',
      page: 'qa',
      delay: 0.2
    },
    {
      icon: PieChart,
      title: 'Budget Summary',
      description: 'Get comprehensive analysis of your income, expenses, and savings with personalized recommendations.',
      page: 'budget',
      delay: 0.3
    },
    {
      icon: TrendingUp,
      title: 'Spending Insights',
      description: 'Deep dive into your spending patterns and get actionable insights for financial optimization.',
      page: 'insights',
      delay: 0.4
    }
  ];

  return (
    <Layout 
      title="💰 Personal Finance Chatbot"
      subtitle="AI-powered financial guidance tailored just for you"
    >
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            onClick={() => onNavigate(feature.page)}
            delay={feature.delay}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-12 text-center"
      >
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            🚀 Powered by Advanced AI
          </h3>
          <p className="text-gray-600">
            Our chatbot uses sophisticated natural language processing to understand your financial needs 
            and provide personalized guidance for students and professionals alike.
          </p>
        </div>
      </motion.div>
    </Layout>
  );
};