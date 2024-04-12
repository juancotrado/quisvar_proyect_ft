import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MenuItem } from '../../types';
interface ChipItemProps {
  item: MenuItem;
}

const ChipItem = ({ item }: ChipItemProps) => {
  const [message] = useState(false);

  return (
    <li>
      <NavLink
        to={item.route}
        className={({ isActive }) =>
          isActive ? 'item-nav nav-active' : 'item-nav'
        }
      >
        <span className="items-list-icon">
          <img src={`/svg/menu/${item.route}.svg`} />
          <p className="items-list-name">{item.title}</p>
        </span>
        {message && (
          <span className="item-list-icon-message">{item.title}</span>
        )}
      </NavLink>
    </li>
  );
};

export default ChipItem;
