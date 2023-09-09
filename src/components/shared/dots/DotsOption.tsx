import { useEffect, useState } from 'react';
import './DotsOption.css';
import Outside from '../../portal/Outside';

export interface Option {
  name?: string;
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
  notPositionRelative?: boolean;
  isClickRight?: boolean;
  iconHide?: boolean;
}

const DotsOption = ({
  data,
  className,
  persist,
  notPositionRelative,
  variant = false,
  isClickRight,
  iconHide = false,
}: DotsOptionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = (value: (() => void) | undefined) => {
    value?.();
    persist && setIsOpen(false);
  };

  useEffect(() => {
    if (isClickRight !== undefined) {
      setIsOpen(isClickRight);
    }
  }, [isClickRight]);

  return (
    <Outside onClickOutside={() => setIsOpen(false)}>
      <div
        className={`${
          notPositionRelative ? 'dots-content-not-relative' : 'dots-content'
        } `}
        onClick={e => e.stopPropagation()}
      >
        <span
          onClick={() => setIsOpen(!isOpen)}
          className={`${iconHide && 'span-hide'} `}
        >
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
    </Outside>
  );
};

export default DotsOption;
