import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 mx-auto">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3 text-center">{title}</h3>
      <p className="text-white/80 text-center leading-relaxed">{description}</p>
    </motion.div>
  );
};