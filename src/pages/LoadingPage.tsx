import { useEffect, useState } from 'react';
import { Search, TreeDeciduous, FileText } from 'lucide-react';

const LoadingPage = () => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(2), 1000);
    const timer2 = setTimeout(() => setStep(3), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      
      <div style={{ marginTop: '2rem' }}>
        <div className={`loading-step ${step >= 1 ? 'active' : ''}`}>
          <Search size={24} />
          <span>Buscando seu imóvel no SICAR...</span>
        </div>
        
        <div className={`loading-step ${step >= 2 ? 'active' : ''}`}>
          <TreeDeciduous size={24} />
          <span>Calculando suas APPs e Reserva Legal...</span>
        </div>
        
        <div className={`loading-step ${step >= 3 ? 'active' : ''}`}>
          <FileText size={24} />
          <span>Gerando sua carta...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
