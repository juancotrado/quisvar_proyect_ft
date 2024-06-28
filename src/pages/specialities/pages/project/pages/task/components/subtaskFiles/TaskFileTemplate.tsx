import { Button } from '../../../../../../../../components';

interface TaskFileTemplateProps {
  name: string;
  icon: string;
  showDeleteBtn?: boolean;
  onDeleteFile: () => void;
  onClick?: () => void;
}

const TaskFileTemplate = ({
  icon,
  name,
  onDeleteFile,
  showDeleteBtn = false,
  onClick,
}: TaskFileTemplateProps) => {
  return (
    <div className="subtaskFile-contain">
      <div
        // href={`${URL}/${normalizeUrlFile(file.dir)}/${file.name}`}
        // target="_blank"
        className="subtaskFile-anchor"
        // download={true}
        // title={name}
        onClick={onClick}
      >
        <img
          src={`/svg/${icon}.svg`}
          alt="W3Schools"
          className="subtaskFile-icon"
        />
        <span className="subtaskFile-name">{name}</span>
      </div>
      {showDeleteBtn && (
        <Button
          icon="trash-red"
          onClick={onDeleteFile}
          variant="ghost"
          iconSize={0.8}
        />
      )}
    </div>
  );
};

export default TaskFileTemplate;
