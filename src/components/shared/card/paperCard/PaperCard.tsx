import './paperCard.css';

interface PaperCardProps {
  title?: string;
  icon?: string;
  description?: string;
  classInfo?: string;
  className?: string;
  onClick?: () => void;
}

const PaperCard = ({
  title,
  icon,
  description,
  classInfo,
  className,
  onClick,
}: PaperCardProps) => {
  return (
    <div className={`${className} paper-card-container-main`} onClick={onClick}>
      {title && <h3 className="paper-card-title">{title} </h3>}
      <div className={`paper-card-${classInfo} paper-card-container-info`}>
        {icon && (
          <figure className="paper-card-icon">
            <img src={`/svg/${icon}.svg`} alt={icon} />
          </figure>
        )}
        <span className="paper-card-description">{description} </span>
      </div>
    </div>
  );
};

export default PaperCard;
