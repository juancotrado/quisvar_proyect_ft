import { useContext } from 'react';
import { URL, axiosInstance } from '../../../services/axiosInstance';
import { SubTask } from '../../../types/types';
import ButtonDelete from '../../shared/button/ButtonDelete';
import { SocketContext } from '../../../context/SocketContex';

interface SubtaskFileProps {
  subTask: SubTask;
  isAuthorizedMod: boolean;
  isAuthorizedUser: boolean;
  typeFile: 'REVIEW' | 'MATERIAL';
}

const SubtaskFile = ({
  subTask,
  isAuthorizedMod,
  isAuthorizedUser,
  typeFile,
}: SubtaskFileProps) => {
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
    <>
      {subTask.files
        ?.filter(({ type }) => type === typeFile)
        .map(file => (
          <div key={file.id} className="subtask-file-contain">
            <a
              href={`${URL}/${normalizeUrlFile(file.dir, file.type)}/${
                file.name
              }`}
              target="_blank"
              className="subtask-file"
              download={true}
            >
              <span className="subtask-file-username">
                {file.user.profile.firstName} :
              </span>
              <img
                src="/svg/file-download.svg"
                alt="W3Schools"
                className="subtask-file-icon"
              />
              <span className="subtask-file-name">
                {normalizeFileName(file.name)}
              </span>
            </a>
            {(isAuthorizedMod || isAuthorizedUser) &&
              status !== 'DONE' &&
              status !== 'UNRESOLVED' && (
                <ButtonDelete
                  icon="trash-red"
                  customOnClick={() => deleteFile(file.id)}
                  className="subtask-btn-delete-icons"
                />
              )}
          </div>
        ))}
    </>
  );
};

export default SubtaskFile;
