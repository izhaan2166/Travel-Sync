import React, { useState } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { FeaturesPage } from './components/FeaturesPage';
import { SmartBooking } from './pages/SmartBooking';
import { InteractiveMaps } from './pages/InteractiveMaps';
import { DynamicPlanning } from './pages/DynamicPlanning';
import { RealTimeUpdates } from './pages/RealTimeUpdates';
import { SecureStorage } from './pages/SecureStorage';
import { EasySharing } from './pages/EasySharing';

function App() {
  const [currentPage, setCurrentPage] = useState<'welcome' | 'features' | string>('welcome');

  const handleGetStarted = () => {
    setCurrentPage('features');
  };

  const handleFeatureClick = (featureId: string) => {
    setCurrentPage(featureId);
  };

  const handleBack = () => {
    setCurrentPage('features');
  };

  const handleBackToWelcome = () => {
    setCurrentPage('welcome');
  };

  switch (currentPage) {
    case 'welcome':
      return <WelcomePage onGetStarted={handleGetStarted} onFeatureClick={handleFeatureClick} />;
    case 'features':
      return <FeaturesPage onFeatureClick={handleFeatureClick} onBack={handleBackToWelcome} />;
    case 'smart-booking':
      return <SmartBooking onBack={handleBack} />;
    case 'interactive-maps':
      return <InteractiveMaps onBack={handleBack} />;
    case 'dynamic-planning':
      return <DynamicPlanning onBack={handleBack} />;
    case 'real-time-updates':
      return <RealTimeUpdates onBack={handleBack} />;
    case 'secure-storage':
      return <SecureStorage onBack={handleBack} />;
    case 'easy-sharing':
      return <EasySharing onBack={handleBack} />;
    default:
      return <WelcomePage onGetStarted={handleGetStarted} />;
  }
}

export default App;