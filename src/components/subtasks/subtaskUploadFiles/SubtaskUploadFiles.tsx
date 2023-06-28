import { ChangeEvent, useContext } from 'react';
import { fyleType } from '../../../types/types';
import { axiosInstance } from '../../../services/axiosInstance';
import { SocketContext } from '../../../context/SocketContex';
import './subtaskUploadFiles.css';
interface SubtaskUploadFilesProps {
  type: fyleType;

  id: number;
}

const SubtaskUploadFiles = ({ id, type }: SubtaskUploadFilesProps) => {
  // const [setHasPdf] = useState(false);
  const socket = useContext(SocketContext);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const formdata = new FormData();
    formdata.append('file', e.target.files[0]);
    const file = formdata.get('file');
    axiosInstance
      .post(`/files/upload/${id}/?status=${type}`, formdata)
      .then(res => {
        if (file instanceof File && file.type === 'application/pdf') {
          console.log('es pdf');
          // setHasPdf(true);
        }
        socket.emit('client:update-subTask', res.data);
      });
  };
  return (
    <div className="subtaskUploadFiles-area">
      <input
        type="file"
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
