import React from 'react';
import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { NLUPage } from './pages/NLUPage';
import { QAPage } from './pages/QAPage';
import { BudgetPage } from './pages/BudgetPage';
import { InsightsPage } from './pages/InsightsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'nlu':
        return <NLUPage onBack={() => setCurrentPage('home')} />;
      case 'qa':
        return <QAPage onBack={() => setCurrentPage('home')} />;
      case 'budget':
        return <BudgetPage onBack={() => setCurrentPage('home')} />;
      case 'insights':
        return <InsightsPage onBack={() => setCurrentPage('home')} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
