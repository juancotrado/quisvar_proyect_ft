import { ContractIndexData } from '../../../../../types';
import { millisecondsToDays } from '../../../../../utils';
import { PhaseData } from '../pages/detailsContracts/models';

export const getStatusContract = (
  createdAt: string | null,
  phases: string,
  contractIndex: ContractIndexData[]
) => {
  const phasesParse: PhaseData[] = JSON.parse(phases);
  const phaseLevel = contractIndex.at(1)?.nextLevel?.[1].nextLevel;
  const findActualIndexPhase = phaseLevel?.find(
    phase => phase?.hasFile === 'no'
  );
  const findPhase = phasesParse.find(
    daPhase => daPhase.id === findActualIndexPhase?.deliverLettersId
  );
  if (!findPhase || !createdAt) return 'grey';
  return getStatusColor(createdAt, findPhase, new Date());
};
export const getStatusColor = (
  createdAt: string,
  phase: PhaseData,
  uploadDate: Date
) => {
  const dayPhase = phase?.realDay ?? 0;
  const contractSigningDate = new Date(createdAt);
  const actualDate = new Date(uploadDate);
  contractSigningDate.setDate(
    contractSigningDate.getDate() + Number(dayPhase) + 1
  );
  const daysDifference = millisecondsToDays(
    contractSigningDate.valueOf() - actualDate.valueOf()
  );
  if (Math.sign(daysDifference) === -1) return 'red';
  if (daysDifference - 14 < 0) return 'yellow';
  return 'skyBlue';
};
