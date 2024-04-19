import { MessageStatus, MessageTypeImbox, fileMesage } from '../../types/types';

export const addFilesList = (fileUploadFiles: File[], newFiles: File[]) => {
  if (!fileUploadFiles) return newFiles;
  const concatFiles = [...fileUploadFiles, ...newFiles];
  const uniqueFiles = Array.from(
    new Set(concatFiles.map(file => file.name))
  ).map(name => concatFiles.find(file => file.name === name)) as File[];
  return uniqueFiles;
};

export const deleteFileOnList = (fileUploadFiles: File[], delFiles: File) => {
  if (fileUploadFiles) {
    const newFiles = Array.from(fileUploadFiles).filter(
      file => file !== delFiles
    );
    if (!newFiles) return;
    return newFiles;
  }
};
export const filterFilesByAttempt = (files: fileMesage[]) => {
  const newFiles = Object.values(countFileByDate(files));
  const keys = Object.keys(countFileByDate(files));
  const data = newFiles.map((files, i) => ({ id: keys[i], files }));
  return data;
};

const countFileByDate = (files: fileMesage[]) => {
  const Obj: { [key: string]: fileMesage[] } = {};
  files.forEach(objeto => {
    const attempt = objeto.attempt;
    if (!Obj[attempt]) Obj[attempt] = [];
    Obj[attempt].push(objeto);
  });
  return Obj;
};

export const listTypeMsg: { id: MessageTypeImbox }[] = [
  { id: 'ACUERDO' },
  { id: 'CARTA' },
  { id: 'COORDINACION' },
  { id: 'INFORME' },
  { id: 'MEMORANDUM' },
  { id: 'OFICIO' },
];

export const listStatusMsg: { id: MessageStatus; label: string }[] = [
  { id: 'FINALIZADO', label: 'FINALIZADO' },
  { id: 'GUARDADO', label: 'GUARDADO' },
  { id: 'PROCESO', label: 'PROCESO' },
  { id: 'RECHAZADO', label: 'RECHAZADO' },
  { id: 'POR_PAGAR', label: 'POR PAGAR' },
];

export const radioOptions = [
  { id: 'CARTA', value: 'CARTA' },
  { id: 'INFORME', value: 'INFORME' },
  { id: 'MEMORANDUM', value: 'MEMORANDUM' },
  { id: 'ACUERDO', value: 'ACUERDO' },
  { id: 'OFICIO', value: 'OFICIO' },
  { id: 'COORDINACION', value: 'COORDINACION' },
];

export const holdingOptions = [
  { id: 'yes', label: 'POR APROBAR' },
  { id: 'no', label: 'APROBADO' },
];

export const HashFile = (name: string) => {
  const newValue = name.split(' ');
  const parseValue = newValue.map(value => value.slice(0, 1).toUpperCase());
  return parseValue.join('');
};
