import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Loading from './components/common/Loading';
import { ToastProvider } from './components/common/Toast';

// Lazy load page components (named exports wrapped to default objects for React.lazy)
const WelcomePage = React.lazy(() => import('./pages/WelcomePage').then(m => ({ default: m.WelcomePage })));
const FeaturesPage = React.lazy(() => import('./pages/FeaturesPage').then(m => ({ default: m.FeaturesPage })));
const SmartBooking = React.lazy(() => import('./pages/SmartBooking').then(m => ({ default: m.SmartBooking })));
const InteractiveMaps = React.lazy(() => import('./pages/InteractiveMaps').then(m => ({ default: m.InteractiveMaps })));
const DynamicPlanning = React.lazy(() => import('./pages/DynamicPlanning').then(m => ({ default: m.DynamicPlanning })));
const RealTimeUpdates = React.lazy(() => import('./pages/RealTimeUpdates').then(m => ({ default: m.RealTimeUpdates })));
const SecureStorage = React.lazy(() => import('./pages/SecureStorage').then(m => ({ default: m.SecureStorage })));
const EasySharing = React.lazy(() => import('./pages/EasySharing').then(m => ({ default: m.EasySharing })));

function AppContent() {
  const navigate = useNavigate();

  const handleGetStarted = () => navigate('/features');
  const handleFeatureClick = (featureId: string) => navigate(`/${featureId}`);
  const handleBack = () => navigate('/features');
  const handleBackToWelcome = () => navigate('/');

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route 
          path="/" 
          element={<WelcomePage onGetStarted={handleGetStarted} onFeatureClick={handleFeatureClick} />} 
        />
        <Route 
          path="/features" 
          element={<FeaturesPage onFeatureClick={handleFeatureClick} onBack={handleBackToWelcome} />} 
        />
        <Route 
          path="/smart-booking" 
          element={<SmartBooking onBack={handleBack} />} 
        />
        <Route 
          path="/interactive-maps" 
          element={<InteractiveMaps onBack={handleBack} />} 
        />
        <Route 
          path="/dynamic-planning" 
          element={<DynamicPlanning onBack={handleBack} />} 
        />
        <Route 
          path="/real-time-updates" 
          element={<RealTimeUpdates onBack={handleBack} />} 
        />
        <Route 
          path="/secure-storage" 
          element={<SecureStorage onBack={handleBack} />} 
        />
        <Route 
          path="/easy-sharing" 
          element={<EasySharing onBack={handleBack} />} 
        />
        {/* Fallback route */}
        <Route 
          path="*" 
          element={<WelcomePage onGetStarted={handleGetStarted} onFeatureClick={handleFeatureClick} />} 
        />
      </Routes>
    </Suspense>
  );
}

export function App() {
  return (
    <ToastProvider>
      <Router>
        <AppContent />
      </Router>
    </ToastProvider>
  );
}

export default App;