import { useContext } from 'react';
import { URL, axiosInstance } from '../../../services/axiosInstance';
import { Files } from '../../../types/types';
import { SocketContext } from '../../../context/SocketContex';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import './SubtaskFile.css';
import Button from '../../shared/button/Button';
interface SubtaskFileProps {
  files: Files[];
  typeFile?: 'REVIEW' | 'MATERIAL' | 'SUCCESSFUL';
  showDeleteBtn?: boolean;
  className?: string;
  showDeleteBtnByUserAuth?: boolean;
}

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
      .then(res => socket.emit('client:update-subTask', res.data));
  };

  const normalizeUrlFile = (url: string, status: string) => {
    if (!url) return;
    const valueReplace =
      status === 'SUCCESSFUL'
        ? './uploads'
        : status === 'REVIEW'
        ? './file_review'
        : './file_model';
    const newValueReplace =
      status === 'SUCCESSFUL'
        ? 'static'
        : status === 'REVIEW'
        ? 'review'
        : 'models';
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
              {/* {file.type !== 'MATERIAL' && (
                <span className="subtaskFile-username">
                  {file.user?.profile?.firstName} :
                </span>
              )} */}
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
