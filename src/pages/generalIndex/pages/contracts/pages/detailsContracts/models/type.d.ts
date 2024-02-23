export type ContractPhases = 'ejecutionPhase' | 'convocationPhase';
export interface ContractPhasesTitle {
  type: ContractPhases;
  title: string;
}

export interface PhaseData {
  name: string;
  days: number;
  isActive: boolean;
  id: string;
}
