import './closeIcon.css';

interface CloseIconProps {
  onClick?: () => void;
  className?: string;
  size?: number;
}
const CloseIcon = ({ onClick, className, size = 1 }: CloseIconProps) => {
  const style = {
    width: `${size}rem`,
    aspectRatio: 1,
  };
  return (
    <figure
      className={`closeIcon ${className}`}
      style={style}
      onClick={onClick}
    >
      <img src="/svg/close.svg" alt="close" />
    </figure>
  );
};

export default CloseIcon;
