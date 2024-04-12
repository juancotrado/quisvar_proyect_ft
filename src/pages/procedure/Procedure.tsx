import { Outlet } from 'react-router-dom';
import './procedure.css';
import { useSubMenus } from '../../hooks';
import { Navbar } from '../../components/navbar';
const Procedure = () => {
  const { subMenu } = useSubMenus();

  return (
    <div className="procedure">
      <Navbar title="tramites&nbsp;de usuario" subMenu={subMenu} />
      <div className="procedure-main">
        <Outlet />
      </div>
    </div>
  );
};

export default Procedure;
