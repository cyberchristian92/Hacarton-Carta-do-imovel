import { useState } from 'react';
import { Search, UserCircle } from 'lucide-react';

interface LandingPageProps {
  onSearch: (carNumber: string) => void;
  onGovbrClick: () => void;
}

const LandingPage = ({ onSearch, onGovbrClick }: LandingPageProps) => {
  const [car, setCar] = useState('');
  const [cpf, setCpf] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (car) {
      onSearch(car);
    }
  };

  const autofillDemo = () => {
    setCar('SP-1234567-89ABCDEF0123456789ABCDEF01234567');
    setCpf('111.222.333-44');
  };

  return (
    <div className="landing">
      <img 
        src={`${import.meta.env.BASE_URL}logo.png`} 
        alt="Carta do Imóvel Logo" 
        style={{ width: '150px', height: '150px', objectFit: 'contain', marginBottom: '1rem', borderRadius: '50%' }}
        onError={(e) => {
          // Fallback if logo is missing
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Carta do Imóvel</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem' }}>Diagnóstico CAR Simplificado</p>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cpf">CPF do Proprietário</label>
            <input 
              type="text" 
              id="cpf" 
              placeholder="000.000.000-00" 
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="car">Número do CAR (Obrigatório)</label>
            <input 
              type="text" 
              id="car" 
              placeholder="Ex: SP-1234567-..." 
              value={car}
              onChange={(e) => setCar(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn">
            <Search size={20} />
            Gerar minha carta
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button type="button" className="btn btn-secondary" onClick={autofillDemo}>
            Preencher Dados de Demonstração (Demo)
          </button>
          
          <button type="button" className="btn btn-secondary" onClick={onGovbrClick}>
            <UserCircle size={20} />
            Entrar com Gov.br
          </button>
        </div>
        
        <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
          Os dados vêm diretamente do SICAR (sistema público federal)
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
