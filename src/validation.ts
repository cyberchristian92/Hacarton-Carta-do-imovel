import type { PropertyData } from './mockData';

export interface ValidationResult {
  status: 'regular' | 'attention' | 'inconsistent';
  message: string;
}

export interface AppValidationResult extends ValidationResult {
  riverName: string;
  width: number;
  requiredApp: number;
  declaredApp: number;
  diff: number;
}

export interface RlValidationResult extends ValidationResult {
  requiredPercentage: number;
  declaredPercentage: number;
  diff: number;
}

export interface CadastralValidationResult extends ValidationResult {
  missingFields: string[];
}

export function calculateReservaLegal(property: PropertyData): RlValidationResult {
  let requiredPercentage = 20; // default for most
  if (property.bioma === 'Amazônia') {
    requiredPercentage = 80;
  } else if (property.bioma === 'Cerrado' && property.state === 'MT') { // Simplification
    requiredPercentage = 35;
  }
  
  const declaredPercentage = property.rlDeclaredPercentage;
  const diff = declaredPercentage - requiredPercentage;
  
  if (diff >= 0) {
    return {
      status: 'regular',
      message: 'Reserva Legal em conformidade com o exigido pelo Código Florestal.',
      requiredPercentage,
      declaredPercentage,
      diff
    };
  } else {
    return {
      status: 'inconsistent',
      message: `A Reserva Legal está abaixo do mínimo exigido para o bioma ${property.bioma}. Faltam ${Math.abs(diff)}%.`,
      requiredPercentage,
      declaredPercentage,
      diff
    };
  }
}

export function calculateAPP(property: PropertyData): AppValidationResult[] {
  return property.rivers.map(river => {
    let requiredApp = 30;
    if (river.width >= 10 && river.width < 50) requiredApp = 50;
    else if (river.width >= 50 && river.width < 200) requiredApp = 100;
    else if (river.width >= 200 && river.width < 600) requiredApp = 200;
    else if (river.width >= 600) requiredApp = 500;
    
    const diff = river.declaredApp - requiredApp;
    
    if (diff >= 0) {
      return {
        status: 'regular',
        message: 'APP de hidrografia em conformidade.',
        riverName: river.name,
        width: river.width,
        requiredApp,
        declaredApp: river.declaredApp,
        diff
      };
    } else {
      return {
        status: 'inconsistent',
        message: `O Código Florestal exige ${requiredApp} metros de mata preservada às margens do ${river.name}. Você declarou ${river.declaredApp} metros. Faltam ${Math.abs(diff)} metros para regularizar.`,
        riverName: river.name,
        width: river.width,
        requiredApp,
        declaredApp: river.declaredApp,
        diff
      };
    }
  });
}

export function calculateCadastral(property: PropertyData): CadastralValidationResult {
  const missingFields: string[] = [];
  
  if (property.documentStatus === 'absent') missingFields.push('Documento do imóvel');
  if (property.perimeterCoordinates === 'absent') missingFields.push('Coordenadas do perímetro');
  if (property.moduloFiscal === 'absent') missingFields.push('Módulo fiscal declarado');
  
  if (missingFields.length === 0) {
    return {
      status: 'regular',
      message: 'Todos os dados cadastrais obrigatórios estão preenchidos.',
      missingFields
    };
  } else {
    return {
      status: 'attention',
      message: 'Faltam documentos importantes no seu cadastro. É necessário anexar para evitar notificações.',
      missingFields
    };
  }
}
