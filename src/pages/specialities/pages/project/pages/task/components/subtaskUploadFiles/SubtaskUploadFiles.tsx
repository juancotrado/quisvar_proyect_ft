import { CSSProperties, ChangeEvent, useContext } from 'react';
import { axiosInstance } from '../../../../../../../../services/axiosInstance';
import { SocketContext } from '../../../../../../../../context';
import './subtaskUploadFiles.css';
import { FileType, OptionProject } from '../../../../../../../../types';
import { MdPostAdd } from 'react-icons/md';
import { COLOR_CSS } from '../../../../../../../../utils/cssData';
import { OPTION_PROJECT } from '../../../../models';
import { loader$ } from '../../../../../../../../services/sharingSubject';

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
    if (!e.target.files) return;
    const files = e.target.files;
    if (type === 'REVIEW' && addFiles) {
      const newFiles = Array.from(files);
      addFiles(newFiles);
      e.target.value = '';
      return;
    }
    const formdata = new FormData();
    for (const file of files) {
      formdata.append('files', file);
    }
    const query = {
      status: type,
    };
    const params = new URLSearchParams(query);
    e.target.value = '';
    axiosInstance
      .post(`${OPTION_PROJECT[optionProject].uploadFile}/${taskId}`, formdata, {
        params,
      })
      .then(() => {
        loader$.setSubject = true;
        socket.emit(OPTION_PROJECT[optionProject].loadTask, taskId, () => {
          loader$.setSubject = false;
        });
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
