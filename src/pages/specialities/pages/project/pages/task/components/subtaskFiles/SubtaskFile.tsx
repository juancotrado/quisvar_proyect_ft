import { useContext } from 'react';
import {
  URL,
  axiosInstance,
} from '../../../../../../../../services/axiosInstance';
import { FileType, TaskFile } from '../../../../../../../../types';
import { SocketContext } from '../../../../../../../../context';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../../../../../../store';
import './SubtaskFile.css';
import { Button } from '../../../../../../../../components';
import { normalizeFileName } from '../../../../../../../../utils';
interface SubtaskFileProps {
  files: TaskFile;
  typeFile?: FileType;
  showDeleteBtn?: boolean;
  className?: string;
  // showDeleteBtnByUserAuth?: boolean;
}

const iconForExtension = {
  xlsx: 'excel-icon',
  pdf: 'pdf-icon',
  docx: 'word-icon',
  dwg: 'autocad-icon',
  default: 'file-download',
};
const SubtaskFile = ({
  files,
  typeFile = 'MODEL',
  showDeleteBtn,
  className,
}: // showDeleteBtnByUserAuth,
SubtaskFileProps) => {
  // const { id: userSessionId } = useSelector(
  //   (state: RootState) => state.userSession
  // );
  const socket = useContext(SocketContext);

  const deleteFile = (id: number) => {
    axiosInstance
      .delete(`/files/remove/${id}`)
      .then(res => socket.emit('client:update-task', res.data));
  };

  const normalizeUrlFile = (url: string) => {
    if (!url) return;
    const isFinishFile = url.includes('editables') || url.includes('projects');
    if (isFinishFile) {
      const normalizeUrl = url.split('/').slice(3).join('/');
      return `projects/${normalizeUrl}`;
    }
    return url.replace('./uploads/', '');
  };
  const getIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || 'default';
    const getExtencion = iconForExtension[ext as keyof typeof iconForExtension];
    return getExtencion || 'file-download';
  };
  return (
    <div className={` subtaskFile ${className}`}>
      {files[typeFile]?.map(file => (
        <div key={file.id} className="subtaskFile-contain">
          <a
            href={`${URL}/${normalizeUrlFile(file.dir)}/${file.name}`}
            target="_blank"
            className="subtaskFile-anchor"
            download={true}
            title={file.name}
          >
            <img
              src={`/svg/${getIcon(file.name)}.svg`}
              alt="W3Schools"
              className="subtaskFile-icon"
            />
            <span className="subtaskFile-name">
              {normalizeFileName(file.name)}
            </span>
          </a>
          {showDeleteBtn && (
            <Button
              icon="trash-red"
              onClick={() => deleteFile(file.id)}
              variant="ghost"
              iconSize={0.8}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SubtaskFile;
