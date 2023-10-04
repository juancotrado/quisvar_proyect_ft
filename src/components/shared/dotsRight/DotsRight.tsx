import { ContextMenu, ContextMenuItem } from 'rctx-contextmenu';
import './dotsRight.css';
import { Option } from '../dots/DotsOption';
interface DotsRightProps {
  idContext: string;
  data: Option[];
}
const DotsRight = ({ idContext, data }: DotsRightProps) => {
  const handleClick = (value: (() => void) | undefined) => {
    value?.();
  };
  return (
    <ContextMenu
      id={idContext}
      className={`dotsRight-contex-menu`}
      preventHideOnScroll={false}
    >
      {data.map((option, index) => (
        <ContextMenuItem
          key={index}
          onClick={e => {
            e.stopPropagation();
            handleClick(option.function);
          }}
          className="dotsRight-contex-menu-item"
        >
          <button
            key={index}
            className="dotsRight-option-list"
            type={option.type}
          >
            {option.icon && (
              <img src={`/svg/${option.icon}.svg`} className="dotsRight-icon" />
            )}
            {option.name}
          </button>
        </ContextMenuItem>
      ))}
    </ContextMenu>
  );
};

export default DotsRight;
