import { CSSProperties, ReactNode, useState } from 'react';
import './floatingText.css';
interface FloatingTextProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  text: string;
  xPos?: number;
  yPos?: number;
  textSize?: number;
}
const FloatingText = ({
  children,
  className,
  style,
  text,
  xPos = 0,
  yPos = 0,
  textSize = 0.7,
}: FloatingTextProps) => {
  const [message, setMenssage] = useState(false);
  const showMessage = () => setMenssage(true);
  const hiddenMessage = () => setMenssage(false);

  const styleText: CSSProperties = {
    transform: `translate(${xPos}px,${yPos}px)`,
    fontSize: `${textSize}rem`,
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
