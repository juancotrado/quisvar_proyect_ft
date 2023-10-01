import * as ExcelJS from 'exceljs';
import { UserAttendance } from '../../../types/types';
import { isGenerateExcelReport$ } from '../../../services/sharingSubject';
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
interface borderExcelStyleProp {
  row: ExcelJS.Row;
  positions: string;
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
export const borderExcelStyle = ({ row, positions }: borderExcelStyleProp) => {
  const splitPositions = positions.split('');
  splitPositions.forEach(pos => {
    row.getCell(pos).border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
    };
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
  isGenerateExcelReport$.setSubject = editedUrl;
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
  const result =
    T * counts.TARDE +
    F * counts.SIMPLE +
    G * counts.GRAVE +
    M * counts.MUY_GRAVE;
  return result;
};
