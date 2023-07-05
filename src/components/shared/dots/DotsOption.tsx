import { useState } from 'react';
import './DotsOption.css';
import Outside from '../../portal/Outside';
import ButtonDelete from '../button/ButtonDelete';

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
}

const DotsOption = ({ data, className }: DotsOptionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Outside onClickOutside={() => setIsOpen(false)}>
      <div onClick={e => e.stopPropagation()}>
        <div className={`${className} dots-content`}>
          <span onClick={() => setIsOpen(!isOpen)}>
            <img className="menu-icon-dot" src="/svg/menusmall.svg" alt="" />
          </span>
          <div className="dot-options">
            {isOpen &&
              data.map((option, index) => (
                <button
                  key={index}
                  className="option-list"
                  onClick={option.function}
                  type={option.type}
                >
                  {option.icon && (
                    <span>
                      <img
                        src={`/svg/${option.icon}.svg`}
                        className="dot-icon"
                      />
                    </span>
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
