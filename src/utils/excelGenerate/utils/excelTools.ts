import * as ExcelJS from 'exceljs';
interface FontExcelStyle {
  row: ExcelJS.Row;
  positions: string;
  color: string;
  isBold: boolean;
  size: number;
  name: string;
}
export const moneyFormat =
  '_-"S/"* #,##0.00_-;-"S/"* #,##0.00_-;_-"S/"* "-"??_-;_-@_-';
interface formatExcelStyle {
  row: ExcelJS.Row;
  positions: string;
  format: string;
}
export const fillRows = (
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
export const borderProjectStyle = (row: ExcelJS.Row) => {
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

export const formatExcelStyle = ({
  row,
  positions,
  format,
}: formatExcelStyle) => {
  const splitPositions = positions.split('');
  splitPositions.forEach(pos => {
    row.getCell(pos).numFmt = format;
  });
};

export const exportExcel = async (name: string, workbook: ExcelJS.Workbook) => {
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
export const fontExcelStyle = ({
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
