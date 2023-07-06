import { ChangeEvent, useContext } from 'react';
import { FileInfo, fyleType } from '../../../types/types';
import { axiosInstance } from '../../../services/axiosInstance';
import { SocketContext } from '../../../context/SocketContex';
import './subtaskUploadFiles.css';
interface SubtaskUploadFilesProps {
  type: fyleType;
  id: number;
  addFiles?: (values: FileInfo[]) => void;
}

const SubtaskUploadFiles = ({
  id,
  type,
  addFiles,
}: SubtaskUploadFilesProps) => {
  const socket = useContext(SocketContext);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (type === 'REVIEW' && addFiles) {
      const fileList: FileInfo[] = Array.from(files);
      addFiles(fileList);
      return;
    }
    const formdata = new FormData();
    for (const i in files) {
      formdata.append('files', files[i]);
    }
    // const file = formdata.get('file');
    axiosInstance
      .post(`/files/uploads/${id}/?status=${type}`, formdata)
      .then(res => {
        // if (file instanceof File && file.type === 'application/pdf')
        //   localStorage.setItem('hasPdf', JSON.stringify(true));
        socket.emit('client:update-subTask', res.data);
      });
  };
  return (
    <div className="subtaskUploadFiles-area">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="subtaskUploadFiles-input"
      />

      <p className="subtaskUploadFiles-text">
        Arrastra o Selecciona un archivo
      </p>
    </div>
  );
};

export default SubtaskUploadFiles;
