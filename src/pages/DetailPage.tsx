import { ArrowLeft, ExternalLink, MessageCircle } from 'lucide-react';

interface DetailPageProps {
  title: string;
  description: string;
  steps: string[];
  onBack: () => void;
}

const DetailPage = ({ title, description, steps, onBack }: DetailPageProps) => {
  return (
    <div className="container">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={20} />
        Voltar para a Carta
      </button>

      <div className="detail-view">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--danger)' }}>
          Pendência: {title}
        </h2>
        
        <div style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          <p>{description}</p>
        </div>

        <div className="map-section" style={{ padding: '0', boxShadow: 'none' }}>
          <h3 style={{ marginBottom: '1rem' }}>Como corrigir</h3>
          
          <ul className="steps-list">
            {steps.map((step, idx) => (
              <li key={idx} className="step-item">
                <div className="step-number">{idx + 1}</div>
                <div style={{ fontSize: '1.1rem', paddingTop: '4px' }}>{step}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-actions">
          <a href="https://car.gov.br/#/" target="_blank" rel="noopener noreferrer" className="btn" style={{ width: 'auto', textDecoration: 'none' }}>
            <ExternalLink size={20} />
            Acessar o SICAR para corrigir
          </a>
          
          <a href={`https://wa.me/5561999999999?text=${encodeURIComponent('Olá, preciso de ajuda para corrigir uma inconsistência no meu CAR: ' + title)}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: 'auto', textDecoration: 'none' }}>
            <MessageCircle size={20} />
            Falar com técnico da EMATER
          </a>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
