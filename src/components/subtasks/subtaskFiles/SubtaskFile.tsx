import { useContext } from 'react';
import { URL, axiosInstance } from '../../../services/axiosInstance';
import { Files, SubTask } from '../../../types/types';
import ButtonDelete from '../../shared/button/ButtonDelete';
import { SocketContext } from '../../../context/SocketContex';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import './SubtaskFile.css';
interface SubtaskFileProps {
  files: Files[];
  typeFile: 'REVIEW' | 'MATERIAL' | 'SUCCESSFUL';
  showDeleteBtn?: boolean;
  showDeleteBtnByUserAuth?: boolean;
}

const SubtaskFile = ({
  files,
  typeFile,
  showDeleteBtn,
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
      status === 'SUCCESSFUL' ? './uploads' : './file_review';
    const newValueReplace =
      status === 'SUCCESSFUL'
        ? 'uploads'
        : status === 'REVIEW'
        ? 'review'
        : 'models';
    return url.replace(valueReplace, newValueReplace);
  };

  return (
    <div className="subtaskFile">
      {files
        ?.filter(({ type }) => type === typeFile)
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
              <ButtonDelete
                icon="trash-red"
                customOnClick={() => deleteFile(file.id)}
                className="subtaskFile-btn-delete"
              />
            )}
          </div>
        ))}
    </div>
  );
};

export default SubtaskFile;
