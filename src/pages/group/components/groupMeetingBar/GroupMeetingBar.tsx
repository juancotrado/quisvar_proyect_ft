import { NavLink } from 'react-router-dom';
import './groupMeetingBar.css';

const GroupMeetingBar = () => {
  return (
    <div className="gmb-content">
      <NavLink
        to={`resumen/reuniones`}
        className={({ isActive }) =>
          `gr-sidebar-data  ${isActive && 'contract-selected'} `
        }
      >
        <figure className="gr-sidebar-figure">
          <img src="/svg/meeting.svg" alt="W3Schools" style={{ width: 18 }} />
        </figure>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 className="gr-sidebar-name">Reuniones diarias</h4>
        </div>
      </NavLink>
      <NavLink
        to={`resumen/asistencias`}
        className={({ isActive }) =>
          `gr-sidebar-data  ${isActive && 'contract-selected'} `
        }
      >
        <figure className="gr-sidebar-figure">
          <img
            src="/svg/presentation.svg"
            alt="W3Schools"
            style={{ width: 18 }}
          />
        </figure>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 className="gr-sidebar-name">Asistencias</h4>
        </div>
      </NavLink>
    </div>
  );
};

export default GroupMeetingBar;
