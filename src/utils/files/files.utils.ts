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

export const listStatusMsg: { id: MessageStatus }[] = [
  { id: 'ARCHIVADO' },
  { id: 'FINALIZADO' },
  { id: 'GUARDADO' },
  { id: 'PROCESO' },
  { id: 'RECHAZADO' },
];

export const radioOptions = [
  { id: 'Carta', value: 'CARTA', name: 'type' },
  { id: 'Informe', value: 'INFORME', name: 'type' },
  { id: 'Memorandum', value: 'MEMORANDUM', name: 'type' },
  { id: 'Acuerdo', value: 'ACUERDO', name: 'type' },
  { id: 'Oficio', value: 'OFICIO', name: 'type' },
  { id: 'Coordinación', value: 'COORDINACION', name: 'type' },
];

export const HashFile = (name: string) => {
  const newValue = name.split(' ');
  const parseValue = newValue.map(value => value.slice(0, 1).toUpperCase());
  return parseValue.join('');
};
