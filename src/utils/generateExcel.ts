import { ProjectReport, ExcelData, Report } from '../types/types';
import * as ExcelJS from 'exceljs';
import { getTimeOut, parseUTC } from './formatDate';
interface FontExcelStyle {
  row: ExcelJS.Row;
  positions: string;
  color: string;
  isBold: boolean;
  size: number;
  name: string;
}
interface formatExcelStyle {
  row: ExcelJS.Row;
  positions: string;
  format: string;
}
interface InfoDataReport {
  department: string;
  district: string;
  province: string;
  initialDate: string;
  finishDate: string;
  fullName: string;
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
const moneyFormat =
  '_-"S/"* #,##0.00_-;-"S/"* #,##0.00_-;_-"S/"* "-"??_-;_-@_-';
const excelReport = async (data: ProjectReport[], infoData: ExcelData) => {
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
  wk.getCell('D13').value = infoData.charge;
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
    projectRow.getCell('B').border = {
      left: { style: 'medium' },
      right: { style: 'medium' },
    };
    projectRow.getCell('J').border = {
      left: { style: 'thin' },
      right: { style: 'medium' },
    };
    projectRow.getCell('D').border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
    projectRow.getCell('F').border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
    projectRow.getCell('H').border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
    for (let col = 2; col <= 10; col++) {
      const projectCell = projectRow.getCell(col);
      projectCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9E1F2' },
      };
    }
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
        +infoData.advancePorcentage / 100,
        null,
        getTimeOut(subTask.assignedAt || '', subTask.untilDate || '') +
          ' Horas',
      ]);
      subtaskRow.getCell('B').border = {
        left: { style: 'medium' },
        right: { style: 'medium' },
      };
      subtaskRow.getCell('J').border = {
        left: { style: 'thin' },
        right: { style: 'medium' },
      };
      subtaskRow.getCell('D').border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      subtaskRow.getCell('F').border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      subtaskRow.getCell('H').border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      subtaskRow.getCell('C').font = {
        bold: true,
        color: { argb: '4472C4' },
      };
      subtaskRow.getCell('I').value = {
        formula: `=+D${rowNumber}*G${rowNumber}`,
        date1904: false,
      };
      subtaskRow.getCell('I').numFmt = moneyFormat;
      subtaskRow.getCell('D').numFmt = moneyFormat;
      subtaskRow.getCell('G').numFmt = '0%';
      subtaskRow.getCell('H').numFmt = '0%';
      rowNumber++;
    });
  });
  const endLine = rowNumber;

  const sumTotalCell = 'I' + (endLine + 2);
  wk.getCell(sumTotalCell).value = {
    formula: `SUM(I28:G${endLine})`,
    date1904: false,
  };
  const salaryAdvanceCell = 'I' + (endLine + 3);
  wk.getCell(salaryAdvanceCell).value = {
    formula: `${sumTotalCell}*${infoData.advancePorcentage}/100`,
    date1904: false,
  };
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
const excelSimpleReport = async (
  data: Report,
  infoData: InfoDataReport,
  option: 'indexTasks' | 'areas' | 'tasks' | 'tasks' | 'tasks_3'
) => {
  const response = await fetch('/templates/report_template_project.xlsx');
  const buffer = await response.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  // Obtener la hoja de cálculo
  const wk = workbook.getWorksheet('REPORTE');

  wk.getCell('C1').value = reporTitle[option];
  wk.getCell('C5').value = reportCoordinator[option];
  wk.getCell('D5').value = infoData.fullName;
  wk.getCell('D7').value = infoData.department;
  wk.getCell('D8').value = infoData.province;
  wk.getCell('D9').value = infoData.district;
  wk.getCell('D11').value = infoData.initialDate;
  wk.getCell('D12').value = infoData.finishDate;
  let rowNumber = 21;
  const { DENIED, DONE, INREVIEW, LIQUIDATION, PROCESS, UNRESOLVED } =
    data.taskInfo;
  const totalProcesstask = PROCESS + DENIED + INREVIEW;
  const projectRow = wk.insertRow(rowNumber, [
    '',
    reportLvl[option],
    data.name,
    data.balance,
    data.spending,
    data.price,
    UNRESOLVED,
    totalProcesstask,
    DONE,
    LIQUIDATION,
  ]);
  rowNumber++;
  fillRows(projectRow, 2, 10, reportColorFirst[option]);
  borderProjectStyle(projectRow);
  formatExcelStyle({ row: projectRow, positions: 'DEF', format: moneyFormat });
  fontExcelStyle({
    row: projectRow,
    positions: 'BCDEFGHIJ',
    color: 'FF000000',
    isBold: true,
    size: 9,
    name: 'Century Gothic',
  });
  const dataReport = data[option] as Report[];
  rowNumber = recursionProject(
    wk,
    dataReport,
    rowNumber,
    reportColorSecond[option]
  );
  wk.pageSetup.printArea = 'A1:K' + (rowNumber + 3);

  exportExcel('project-report', workbook);
};

const fillRows = (
  row: ExcelJS.Row,
  posInit: number,
  posFinish: number,
  color: string
) => {
  for (let col = posInit; col <= posFinish; col++) {
    const projectCell = row.getCell(col);
    projectCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color },
    };
  }
};
const borderProjectStyle = (row: ExcelJS.Row) => {
  row.getCell('B').border = {
    left: { style: 'medium' },
    right: { style: 'medium' },
  };
  row.getCell('D').border = {
    left: { style: 'thin' },
    right: { style: 'thin' },
  };
  row.getCell('F').border = {
    left: { style: 'thin' },
    right: { style: 'thin' },
  };
  row.getCell('H').border = {
    left: { style: 'thin' },
    right: { style: 'thin' },
  };
  row.getCell('J').border = {
    left: { style: 'thin' },
    right: { style: 'medium' },
  };
};
const fontExcelStyle = ({
  row,
  positions,
  color,
  isBold,
  size,
  name,
}: FontExcelStyle) => {
  const splitPositions = positions.split('');
  splitPositions.forEach(pos => {
    row.getCell(pos).font = {
      color: { argb: color },
      bold: isBold,
      size,
      name,
    };
  });
};
const formatExcelStyle = ({ row, positions, format }: formatExcelStyle) => {
  const splitPositions = positions.split('');
  splitPositions.forEach(pos => {
    row.getCell(pos).numFmt = format;
  });
};
const recursionProject = (
  wk: ExcelJS.Worksheet,
  dataRows: Report[],
  rowNumber: number,
  colorARGB: string
) => {
  dataRows.forEach(dataRow => {
    const { DENIED, DONE, INREVIEW, LIQUIDATION, PROCESS, UNRESOLVED } =
      dataRow.taskInfo;
    const totalProcesstask = PROCESS + DENIED + INREVIEW;
    const row = wk.insertRow(rowNumber, [
      null,
      dataRow.item,
      dataRow.name,
      dataRow.balance,
      dataRow.spending,
      dataRow.price,
      UNRESOLVED,
      totalProcesstask,
      DONE,
      LIQUIDATION,
    ]);
    borderProjectStyle(row);
    fillRows(row, 2, 10, colorARGB);
    formatExcelStyle({ row, positions: 'DEF', format: moneyFormat });
    fontExcelStyle({
      row,
      positions: 'BCDEFGHIJ',
      color: 'FFFFFF',
      isBold: true,
      size: 8,
      name: 'Century Gothic',
    });
    rowNumber++;
    let newDataRow: { data: Report[]; color: string } | null = null;
    if (dataRow.indexTasks?.length) {
      newDataRow = { data: dataRow.indexTasks, color: 'FF788199' };
    }
    if (dataRow.tasks?.length)
      newDataRow = { data: dataRow.tasks, color: 'FF8990A2' };
    if (dataRow.tasks_2?.length)
      newDataRow = { data: dataRow.tasks_2, color: 'FFA3A8B7' };
    if (dataRow.tasks_3?.length)
      newDataRow = { data: dataRow.tasks_3, color: 'FFB5BAC9' };
    if (newDataRow) {
      rowNumber = recursionProject(
        wk,
        newDataRow.data,
        rowNumber,
        newDataRow.color
      );
    }
  });
  return rowNumber;
};
const exportExcel = async (name: string, workbook: ExcelJS.Workbook) => {
  const editedBuffer = await workbook.xlsx.writeBuffer();
  const editedBlob = new Blob([editedBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const editedUrl = URL.createObjectURL(editedBlob);
  const a = document.createElement('a');
  a.href = editedUrl;
  a.download = name;
  a.click();
  URL.revokeObjectURL(editedUrl);
};
export { excelReport, excelSimpleReport };
