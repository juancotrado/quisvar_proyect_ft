import * as ExcelJS from 'exceljs';
import colors from '../json/colorsExcel.json';

import { Level } from '../../types/types';
import {
  borderProjectStyle,
  exportExcel,
  fillRows,
  fontExcelStyle,
  formatExcelStyle,
  moneyFormat,
} from './utils/excelTools';

interface InfoDataReport {
  department: string;
  district: string;
  province: string;
  initialDate: string;
  finishDate: string;
  fullName: string;
  description: string;
  CUI: string;
}
const reportLvl = {
  indexTasks: 'Area',
  areas: 'proyecto',
  tasks: 'Nivel 1',
  tasks_2: 'Nivel2',
  tasks_3: 'nivel3',
};
const reportColorFirst = {
  areas: 'D9E1F2',
  indexTasks: 'FF666F88',
  tasks: 'FF788199',
  tasks_2: 'FF8990A2',
  tasks_3: 'FFA3A8B7',
};
const reportColorSecond = {
  areas: 'FF666F88',
  indexTasks: 'FF788199',
  tasks: 'FF8990A2',
  tasks_2: 'FFA3A8B7',
  tasks_3: 'FFB5BAC9',
};
const reporTitle = {
  areas: 'INFORME PARCIAL DEL PROYECTO',
  indexTasks: 'INFORME PARCIAL DEL AREA',
  tasks: 'INFORME PARCIAL DEL NIVEL',
  tasks_2: 'INFORME PARCIAL DEL NIVEL',
  tasks_3: 'INFORME PARCIAL DEL PROYECTO',
};
const reportCoordinator = {
  areas: 'CC  COORDINADOR DEL PROYECTO : ',
  indexTasks: 'CC  COORDINADOR DEL AREA : ',
  tasks: 'CC  COORDINADOR DEL AREA :',
  tasks_2: 'CC  COORDINADOR DEL AREA :',
  tasks_3: 'CC  COORDINADOR DEL AREA :',
};
const excelSimpleReport = async (
  data: Level,
  infoData: InfoDataReport,
  option: 'indexTasks' | 'areas' | 'tasks' | 'tasks' | 'tasks_3'
) => {
  const response = await fetch('/templates/report_template_project.xlsx');
  const buffer = await response.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const wk = workbook.getWorksheet('REPORTE');

  wk.getCell(
    'C1'
  ).value = `INFORME PARCIAL DEL PROYECTO: ${infoData.description}-${infoData.CUI} `;
  wk.getCell('C5').value = reportCoordinator[option];
  wk.getCell('D5').value = infoData.fullName;
  wk.getCell('D7').value = infoData.department;
  wk.getCell('D8').value = infoData.province;
  wk.getCell('D9').value = infoData.district;
  wk.getCell('D11').value = infoData.initialDate;
  wk.getCell('D12').value = infoData.finishDate;
  let rowNumber = 21;
  //   const { LIQUIDATION } = data.details;
  //   //   const totalProcesstask = PROCESS + DENIED + INREVIEW;
  //   const projectRow = wk.insertRow(rowNumber, [
  //     '',
  //     reportLvl[option],
  //     data.name,
  //     data.balance,
  //     data.spending,
  //     data.price,
  //     data.percentage,
  //     data.days,
  //     data.total,
  //     LIQUIDATION,
  //   ]);
  //   rowNumber++;
  //   fillRows(projectRow, 2, 10, colors[0]);
  //   borderProjectStyle(projectRow);
  //   formatExcelStyle({ row: projectRow, positions: 'DEF', format: moneyFormat });
  //   fontExcelStyle({
  //     row: projectRow,
  //     positions: 'BCDEFGHIJ',
  //     color: 'FF000000',
  //     isBold: true,
  //     size: 9,
  //     name: 'Century Gothic',
  //   });
  //   const dataReport = data[option] as Report[];
  //   if (data.nextLevel) {
  rowNumber = recursionProject(wk, [data], rowNumber);
  //   }
  wk.pageSetup.printArea = 'A1:K' + (rowNumber + 3);

  exportExcel('project-report', workbook);
};

const recursionProject = (
  wk: ExcelJS.Worksheet,
  dataRows: Level[],
  rowNumber: number
) => {
  dataRows.forEach(dataRow => {
    // const { DONE, LIQUIDATION } = dataRow.details;
    const indexLevel = dataRow.level || 0;

    const row = wk.insertRow(rowNumber, [
      null,
      dataRow.item,
      dataRow.name,
      dataRow.balance,
      dataRow.spending,
      dataRow.price,
      dataRow.percentage / 100,
      dataRow.days,
      dataRow.total,
      indexLevel,
    ]);
    borderProjectStyle(row);
    fillRows(row, 2, 10, colors[indexLevel]);
    formatExcelStyle({ row, positions: 'DEF', format: moneyFormat });
    formatExcelStyle({ row, positions: 'G', format: '0%' });
    fontExcelStyle({
      row,
      positions: 'BCDEFGHIJ',
      color: 'FFFFFF',
      isBold: true,
      size: 8,
      name: 'Century Gothic',
    });
    rowNumber++;
    if (dataRow.nextLevel) {
      rowNumber = recursionProject(wk, dataRow.nextLevel, rowNumber);
    }
  });
  return rowNumber;
};
export { excelSimpleReport };
