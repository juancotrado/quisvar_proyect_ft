import { CSSProperties } from 'react';
import './headerOptionBtn.css';

interface HeaderOptionProps {
  isActive: boolean;
  text: string;
  iconOn: string;
  iconOff: string;
  width?: number;
  onClick?: () => void;
}

const HeaderOptionBtn = ({
  isActive,
  iconOff,
  iconOn,
  text,
  width = 18,
  onClick,
}: HeaderOptionProps) => {
  const style: CSSProperties = {
    width: `${width}rem`,
  };
  return (
    <span
      className={`headerOptionBtn-header-btn ${
        isActive && 'headerOptionBtn-header-btn-selected'
      } `}
      style={style}
      onClick={onClick}
    >
      <img
        src={`svg/${isActive ? iconOn : iconOff}.svg`}
        className="headerOptionBtn-img-icon"
      />
      <span className="headerOptionBtn-span-text">{text}</span>
    </span>
  );
};

export default HeaderOptionBtn;
