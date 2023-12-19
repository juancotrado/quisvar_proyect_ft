import './fileNameContainer.css';
interface FileNameContainerProps {
  fileName: string;
  onDelete: () => void;
  icon: string;
}
const FileNameContainer = ({
  fileName,
  onDelete,
  icon,
}: FileNameContainerProps) => {
  return (
    <div className="FileNameContainer-file-name-container">
      <p className="FileNameContainer-file-name-text">
        <img
          src={`/svg/${icon}.svg`}
          alt="W3Schools"
          className="FileNameContainer-file-name-icon"
        />
        {fileName}
      </p>
      <figure className="FileNameContainer-figure" onClick={onDelete}>
        <img src="/svg/close.svg" alt="W3Schools" />
      </figure>
    </div>
  );
};

export default FileNameContainer;
