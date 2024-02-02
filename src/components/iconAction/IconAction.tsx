import { CSSProperties } from 'react';
import './iconAction.css';

interface IconActionProps {
  onClick?: () => void;
  className?: string;
  left?: number;
  size?: number;
  right?: number;
  bottom?: number;
  top?: number;
  icon: string;
}
const IconAction = ({
  onClick,
  className,
  size = 1,
  bottom,
  left,
  right,
  top,
  icon,
}: IconActionProps) => {
  const style: CSSProperties = {
    width: `${size}rem`,
    height: `${size}rem`,
    left: `${left}rem`,
    right: `${right}rem`,
    top: `${top}rem`,
    bottom: `${bottom}rem`,
  };
  return (
    <figure
      className={`iconAction ${className}`}
      style={style}
      onClick={e => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <img src={`/svg/${icon}.svg`} alt="close" />
    </figure>
  );
};

export default IconAction;