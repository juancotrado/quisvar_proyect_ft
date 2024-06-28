import { useContext } from 'react';
import {
  URL,
  axiosInstance,
} from '../../../../../../../../services/axiosInstance';
import { FileTask, Files } from '../../../../../../../../types';
import { SocketContext } from '../../../../../../../../context';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../../../../../../store';
import './SubtaskFile.css';
import { Button } from '../../../../../../../../components';
import { downloadHref, normalizeFileName } from '../../../../../../../../utils';
import TaskFileTemplate from './TaskFileTemplate';
interface SubtaskFileProps {
  files: FileTask[];
  // typeFile?: FileType;
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
  // typeFile = 'MODEL',
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

  const handleLink = (file: FileTask) => {
    const urlFile = `${URL}/${normalizeUrlFile(file.dir)}/${file.name}`;
    downloadHref(urlFile, file.name, true);
  };

  return (
    <div className={` subtaskFile ${className}`}>
      {files?.map(file => (
        <TaskFileTemplate
          name={file.originalname}
          key={file.id}
          onDeleteFile={() => deleteFile(file.id)}
          onClick={() => handleLink(file)}
          icon={getIcon(file.name)}
          showDeleteBtn={showDeleteBtn}
        />
      ))}
    </div>
  );
};

export default SubtaskFile;
