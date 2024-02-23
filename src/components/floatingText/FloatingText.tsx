import { ReactNode, useState } from 'react';
import './floatingText.css';
interface FloatingTextProps {
  children: ReactNode;
  className?: string;
  text: string;
  xPos?: number;
  yPos?: number;
}
const FloatingText = ({
  children,
  className,
  text,
  xPos = 0,
  yPos = 0,
}: FloatingTextProps) => {
  const [message, setMenssage] = useState(false);
  const showMessage = () => setMenssage(true);
  const hiddenMessage = () => setMenssage(false);
  const style = {
    transform: `translate(${xPos}px,${yPos}px)`,
  };
  return (
    <div
      className={` ${className}`}
      onMouseEnter={showMessage}
      onMouseLeave={hiddenMessage}
    >
      {children}
      {message && (
        <span className="floatingText-message" style={style}>
          {text}
        </span>
      )}
    </div>
  );
};

export default FloatingText;
