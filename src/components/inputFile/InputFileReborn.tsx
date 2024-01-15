import React, { useState } from 'react';
const InputFileReborn = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log(files);
    if (files) {
      const fileList = Array.from(files);
      setSelectedFiles(fileList);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Archivos seleccionados:', selectedFiles);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" multiple onChange={handleFileChange} />
      <button type="submit">Enviar archivos</button>
    </form>
  );
};

export default InputFileReborn;
