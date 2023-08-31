import React, { useState } from 'react';
interface TemplateScrollingProps {
  children: React.ReactNode;
  className?: string;
}
const TemplateScrolling = ({ children, className }: TemplateScrollingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`${className}`}>
      <button onClick={() => setIsOpen(!isOpen)}>abrir</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

export default TemplateScrolling;
