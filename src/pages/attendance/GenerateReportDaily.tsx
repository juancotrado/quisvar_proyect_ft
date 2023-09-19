import * as ExcelJS from 'exceljs';
import { AttendanceRange } from '../../types/types';
interface GenerateReportDailyProps {
  startDate: string;
  printData: AttendanceRange[];
}

export async function generateReportDaily({
  startDate,
  printData,
}: GenerateReportDailyProps) {
  const response = await fetch('/templates/list_daily_template.xlsx');
  const buffer = await response.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const wk = workbook.getWorksheet('Hoja1');

  let rowNumber = 6;

  wk.getCell('B3').value = `LISTA PERDIODO # DEL ${startDate}`;

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

    const orderCalls = [
      'primer llamado',
      'segundo llamado',
      'tercero llamado',
      'cuarto llamado',
      'quinto llamado',
      'sexto llamado',
    ];

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

  const getColor = (status: string) => {
    if (status === 'P') return '87E4BD';
    if (status === 'T') return 'FFE17F';
    if (status === 'F') return 'F8C5C5';
    if (status === 'G') return 'F19191';
    if (status === 'M') return 'D2595B';
    if (status === 'L') return '83A8F0';
  };
  printData.forEach((data: AttendanceRange, idx: number) => {
    const _getStatus = getStatus(data);
    const dataRows = wk.insertRow(rowNumber, [
      null,
      idx + 1,
      '000',
      data.profile.lastName + ' ' + data.profile.firstName,
      data.profile.dni,
      data.profile.phone,
      ..._getStatus,
    ]);
    const columnLetters = 'BCDEFGHIJKL';
    columnLetters.split('').forEach(columnLetter => {
      const cell = dataRows.getCell(columnLetter);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    const fillColors = 'GHIJKL';
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
  wk.pageSetup.printArea = 'A1:L' + (endLine + 9);
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
