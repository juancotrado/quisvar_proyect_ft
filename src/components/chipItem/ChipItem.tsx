import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MenuItem } from '../../types';
interface ChipItemProps {
  item: MenuItem;
}

const ChipItem = ({ item }: ChipItemProps) => {
  const [message, setMenssage] = useState(false);
  const showMessage = () => setMenssage(true);
  const hiddenMessage = () => setMenssage(false);

  return (
    <li>
      <NavLink
        to={item.route}
        className={({ isActive }) =>
          isActive ? 'item-nav nav-active' : 'item-nav nav-inactive'
        }
        onMouseEnter={showMessage}
        onMouseLeave={hiddenMessage}
      >
        <span className="items-list-icon">
          <img src={`/svg/menu/${item.route}.svg`} />
        </span>
        {message && (
          <span className="item-list-icon-message">{item.title}</span>
        )}
      </NavLink>
    </li>
  );
};

export default ChipItem;
