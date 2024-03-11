import { ContractPhasesTitle, PayData, PhaseData } from '.';

export const CONTACT_PHASES_TITLE: ContractPhasesTitle[] = [
  {
    type: 'convocationPhase',
    title: 'Fase de convocatorias',
  },
  {
    type: 'ejecutionPhase',
    title: 'Fase de ejecución',
  },
];

export const INIT_VALUES_PHASE: PhaseData = {
  name: '',
  days: 0,
  isActive: false,
  id: '0',
  payData: [],
};
export const INIT_VALUES_PAY: PayData = {
  id: '0',
  description: '',
  percentage: 0,
  amount: 0,
};
