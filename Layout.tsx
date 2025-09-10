import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  onBack, 
  showBack = false 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      <div className="container mx-auto px-4 py-8">
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
        
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};