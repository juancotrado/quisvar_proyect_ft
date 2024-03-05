import { millisecondsToDays } from '../../../../../utils';
import { PhaseData } from '../pages/detailsContracts/models';

export const getStatusContract = (createdAt: string, phases: string) => {
  const phasesParse: PhaseData[] = JSON.parse(phases);
  const findPhase = phasesParse.find(phase => phase.isActive);
  if (!findPhase) return 'grey';
  const dayPhase = findPhase?.days ?? 0;
  const contractSigningDate = new Date(createdAt);
  const actualDate = new Date();
  contractSigningDate.setDate(
    contractSigningDate.getDate() + Number(dayPhase) + 1
  );
  const daysDifference = millisecondsToDays(
    contractSigningDate.valueOf() - actualDate.valueOf()
  );
  if (Math.sign(daysDifference) === -1) return 'red';
  if (daysDifference - 14 < 0) return 'yellow';
  return 'green';
};
