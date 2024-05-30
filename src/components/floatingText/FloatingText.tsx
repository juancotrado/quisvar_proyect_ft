import { CSSProperties, ReactNode, useState } from 'react';
import './floatingText.css';
interface FloatingTextProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  text: string;
  xPos?: number;
  yPos?: number;
}
const FloatingText = ({
  children,
  className,
  style,
  text,
  xPos = 0,
  yPos = 0,
}: FloatingTextProps) => {
  const [message, setMenssage] = useState(false);
  const showMessage = () => setMenssage(true);
  const hiddenMessage = () => setMenssage(false);
  const styleText = {
    transform: `translate(${xPos}px,${yPos}px)`,
  };
  return (
    <div
      className={` ${className}`}
      style={style}
      onMouseEnter={showMessage}
      onMouseLeave={hiddenMessage}
    >
      {children}
      {message && (
        <span className="floatingText-message" style={styleText}>
          {text}
        </span>
      )}
    </div>
  );
};

export default FloatingText;
