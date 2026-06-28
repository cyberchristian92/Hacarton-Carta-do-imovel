import type { PropertyData } from '../mockData';
import { 
  calculateReservaLegal, 
  calculateAPP, 
  calculateCadastral 
} from '../validation';
import { Download, Share2, ArrowRight } from 'lucide-react';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface ReportPageProps {
  property: PropertyData;
  onShowDetail: (title: string, description: string, steps: string[]) => void;
  onReset: () => void;
}

const ReportPage = ({ property, onShowDetail, onReset }: ReportPageProps) => {
  const rlResult = calculateReservaLegal(property);
  const appResults = calculateAPP(property);
  const cadastralResult = calculateCadastral(property);

  const hasInconsistencies = 
    rlResult.status === 'inconsistent' || 
    appResults.some(app => app.status === 'inconsistent') ||
    cadastralResult.status === 'inconsistent';

  const hasAttention = 
    rlResult.status === 'attention' || 
    appResults.some(app => app.status === 'attention') ||
    cadastralResult.status === 'attention';

  let globalMessage = 'Seu imóvel está regular';
  let statusClass = 'global-status regular';

  if (hasInconsistencies) {
    globalMessage = 'Seu imóvel tem pendências que precisam de atenção';
    statusClass = 'global-status inconsistent';
  } else if (hasAttention) {
    globalMessage = 'Seu imóvel tem pontos de atenção';
    statusClass = 'global-status attention';
  }

  // Calculate center of polygon for map
  const lats = property.polygon.map(p => p[0]);
  const lngs = property.polygon.map(p => p[1]);
  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }} className="no-print">
        <button onClick={onReset} className="btn-secondary" style={{ padding: '0.5rem 1rem', border: 'none', background: 'transparent' }}>
          &larr; Nova Consulta
        </button>
      </div>

      <div className="report-header">
        <div className="header-top">
          <div className="property-title">
            <h2>Fazenda {property.ownerName}</h2>
            <p>{property.municipality} - {property.state}</p>
            <p style={{ fontFamily: 'monospace', fontSize: '0.9rem', marginTop: '0.5rem' }}>CAR: {property.carNumber}</p>
          </div>
          <div className="date" style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Gerado em: {new Date().toLocaleDateString('pt-BR')}
          </div>
        </div>
        
        <div className={statusClass}>
          {globalMessage}
        </div>
      </div>

      {/* Reserva Legal Card */}
      <div className={`report-card ${rlResult.status}`}>
        <div className="card-header">
          {rlResult.status === 'regular' ? '🟩' : rlResult.status === 'attention' ? '🟨' : '🟥'} 
          Reserva Legal
        </div>
        <div className="card-body">
          <p><span>Exigido pelo Código Florestal:</span> <span>{rlResult.requiredPercentage}% (bioma {property.bioma})</span></p>
          <p><span>Declarado no seu CAR:</span> <span>{rlResult.declaredPercentage}%</span></p>
          <p><span>Diferença:</span> <span>{rlResult.diff > 0 ? '+' : ''}{rlResult.diff}% {rlResult.diff >= 0 ? '(superávit)' : '(déficit)'}</span></p>
        </div>
        <div className="card-footer">
          <div className="card-message">
            <strong>Situação: {rlResult.status === 'regular' ? 'Regular' : 'Inconsistente'}</strong><br/>
            {rlResult.message}
          </div>
        </div>
        
        {rlResult.status === 'inconsistent' && (
          <button 
            className="action-btn"
            onClick={() => onShowDetail(
              'Reserva Legal',
              rlResult.message,
              [
                'Acesse o módulo de edição do SICAR pelo link',
                'Vá até a aba "Vegetação Nativa"',
                `Amplie a área de Reserva Legal em pelo menos ${Math.abs((property.totalArea * rlResult.diff) / 100).toFixed(1)} hectares para atingir os ${rlResult.requiredPercentage}% exigidos.`
              ]
            )}
          >
            Ver como corrigir <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* APP Cards */}
      {appResults.map((app, idx) => (
        <div key={idx} className={`report-card ${app.status}`}>
          <div className="card-header">
            {app.status === 'regular' ? '🟩' : app.status === 'attention' ? '🟨' : '🟥'} 
            Área de Preservação Permanente — Margem de rio
          </div>
          <div className="card-body">
            <p><span>Rio identificado:</span> <span>{app.riverName}</span></p>
            <p><span>Largura do curso d'água:</span> <span>{app.width} metros</span></p>
            <p><span>Faixa mínima de APP exigida:</span> <span>{app.requiredApp} metros de cada margem</span></p>
            <p><span>Faixa declarada no CAR:</span> <span>{app.declaredApp} metros</span></p>
            <p><span>Diferença:</span> <span>{app.diff > 0 ? '+' : ''}{app.diff} metros {app.diff >= 0 ? '(superávit)' : '(déficit)'}</span></p>
          </div>
          <div className="card-footer">
            <div className="card-message">
              <strong>Situação: {app.status === 'regular' ? 'Regular' : 'Inconsistente'}</strong><br/>
              {app.message}
            </div>
          </div>
          
          {app.status === 'inconsistent' && (
            <button 
              className="action-btn"
              onClick={() => onShowDetail(
                `APP de hidrografia — ${app.riverName}`,
                `A área protegida às margens do ${app.riverName} está menor do que a lei exige. ${app.message}`,
                [
                  'Acesse o módulo de edição do SICAR pelo link',
                  'Vá até "Editar APP de hidrografia"',
                  `Amplie a delimitação da margem esquerda e direita do ${app.riverName} em ${Math.abs(app.diff)} metros`
                ]
              )}
            >
              Ver como corrigir <ArrowRight size={16} />
            </button>
          )}
        </div>
      ))}

      {/* Dados Cadastrais Card */}
      <div className={`report-card ${cadastralResult.status}`}>
        <div className="card-header">
          {cadastralResult.status === 'regular' ? '🟩' : cadastralResult.status === 'attention' ? '🟨' : '🟥'} 
          Completude do cadastro
        </div>
        <div className="card-body">
          <p><span>Nome do proprietário:</span> <span>✅ Preenchido</span></p>
          <p><span>CPF/CNPJ:</span> <span>✅ Preenchido</span></p>
          <p><span>Documento do imóvel:</span> <span>{property.documentStatus === 'present' ? '✅ Preenchido' : '⚠️ Ausente'}</span></p>
          <p><span>Coordenadas do perímetro:</span> <span>{property.perimeterCoordinates === 'present' ? '✅ Preenchido' : '⚠️ Ausente'}</span></p>
          <p><span>Módulo fiscal declarado:</span> <span>{property.moduloFiscal === 'present' ? '✅ Preenchido' : '⚠️ Ausente'}</span></p>
        </div>
        <div className="card-footer">
          <div className="card-message">
            <strong>Situação: {cadastralResult.status === 'regular' ? 'Completo' : 'Incompleto'}</strong><br/>
            {cadastralResult.message}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <h3>Mapa resumo do imóvel</h3>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Visualização simples do polígono do imóvel
        </p>
        <div className="map-container">
          <MapContainer center={[centerLat, centerLng]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polygon 
              positions={property.polygon} 
              pathOptions={{ 
                color: hasInconsistencies ? 'var(--danger)' : 'var(--success)', 
                fillOpacity: 0.4 
              }} 
            />
          </MapContainer>
        </div>
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Esta carta foi gerada automaticamente com os dados do SICAR. 
          Ela não substitui análise técnica do órgão ambiental.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }} className="no-print">
          <button className="btn" onClick={handleDownloadPDF} style={{ width: 'auto' }}>
            <Download size={20} />
            Baixar em PDF
          </button>
          
          <a href={`https://wa.me/?text=${encodeURIComponent(`Veja a Carta do Imóvel da Fazenda ${property.ownerName} (CAR: ${property.carNumber}): https://cyberchristian92.github.io/Hacarton-Carta-do-imovel/`)}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: 'auto', textDecoration: 'none' }}>
            <Share2 size={20} />
            Compartilhar com meu técnico
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
