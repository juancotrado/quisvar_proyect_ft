import { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface ChipItemProps {
  item: {
    id: number;
    title: string;
    icon: string;
    link: string;
  };
}

const ChipItem = ({ item }: ChipItemProps) => {
  const [message, setMenssage] = useState(false);
  const showMessage = () => setMenssage(true);
  const hiddenMessage = () => setMenssage(false);

  return (
    <li>
      <NavLink
        to={item.link}
        className={({ isActive }) =>
          isActive ? 'item-nav nav-active' : 'item-nav nav-inactive'
        }
        onMouseEnter={showMessage}
        onMouseLeave={hiddenMessage}
      >
        <span className="items-list-icon">
          <img src={`/svg/${item.icon}.svg`} />
        </span>
        {message && (
          <span className="item-list-icon-message">{item.title}</span>
        )}
      </NavLink>
    </li>
  );
};

export default ChipItem;
