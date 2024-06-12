import { NavLink } from 'react-router-dom';
import './groupMeetingBar.css';
import { Nav } from '../../types';
interface GroupOptions {
  itemOptions: Nav[];
}
const GroupMeetingBar = ({ itemOptions }: GroupOptions) => {
  return (
    <div className="gmb-content">
      {itemOptions &&
        itemOptions.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              `gmb-sidebar-data ${isActive ? 'contract-selected' : ''}`
            }
          >
            <figure className="gmb-sidebar-figure">
              <img src={item.imgSrc} alt={item.imgAlt} style={{ width: 18 }} />
            </figure>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h4 className="gmb-sidebar-name">{item.title}</h4>
            </div>
          </NavLink>
        ))}
    </div>
  );
};

export default GroupMeetingBar;
