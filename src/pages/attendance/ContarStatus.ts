import { AttendanceRange, userAttendance } from '../../types/types';

export function contarStatus(data: AttendanceRange) {
  let puntualCount = 0;
  let tardeCount = 0;
  let simpleCount = 0;
  let graveCount = 0;
  let mgraveCount = 0;
  let permisoCount = 0;

  data?.list.forEach((item: userAttendance) => {
    switch (item.status) {
      case 'PUNTUAL':
        puntualCount++;
        break;
      case 'TARDE':
        tardeCount++;
        break;
      case 'SIMPLE':
        simpleCount++;
        break;
      case 'GRAVE':
        graveCount++;
        break;
      case 'MUY_GRAVE':
        mgraveCount++;
        break;
      case 'PERMISO':
        permisoCount++;
        break;
      default:
        // Manejar otros estados si es necesario
        break;
    }
  });

  // Retornar un objeto con las cuentas
  return {
    PUNTUAL: puntualCount,
    TARDE: tardeCount,
    SIMPLE: simpleCount,
    GRAVE: graveCount,
    MUY_GRAVE: mgraveCount,
    PERMISO: permisoCount,
  };
}
