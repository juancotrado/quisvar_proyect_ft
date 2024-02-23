import { ContractPhasesTitle, PhaseData } from '.';

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
};
