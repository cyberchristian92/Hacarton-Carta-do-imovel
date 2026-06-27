import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoadingPage from './pages/LoadingPage';
import ReportPage from './pages/ReportPage';
import DetailPage from './pages/DetailPage';
import { mockProperties } from './mockData';
import type { PropertyData } from './mockData';

export type AppState = 'landing' | 'loading' | 'report' | 'detail';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [property, setProperty] = useState<PropertyData | null>(null);
  
  const [selectedDetail, setSelectedDetail] = useState<{
    title: string;
    description: string;
    steps: string[];
  } | null>(null);

  const handleSearch = (car: string) => {
    setAppState('loading');
    
    // Simulate API call
    setTimeout(() => {
      const foundProperty = mockProperties[car as keyof typeof mockProperties] || mockProperties['SP-1234567-89ABCDEF0123456789ABCDEF01234567']; // fallback to mock if not found
      setProperty(foundProperty);
      setAppState('report');
    }, 3000);
  };

  const handleShowDetail = (title: string, description: string, steps: string[]) => {
    setSelectedDetail({ title, description, steps });
    setAppState('detail');
  };

  const handleBackToReport = () => {
    setAppState('report');
  };

  const handleReset = () => {
    setAppState('landing');
    setProperty(null);
  };

  return (
    <>
      {appState === 'landing' && <LandingPage onSearch={handleSearch} />}
      {appState === 'loading' && <LoadingPage />}
      {appState === 'report' && property && (
        <ReportPage 
          property={property} 
          onShowDetail={handleShowDetail} 
          onReset={handleReset} 
        />
      )}
      {appState === 'detail' && selectedDetail && (
        <DetailPage 
          title={selectedDetail.title} 
          description={selectedDetail.description} 
          steps={selectedDetail.steps} 
          onBack={handleBackToReport} 
        />
      )}
    </>
  );
}

export default App;
