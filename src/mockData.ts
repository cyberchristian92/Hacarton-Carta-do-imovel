export interface PropertyData {
  carNumber: string;
  ownerName: string;
  cpf: string;
  municipality: string;
  state: string;
  bioma: string;
  totalArea: number; // hectares
  documentStatus: 'present' | 'absent';
  perimeterCoordinates: 'present' | 'absent';
  moduloFiscal: 'present' | 'absent';
  
  // Reserva Legal
  rlDeclaredPercentage: number;
  
  // APP
  rivers: { name: string; width: number; declaredApp: number }[];
  
  // Map Data (mock GeoJSON or simple coords)
  polygon: [number, number][]; // [lat, lng] arrays for Leaflet
}

export const mockProperties: Record<string, PropertyData> = {
  'SP-1234567-89ABCDEF0123456789ABCDEF01234567': {
    carNumber: 'SP-1234567-89ABCDEF0123456789ABCDEF01234567',
    ownerName: 'José da Silva',
    cpf: '111.222.333-44',
    municipality: 'Ribeirão Preto',
    state: 'SP',
    bioma: 'Cerrado',
    totalArea: 50,
    documentStatus: 'absent',
    perimeterCoordinates: 'present',
    moduloFiscal: 'present',
    rlDeclaredPercentage: 18, // deficit for cerrado
    rivers: [
      { name: 'Córrego das Pedras', width: 6, declaredApp: 12 } // 6m width -> 30m required, declared 12m -> deficit
    ],
    polygon: [
      [-21.1704, -47.8103],
      [-21.1704, -47.8003],
      [-21.1804, -47.8003],
      [-21.1804, -47.8103]
    ]
  },
  'MT-9876543-FEDCBA9876543210FEDCBA9876543210': {
    carNumber: 'MT-9876543-FEDCBA9876543210FEDCBA9876543210',
    ownerName: 'Maria Oliveira',
    cpf: '999.888.777-66',
    municipality: 'Sorriso',
    state: 'MT',
    bioma: 'Amazônia',
    totalArea: 200,
    documentStatus: 'present',
    perimeterCoordinates: 'present',
    moduloFiscal: 'present',
    rlDeclaredPercentage: 80, // regular
    rivers: [
      { name: 'Rio Verde', width: 20, declaredApp: 50 } // 20m width -> 50m required, declared 50m -> regular
    ],
    polygon: [
      [-12.5502, -55.7289],
      [-12.5502, -55.7189],
      [-12.5602, -55.7189],
      [-12.5602, -55.7289]
    ]
  }
};
