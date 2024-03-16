import * as ExcelJS from 'exceljs';
import { UserAttendance } from '../../../types/types';
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
interface formatExcelStyleProp {
  row: ExcelJS.Row;
  positions: string;
  format: string;
}
interface mergeCellRange {
  wk: ExcelJS.Worksheet;
  positions: string;
  rowNumber: number;
  rowNumber2?: number;
}
interface BorderExcelStyleWithNumber {
  row: ExcelJS.Row;
  initPosition: number;
  finishPosition: number;
  border: Partial<ExcelJS.Borders>;
  counter?: number;
}
interface FillContractStyleWithNumber {
  row: ExcelJS.Row;
  initPosition: number;
  arrColor: string[][];
  counter?: number;
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
    top: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
    bottom: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
  };
  row.getCell('C').border = {
    top: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
    bottom: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
  };
  row.getCell('D').border = {
    left: { style: 'thin' },
    right: { style: 'thin' },
    top: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
    bottom: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
  };
  row.getCell('E').border = {
    top: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
    bottom: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
  };
  row.getCell('F').border = {
    left: { style: 'thin' },
    right: { style: 'thin' },
    top: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
    bottom: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
  };
  row.getCell('G').border = {
    top: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
    bottom: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
  };
  row.getCell('H').border = {
    left: { style: 'thin' },
    right: { style: 'thin' },
    top: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
    bottom: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
  };
  row.getCell('I').border = {
    top: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
    bottom: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
  };
  row.getCell('J').border = {
    left: { style: 'thin' },
    right: { style: 'medium' },
    top: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
    bottom: {
      style: 'thin',
      color: {
        argb: 'ffffff',
      },
    },
  };
};
export const borderReportStyle = (row: ExcelJS.Row) => {
  row.getCell('B').border = {
    left: { style: 'medium' },
    right: { style: 'medium' },
  };
  row.getCell('J').border = {
    left: { style: 'thin' },
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
};

export const formatExcelStyle = ({
  row,
  positions,
  format,
}: formatExcelStyleProp) => {
  const splitPositions = positions.split('');
  splitPositions.forEach(pos => {
    row.getCell(pos).numFmt = format;
  });
};
export const formatExcelStyleOtherSeparation = ({
  row,
  positions,
  format,
}: formatExcelStyleProp) => {
  const splitPositions = positions.split(',');
  splitPositions.forEach(pos => {
    row.getCell(pos).numFmt = format;
  });
};

export const mergeCellRange = ({
  wk,
  positions,
  rowNumber,
  rowNumber2,
}: mergeCellRange) => {
  const splitPositions = positions.split('');
  splitPositions.forEach(pos => {
    wk.mergeCells(`${pos}${rowNumber}:${pos}${rowNumber2}`);
  });
};
export const mergeCellRangeWithRow = ({
  wk,
  positions,
  rowNumber,
}: mergeCellRange) => {
  const splitPositions = positions.split(',');
  splitPositions.forEach(pos => {
    const [value1, value2] = pos.split('-');
    wk.mergeCells(`${value1}${rowNumber}:${value2}${rowNumber}`);
  });
};

export const borderExcelStyleWithNumber = ({
  row,
  initPosition,
  finishPosition,
  border,
  counter = 1,
}: BorderExcelStyleWithNumber) => {
  for (let i = initPosition; i < finishPosition; i += counter) {
    row.getCell(i).border = border;
    if (counter) {
      row.getCell(i + 1).border = border;
    }
  }
};
export const fillContractStyleWithNumber = ({
  row,
  initPosition,
  arrColor,
}: FillContractStyleWithNumber) => {
  let j = 0;
  for (let i = initPosition; i < arrColor.length * 3 + initPosition; i += 3) {
    row.getCell(i).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: arrColor[j][0] },
    };
    row.getCell(i + 1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: arrColor[j][1] },
    };
    j++;
  }
  // for (let i = initPosition; i < finishPosition; i += 3) {
  //   const [color1, color2] = arrColor;
  //   row.getCell(i).fill = {
  //     type: 'pattern',
  //     pattern: 'solid',
  //     fgColor: { argb: color1 },
  //   };
  //   row.getCell(i + 1).fill = {
  //     type: 'pattern',
  //     pattern: 'solid',
  //     fgColor: { argb: color2 },
  //   };
  // }
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
  //funcion futura para que el reporte se agrega auntomaticamente
  //  isGenerateExcelReport$.setSubject = editedUrl;
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

export const getPrice = (counts: UserAttendance) => {
  const T = 0.5;
  const F = 10;
  const G = 20;
  const M = 80;

  const tarde = counts?.TARDE ?? 0;
  const simple = counts?.SIMPLE ?? 0;
  const grave = counts?.GRAVE ?? 0;
  const muygrave = counts?.MUY_GRAVE ?? 0;

  const result = T * tarde + F * simple + G * grave + M * muygrave;

  return result;
};
