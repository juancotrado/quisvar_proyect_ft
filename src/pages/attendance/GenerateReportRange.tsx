import * as ExcelJS from 'exceljs';
import { contarStatus } from './ContarStatus';
import { AttendanceRange } from '../../types/types';
interface GenerateReportProps {
  startDate: string;
  endDate: string;
  printData: AttendanceRange[];
}
export async function generateReportRange({
  startDate,
  endDate,
  printData,
}: GenerateReportProps) {
  const response = await fetch('/templates/list_template.xlsx');
  const buffer = await response.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const wk = workbook.getWorksheet('Hoja1');

  let rowNumber = 6;

  wk.getCell('B3').value = `LISTA PERDIODO # DEL ${startDate} AL ${endDate}`;
  const getPrice = (counts: any) => {
    const T = 0.5;
    const F = 10;
    const G = 20;
    const M = 80;
    const result =
      T * counts.TARDE +
      F * counts.SIMPLE +
      G * counts.GRAVE +
      M * counts.MUY_GRAVE;
    return result;
  };
  const moneyFormat =
    '_-"S/"* #,##0.00_-;-"S/"* #,##0.00_-;_-"S/"* "-"??_-;_-@_-';
  printData.forEach((data: AttendanceRange, idx: number) => {
    const counts = contarStatus(data);
    const dataRows = wk.insertRow(rowNumber, [
      null,
      idx + 1,
      '000',
      data.profile.lastName + ' ' + data.profile.firstName,
      data.profile.dni,
      data.profile.phone,
      counts.PUNTUAL,
      counts.TARDE,
      counts.SIMPLE,
      counts.GRAVE,
      counts.MUY_GRAVE,
      counts.PERMISO,
      getPrice(counts),
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
    dataRows.getCell('G').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'E2EFDA' },
    };
    dataRows.getCell('H').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'F8CBAD' },
    };
    dataRows.getCell('I').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFCCCC' },
    };
    dataRows.getCell('J').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0000' },
    };
    dataRows.getCell('K').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'C00000' },
    };
    dataRows.getCell('L').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'DDEBF7' },
    };
    dataRows.getCell('M').numFmt = moneyFormat;
    dataRows.getCell('M').font = {
      color: { argb: 'FF0000' },
    };
    rowNumber++;
  });
  const endLine = rowNumber;
  wk.pageSetup.printArea = 'A1:M' + (endLine + 13);
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
