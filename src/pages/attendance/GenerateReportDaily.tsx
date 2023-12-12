import * as ExcelJS from 'exceljs';
import { AttendanceRange } from '../../types/types';
import formatDate from '../../utils/formatDate';
interface GenerateReportDailyProps {
  startDate: string;
  printData: AttendanceRange[];
}
const orderCalls = [
  'primer llamado',
  'segundo llamado',
  'tercer llamado',
  'cuarto llamado',
  'quinto llamado',
  'sexto llamado',
  'sétimo llamado',
];
export async function generateReportDaily({
  startDate,
  printData,
}: GenerateReportDailyProps) {
  // console.log(printData);

  const response = await fetch('/templates/list_daily_template.xlsx');
  const buffer = await response.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const wk = workbook.getWorksheet('Hoja1');

  let rowNumber = 6;
  const parseDate = (value?: string) => {
    const dailyDate = new Date(value ? value : new Date());
    dailyDate.setDate(dailyDate.getDate() + 1);
    return formatDate(dailyDate, {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  };
  wk.getCell('B3').value = `LISTA DE ASISTENCIA DEL ${parseDate(startDate)}`;

  const getStatus = (data: AttendanceRange) => {
    const mapStates = {
      PUNTUAL: 'P',
      TARDE: 'T',
      SIMPLE: 'F',
      GRAVE: 'G',
      MUY_GRAVE: 'M',
      PERMISO: 'L',
    };

    const orderedStatus: string[] = [];

    orderCalls.forEach(call => {
      const estadoEncontrado = data.list.find(item => item.list.title === call);
      if (estadoEncontrado) {
        const inicialEstado =
          (mapStates as Record<string, string>)[estadoEncontrado.status] || ' ';
        orderedStatus.push(inicialEstado);
      } else {
        orderedStatus.push(' ');
      }
    });

    return orderedStatus;
  };

  // const getTimers = (data: AttendanceRange) => {
  //   const orderedTimers: string[] = [];

  //   orderCalls.forEach(call => {
  //     const estadoEncontrado = data.list.find(item => item.list.title === call);

  //     if (estadoEncontrado) {
  //       orderedTimers.push(estadoEncontrado.list.timer);
  //     }
  //   });

  //   return orderedTimers;
  // };
  const filterdUsers: AttendanceRange[] = printData.filter(
    user => user?.list.length !== 0
  );
  const timerCells = 'GHIJKLM';
  timerCells.split('').forEach((cell, index) => {
    // const timer = getTimers(filterdUsers[0]);
    wk.getCell(`${cell}5`).value = index + 1;
  });
  const getColor = (status: string) => {
    if (status === 'P') return '87E4BD';
    if (status === 'T') return 'FFE17F';
    if (status === 'F') return 'F8C5C5';
    if (status === 'G') return 'F19191';
    if (status === 'M') return 'D2595B';
    if (status === 'L') return '83A8F0';
  };

  filterdUsers.forEach((data: AttendanceRange, idx: number) => {
    const _getStatus = getStatus(data);
    const dataRows = wk.insertRow(rowNumber, [
      null,
      idx + 1,
      data.profile.room ?? '000',
      data.profile.lastName + ' ' + data.profile.firstName,
      data.profile.dni,
      data.profile.phone,
      ..._getStatus,
    ]);
    const columnLetters = 'BCDEFGHIJKLM';
    columnLetters.split('').forEach(columnLetter => {
      const cell = dataRows.getCell(columnLetter);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    const fillColors = 'GHIJKLM';
    for (let i = 0; i < _getStatus.length; i++) {
      const columnFill = fillColors[i];
      const cell = dataRows.getCell(columnFill);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: getColor(_getStatus[i]) },
      };
    }
    rowNumber++;
  });
  const endLine = rowNumber;
  wk.pageSetup.printArea = 'A1:M' + (endLine + 9);
  workbook.xlsx.writeBuffer().then(data => {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'download.xlsx';
    anchor.click();
    window.URL.revokeObjectURL(url);
  });
}
