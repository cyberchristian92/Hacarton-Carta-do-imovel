import { useState } from 'react';
import { UserCircle, Lock, Eye, EyeOff } from 'lucide-react';

interface GovbrLoginPageProps {
  onLogin: (cpf: string) => void;
  onCancel: () => void;
}

const GovbrLoginPage = ({ onLogin, onCancel }: GovbrLoginPageProps) => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'cpf' | 'password'>('cpf');
  const [loading, setLoading] = useState(false);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCpfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cpf.length === 14) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep('password');
      }, 800);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length > 0) {
      setLoading(true);
      setTimeout(() => {
        onLogin(cpf);
      }, 1000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <header style={{
        width: '100%',
        backgroundColor: '#1351b4',
        padding: '1rem',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <UserCircle size={28} />
        gov.br
      </header>

      <div style={{
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '450px',
        marginTop: '3rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '2rem',
        position: 'relative'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
          Identifique-se no gov.br
        </h2>

        {step === 'cpf' ? (
          <form onSubmit={handleCpfSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                Número do CPF
              </label>
              <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                Digite seu CPF para acessar o sistema
              </p>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(formatCPF(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  outline: 'none',
                  borderColor: cpf.length === 14 ? '#1351b4' : '#ccc'
                }}
                autoFocus
              />
            </div>
            
            <button 
              type="submit" 
              disabled={cpf.length !== 14 || loading}
              style={{
                width: '100%',
                backgroundColor: cpf.length === 14 ? '#1351b4' : '#e0e0e0',
                color: cpf.length === 14 ? 'white' : '#999',
                border: 'none',
                padding: '0.875rem',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: cpf.length === 14 ? 'pointer' : 'not-allowed',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {loading ? 'Carregando...' : 'Continuar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#f0f4f8', borderRadius: '4px' }}>
                <div>
                  <span style={{ fontSize: '0.875rem', color: '#666' }}>CPF</span><br/>
                  <strong style={{ color: '#1351b4' }}>{cpf}</strong>
                </div>
                <button type="button" onClick={() => setStep('cpf')} style={{ background: 'none', border: 'none', color: '#1351b4', cursor: 'pointer', textDecoration: 'underline' }}>
                  Alterar
                </button>
              </div>

              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '10px', top: '12px', color: '#666' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    outline: 'none',
                    borderColor: password.length > 0 ? '#1351b4' : '#ccc'
                  }}
                  autoFocus
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={password.length === 0 || loading}
              style={{
                width: '100%',
                backgroundColor: password.length > 0 ? '#1351b4' : '#e0e0e0',
                color: password.length > 0 ? 'white' : '#999',
                border: 'none',
                padding: '0.875rem',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: password.length > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {loading ? 'Autenticando...' : 'Entrar'}
            </button>
          </form>
        )}

        <button 
          onClick={onCancel}
          style={{
            marginTop: '1.5rem',
            width: '100%',
            background: 'none',
            border: '1px solid #ccc',
            color: '#666',
            padding: '0.75rem',
            borderRadius: '4px',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          Cancelar e voltar
        </button>
        
        <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#999', textAlign: 'center' }}>
          *Este é um ambiente simulado para demonstração no Hacarton.
        </p>
      </div>
    </div>
  );
};

export default GovbrLoginPage;
