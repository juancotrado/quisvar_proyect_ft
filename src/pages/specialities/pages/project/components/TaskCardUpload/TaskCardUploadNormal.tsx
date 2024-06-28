import { useContext, useEffect, useRef, useState } from 'react';
import { TbFiles } from 'react-icons/tb';
import { SubtaskUploadFiles } from '../../pages/task/components';
import { TaskContext } from '../taskCard/TaskCard';
import TaskFileTemplate from '../../pages/task/components/subtaskFiles/TaskFileTemplate';
import { downloadBlob } from '../../../../../../utils';

interface TaskCardUploadNormalProps {
  onChange?: (files: File[]) => void;
  value?: File[];
}

const TaskCardUploadNormal = ({
  onChange,
  value,
}: TaskCardUploadNormalProps) => {
  const { task } = useContext(TaskContext);
  const [files, setFiles] = useState<File[]>([]);
  const isControlled = useRef(!!onChange);

  const handleDeleteFile = (fileName: string) => {
    const newFiles = files!.filter(file => file.name !== fileName);
    if (isControlled) {
      return onChange!(newFiles);
    }
    setFiles(newFiles);
  };

  const onAddFiles = (selectedFiles: File[]) => {
    const newFiles = selectedFiles.filter(
      selectedFile => !files.some(file => file.name === selectedFile.name)
    );
    const completFiles = [...files, ...newFiles];
    if (isControlled) {
      return onChange!(completFiles);
    }
    setFiles(completFiles);
  };

  const onClickFile = (selectedFiles: File) => {
    downloadBlob(selectedFiles, selectedFiles.name);
  };
  useEffect(() => {
    if (value) {
      setFiles(value);
    }
  }, [value]);
  return (
    <>
      <SubtaskUploadFiles
        taskId={task.id}
        type={'REVIEW'}
        height={100}
        optionProject="basic"
        addFiles={onAddFiles}
      />
      <div className={` subtaskFile`}>
        {files?.map(file => (
          <TaskFileTemplate
            name={file.name}
            key={file.name}
            onDeleteFile={() => handleDeleteFile(file.name)}
            onClick={() => onClickFile(file)}
            icon={'file-download'}
            showDeleteBtn={true}
          />
        ))}
      </div>
    </>
  );
};

export default TaskCardUploadNormal;
