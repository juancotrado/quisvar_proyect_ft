import { useContext } from 'react';
import { URL, axiosInstance } from '../../../services/axiosInstance';
import { FileType, Files } from '../../../types/types';
import { SocketContext } from '../../../context/SocketContex';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import './SubtaskFile.css';
import Button from '../../shared/button/Button';
interface SubtaskFileProps {
  files: Files[];
  typeFile?: FileType;
  showDeleteBtn?: boolean;
  className?: string;
  showDeleteBtnByUserAuth?: boolean;
}
const statusMapping = {
  MODEL: './uploads/',
  REVIEW: './file_review',
  UPLOADS: './file_model',
};
const statusToValueMapping = {
  MODEL: '',
  REVIEW: 'review',
  UPLOADS: 'models',
};
const SubtaskFile = ({
  files,
  typeFile,
  showDeleteBtn,
  className,
  showDeleteBtnByUserAuth,
}: SubtaskFileProps) => {
  const { userSession } = useSelector((state: RootState) => state);
  const socket = useContext(SocketContext);

  const normalizeFileName = (name: string) => {
    const indexName = name.indexOf('$');
    return name.slice(indexName + 1);
  };
  const deleteFile = (id: number) => {
    axiosInstance
      .delete(`/files/remove/${id}`)
      .then(res => socket.emit('client:update-task', res.data));
  };

  const normalizeUrlFile = (url: string, status: FileType) => {
    if (!url) return;
    const valueReplace = statusMapping[status];
    const newValueReplace = statusToValueMapping[status];
    return url.replace(valueReplace, newValueReplace);
  };
  return (
    <div className={` subtaskFile ${className}`}>
      {files
        ?.filter(({ type }) =>
          !typeFile
            ? ['REVIEW', 'SUCCESSFUL'].includes(type)
            : type === typeFile
        )
        .map(file => (
          <div key={file.id} className="subtaskFile-contain">
            <a
              href={`${URL}/${normalizeUrlFile(file.dir, file.type)}/${
                file.name
              }`}
              target="_blank"
              className="subtaskFile-anchor"
              download={true}
            >
              <img
                src="/svg/file-download.svg"
                alt="W3Schools"
                className="subtaskFile-icon"
              />
              <span className="subtaskFile-name">
                {normalizeFileName(file.name)}
              </span>
            </a>
            {(showDeleteBtnByUserAuth
              ? userSession.profile.id === file.user.profile.id
              : showDeleteBtn) && (
              <Button
                icon="trash-red"
                onClick={() => deleteFile(file.id)}
                // customOnClick={() => deleteFile(file.id)}
                className="subtaskFile-btn-delete"
              />
            )}
          </div>
        ))}
    </div>
  );
};

export default SubtaskFile;
