import { ChangeEvent, useContext } from 'react';
import { axiosInstance } from '../../../../../../../../services/axiosInstance';
import { SocketContext } from '../../../../../../../../context';
import './subtaskUploadFiles.css';
import { FileType } from '../../../../../../../../types';
interface SubtaskUploadFilesProps {
  type: FileType;
  id: number;
  addFiles?: (values: File[]) => void;
  className?: string;
}

const SubtaskUploadFiles = ({
  id,
  type,
  addFiles,
  className,
}: SubtaskUploadFilesProps) => {
  const socket = useContext(SocketContext);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as unknown as File[];
    if (!files) return;
    if (type === 'REVIEW' && addFiles) return addFiles(files);

    const formdata = new FormData();
    for (const file of files) {
      formdata.append('files', file);
    }

    axiosInstance
      .post(`/files/uploads/${id}/?status=${type}`, formdata)
      .then(res => {
        socket.emit('client:update-task', res.data);
      });
  };
  return (
    <div className={`subtaskUploadFiles-area ${className}`}>
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
