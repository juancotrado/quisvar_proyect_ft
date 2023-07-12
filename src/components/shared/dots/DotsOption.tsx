import { useState } from 'react';
import './DotsOption.css';
import Outside from '../../portal/Outside';

export interface Option {
  name: string;
  icon?: string;
  url?: string;
  function?: () => void;
  type?: 'button' | 'reset' | 'submit';
}

interface DotsOptionProps {
  data: Option[];
  className?: string;
  persist?: boolean;
  variant?: boolean;
}

const DotsOption = ({
  data,
  className,
  persist,
  variant = false,
}: DotsOptionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = (value: (() => void) | undefined) => {
    value && value();
    persist && setIsOpen(false);
  };
  return (
    <Outside onClickOutside={() => setIsOpen(false)}>
      <div onClick={e => e.stopPropagation()}>
        <div className={` dots-content`}>
          <span onClick={() => setIsOpen(!isOpen)}>
            <img
              className="menu-icon-dot"
              src={`/svg/${variant ? 'dots-color' : 'menusmall'}.svg`}
              alt=""
            />
          </span>
          <div className={`${className} dot-options`}>
            {isOpen &&
              data.map((option, index) => (
                <button
                  key={index}
                  className="option-list"
                  onClick={() => handleClick(option.function)}
                  type={option.type}
                >
                  {option.icon && (
                    <img src={`/svg/${option.icon}.svg`} className="dot-icon" />
                  )}
                  {option.name}
                </button>
              ))}
          </div>
        </div>
      </div>
    </Outside>
  );
};

export default DotsOption;
