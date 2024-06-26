import { Outlet } from 'react-router-dom';
import './userCenter.css';
import { HEADER_USER_MODEL } from './models/userModelDef';
import { Navbar } from '../../components/navbar';

const UserCenter = () => {
  return (
    <div className="userCenter">
      <Navbar title="centro&nbsp;de usuarios" subMenu={HEADER_USER_MODEL} />
      <div className="user-content ">
        <Outlet />
      </div>
    </div>
  );
};

export default UserCenter;
