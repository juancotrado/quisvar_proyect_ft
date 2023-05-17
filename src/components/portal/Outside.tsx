/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from 'react';

interface OutsideProps {
  children: React.ReactNode;
  onClickOutside?: () => void;
}

const Outside = ({ onClickOutside, children }: OutsideProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleEvent = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      onClickOutside && onClickOutside();
    }
  };
  
  useEffect(() => {
    document.addEventListener('click', handleEvent, true);
    return () => {
      document.removeEventListener('click', handleEvent, true);
    };
  }, []);

  if (!children) return null;
  return <div ref={ref}>{children}</div>;
};

export default Outside;
