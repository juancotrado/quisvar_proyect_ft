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
