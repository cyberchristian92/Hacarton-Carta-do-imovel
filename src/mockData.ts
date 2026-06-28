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

// Simple deterministic random based on string hash
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const FIRST_NAMES = ["José", "Maria", "Antônio", "João", "Francisco", "Ana", "Luiz", "Paulo", "Carlos", "Manoel", "Pedro", "Francisca", "Marcos", "Raimundo", "Sebastião"];
const LAST_NAMES = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida"];
const MUNICIPALITIES = [
  { name: 'Ribeirão Preto', state: 'SP', bioma: 'Mata Atlântica' },
  { name: 'Sorriso', state: 'MT', bioma: 'Amazônia' },
  { name: 'Rio Verde', state: 'GO', bioma: 'Cerrado' },
  { name: 'Cascavel', state: 'PR', bioma: 'Mata Atlântica' },
  { name: 'Barreiras', state: 'BA', bioma: 'Cerrado' },
  { name: 'Petrolina', state: 'PE', bioma: 'Caatinga' },
  { name: 'Balsas', state: 'MA', bioma: 'Cerrado' }
];

export function generateDynamicProperty(carNumber: string, cpf?: string): PropertyData {
  const seed = hashString(carNumber);
  
  // Deterministic data generation based on CAR number
  const r1 = seededRandom(seed);
  const r2 = seededRandom(seed + 1);
  const r3 = seededRandom(seed + 2);
  const r4 = seededRandom(seed + 3);
  const r5 = seededRandom(seed + 4);
  const r6 = seededRandom(seed + 5);
  const r7 = seededRandom(seed + 6);

  const loc = MUNICIPALITIES[Math.floor(r1 * MUNICIPALITIES.length)];
  const isRegular = r2 > 0.5; // 50% chance of being generally regular

  // Base coordinates near Brazil center
  const baseLat = -15.0 + (r3 * 10 - 5);
  const baseLng = -50.0 + (r4 * 10 - 5);
  const size = 0.01 + (r5 * 0.05);

  const polygon: [number, number][] = [
    [baseLat, baseLng],
    [baseLat, baseLng + size],
    [baseLat - size, baseLng + size],
    [baseLat - size, baseLng],
  ];

  const totalArea = Math.floor(10 + r6 * 500); // 10 to 510 hectares
  
  let requiredRl = 20;
  if (loc.bioma === 'Amazônia') requiredRl = 80;
  if (loc.bioma === 'Cerrado' && loc.state === 'MT') requiredRl = 35; // simplification

  const rlDeclared = isRegular 
    ? requiredRl + Math.floor(r7 * 10) 
    : Math.max(0, requiredRl - Math.floor(r7 * 15) - 1);

  const riverWidth = 5 + Math.floor(r1 * 40); // 5 to 45 meters
  let requiredApp = 30;
  if (riverWidth >= 10 && riverWidth < 50) requiredApp = 50;
  
  const appDeclared = isRegular
    ? requiredApp + Math.floor(r2 * 10)
    : Math.max(0, requiredApp - Math.floor(r2 * 20) - 1);

  const missingDocs = !isRegular && r3 > 0.7;

  const firstName = FIRST_NAMES[Math.floor(r4 * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(r5 * LAST_NAMES.length)];

  return {
    carNumber: carNumber,
    ownerName: `${firstName} ${lastName}`,
    cpf: cpf || `${Math.floor(100 + r6 * 899)}.${Math.floor(100 + r7 * 899)}.${Math.floor(100 + r1 * 899)}-${Math.floor(10 + r2 * 89)}`,
    municipality: loc.name,
    state: loc.state,
    bioma: loc.bioma,
    totalArea: totalArea,
    documentStatus: missingDocs ? 'absent' : 'present',
    perimeterCoordinates: 'present',
    moduloFiscal: 'present',
    rlDeclaredPercentage: rlDeclared,
    rivers: [
      { 
        name: `Rio ${lastName}`, 
        width: riverWidth, 
        declaredApp: appDeclared 
      }
    ],
    polygon
  };
}

// Keeping the hardcoded ones to not break existing flow perfectly, but they will be generated if not found
export const mockProperties: Record<string, PropertyData> = {
  'SP-1234567-89ABCDEF0123456789ABCDEF01234567': generateDynamicProperty('SP-1234567-89ABCDEF0123456789ABCDEF01234567', '111.222.333-44'),
  'MT-9876543-FEDCBA9876543210FEDCBA9876543210': generateDynamicProperty('MT-9876543-FEDCBA9876543210FEDCBA9876543210', '999.888.777-66')
};
