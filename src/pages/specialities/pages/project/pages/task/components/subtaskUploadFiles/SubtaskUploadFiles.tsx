import { CSSProperties, ChangeEvent, useContext } from 'react';
import { axiosInstance } from '../../../../../../../../services/axiosInstance';
import { SocketContext } from '../../../../../../../../context';
import './subtaskUploadFiles.css';
import { FileType, OptionProject } from '../../../../../../../../types';
import { MdPostAdd } from 'react-icons/md';
import { COLOR_CSS } from '../../../../../../../../utils/cssData';
import { OPTION_PROJECT } from '../../../../models';

interface SubtaskUploadFilesProps {
  type: FileType;
  taskId: number;
  addFiles?: (values: File[]) => void;
  className?: string;
  optionProject?: OptionProject;
  height?: number;
}

const SubtaskUploadFiles = ({
  taskId,
  type,
  addFiles,
  className,
  height,
  optionProject = 'budget',
}: SubtaskUploadFilesProps) => {
  const socket = useContext(SocketContext);

  const style: CSSProperties = { height };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as unknown as File[];
    if (!files) return;
    if (type === 'REVIEW' && addFiles) return addFiles(files);
    const formdata = new FormData();
    for (const file of files) {
      formdata.append('files', file);
    }
    const query = {
      status: type,
    };
    const params = new URLSearchParams(query);
    axiosInstance
      .post(`${OPTION_PROJECT[optionProject].uploadFile}/${taskId}`, formdata, {
        params,
      })
      .then(() => {
        socket.emit(OPTION_PROJECT[optionProject].loadTask, taskId);
      });
  };

  return (
    <div className={`subtaskUploadFiles-area ${className}`} style={style}>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="subtaskUploadFiles-input"
      />
      <MdPostAdd
        color={COLOR_CSS.gray}
        size={23}
        className="subtaskUploadFiles-icon"
      />
    </div>
  );
};

export default SubtaskUploadFiles;
