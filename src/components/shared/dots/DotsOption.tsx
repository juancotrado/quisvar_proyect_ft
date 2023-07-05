import { useState } from 'react';
import './DotsOption.css';

interface Option {
  name: string;
  icon?: string;
  function?: () => void;
}

interface DotsOptionProps {
  data?: Option[];
  icon?: string;
  className?: string;
}

const DotsOption = ({ data, className }: DotsOptionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        className={`${className} dots-content`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          <img src="/svg/dots.svg" alt="" />
        </span>
        {isOpen && (
          <div className="dot-options">
            {data?.map((option, index) => (
              <div
                key={index}
                className="option-list"
                onClick={option.function}
              >
                <span>
                  <img
                    src={`/svg/${option.icon}.svg`}
                    alt=""
                    className="dot-icon"
                  />
                </span>
                {option.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DotsOption;
