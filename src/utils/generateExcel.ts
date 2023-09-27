import { ProjectReport, ExcelData, UserAttendance } from '../types/types';
import * as ExcelJS from 'exceljs';
import { getTimeOut, parseUTC } from './formatDate';
import {
  borderReportStyle,
  exportExcel,
  fillRows,
  formatExcelStyle,
  getPrice,
  moneyFormat,
} from './excelGenerate/utils/excelTools';

const excelReport = async (
  data: ProjectReport[],
  infoData: ExcelData,
  attendance: UserAttendance
) => {
  // Cargar la plantilla desde un archivo
  const response = await fetch('/templates/report_templateV4.xlsx');
  const buffer = await response.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  // Obtener la hoja de cálculo
  const wk = workbook.getWorksheet('PERIDO 18');
  const wk1 = workbook.addWorksheet('sheet');
  // Insertar contenido en las celdas
  wk1.getCell('A1').value = 'Contenido en A1';
  wk1.getCell('A10').value = 'Contenido en A10';

  // Configurar un salto de página después de la fila 10 (A10)
  wk1.getRow(10).addPageBreak(1, 4);

  wk.getCell('C1').value = infoData.title;
  wk.getCell('D4').value = infoData.manager.toUpperCase();
  wk.getCell('D9').value = infoData.concept.toUpperCase();
  wk.getCell('D13').value = infoData.degree;
  wk.getCell('H12').value = infoData.remote;
  wk.getCell('D7').value =
    `${infoData.firstName} ${infoData.lastName}`.toUpperCase();
  wk.getCell('D11').value = infoData.dni;
  wk.getCell('D12').value = +infoData.phone;
  wk.getCell('D15').value = infoData.initialDate;
  wk.getCell('D16').value = infoData.untilDate;
  wk.getCell('H19').value = {
    formula: `${infoData.totalDays}*1000/30`,
    date1904: false,
  };

  let rowNumber = 28;
  data.forEach(project => {
    const projectRow = wk.insertRow(rowNumber, [
      null,
      project.district,
      project.name.toUpperCase(),
    ]);

    projectRow.font = {
      bold: true,
      color: { argb: 'F50000' },
    };
    borderReportStyle(projectRow);

    fillRows(projectRow, 2, 10, 'D9E1F2');

    rowNumber++;
    project.subtasks.forEach(subTask => {
      const subtaskRow = wk.insertRow(rowNumber, [
        null,
        subTask.item,
        subTask.name.toUpperCase(),
        +subTask.price,
        parseUTC(subTask.assignedAt || ''),
        parseUTC(subTask.untilDate || ''),
        subTask.percentage / 100,
        project.percentage / 100,
        null,
        getTimeOut(subTask.assignedAt || '', subTask.untilDate || '') +
          ' Horas',
      ]);
      borderReportStyle(subtaskRow);
      subtaskRow.getCell('I').value = {
        formula: `=+D${rowNumber}*G${rowNumber}`,
        date1904: false,
      };
      formatExcelStyle({
        row: subtaskRow,
        positions: 'ID',
        format: moneyFormat,
      });
      formatExcelStyle({
        row: subtaskRow,
        positions: 'GH',
        format: '0%',
      });
      rowNumber++;
    });
  });
  const endLine = rowNumber;

  const sumTotalCell = 'I' + (endLine + 2);
  wk.getCell(sumTotalCell).value = {
    formula: `SUM(I28:I${endLine})`,
    date1904: false,
  };
  const salaryAdvanceCell = 'I' + (endLine + 3);
  wk.getCell(salaryAdvanceCell).value = {
    formula: `${sumTotalCell}*${infoData.advancePorcentage}/100`,
    date1904: false,
  };
  wk.getCell('I' + (endLine + 4)).value = getPrice(attendance);
  wk.getCell('I' + (endLine + 6)).value = {
    formula: `${salaryAdvanceCell}-I${endLine + 4}-I${endLine + 5}`,
    date1904: false,
  };
  wk.getCell(`I${endLine + 7}`).value = {
    formula: `${sumTotalCell}-${salaryAdvanceCell}`,
    date1904: false,
  };
  wk.getCell('H18').value = {
    formula: `=${salaryAdvanceCell}`,
    date1904: false,
  };
  wk.mergeCells(`H${endLine + 10}:I${endLine + 10}`);
  wk.mergeCells(`H${endLine + 11}:I${endLine + 11}`);
  const dniFinishcell = wk.getCell(`H${endLine + 10}`);
  dniFinishcell.value = 'DNI: ' + infoData.dni;
  dniFinishcell.font = {
    bold: true,
  };
  dniFinishcell.border = {
    top: { style: 'medium' },
  };
  dniFinishcell.alignment = { vertical: 'middle', horizontal: 'center' };
  const fullNameCell = wk.getCell(`H${endLine + 11}`);
  fullNameCell.value = infoData.firstName + ' ' + infoData.lastName;
  fullNameCell.alignment = {
    vertical: 'middle',
    horizontal: 'center',
  };

  wk.pageSetup.printArea = 'A1:K' + (endLine + 13);
  exportExcel('userReport', workbook);
};

export { excelReport };
