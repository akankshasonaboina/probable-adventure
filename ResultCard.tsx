import React from 'react';
import { motion } from 'framer-motion';

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 ${className}`}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-blue-200 pb-2">
        {title}
      </h3>
      <div className="text-gray-700">
        {children}
      </div>
    </motion.div>
  );
};