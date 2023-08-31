import React, { useState } from 'react';
import './templateScrolling.css';
interface TemplateScrollingProps {
  children: React.ReactNode;
  className?: string;
  tag?: string;
  size?: boolean;
}
const TemplateScrolling = ({
  children,
  className,
  tag,
  size,
}: TemplateScrollingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={` ${className} template-scrolling-main`}>
      {size && (
        <button
          className="template-scrolling-container"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{tag}</span>
          <img className="template-scrolling-caret-down" src="/svg/down.svg" />
        </button>
      )}
      {isOpen && <div>{children}</div>}
    </div>
  );
};

export default TemplateScrolling;
