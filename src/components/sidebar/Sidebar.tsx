import './sidebar.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useRef, useState, MouseEvent } from 'react';
import { Subscription } from 'rxjs';
import { toggle$ } from '../../services/sharingSubject';
import { SocketContext } from '../../context';
import { CardEditInformation, ChipItem, Menu } from '..';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { motion } from 'framer-motion';
import { getIconDefault } from '../../utils';
import { getUserSession } from '../../store/slices/userSession.slice';

const Sidebar = () => {
  const { stageId, taskId } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarShow, setSidebarShow] = useState(false);
  const socket = useContext(SocketContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMoreInfo, setIsOpenMoreInfo] = useState(false);
  const { role, profile } = useSelector(
    (state: RootState) => state.userSession
  );
  const handleToggleRef = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleToggleRef.current = toggle$.getSubject.subscribe((value: boolean) => {
      setIsOpen(value);
      setIsOpenMoreInfo(value);
    });
    return () => {
      handleToggleRef.current.unsubscribe();
    };
  }, []);

  useEffect(() => {
    socket.io.on('reconnect', () => {
      if (stageId) {
        socket.emit('join', `project-${stageId}`);
      }
      if (taskId) {
        socket.emit('join', `task-${taskId}`);
      }
      if (role) {
        socket.emit('join', `role-${role.id}`);
      }
    });
  }, []);

  useEffect(() => {
    if (role) {
      socket.emit('join', `role-${role.id}`);
    }
  }, [role]);

  useEffect(() => {
    socket.on('server:refresh-user', () => {
      dispatch(getUserSession());
    });
    return () => {
      socket.off('server:refresh-user');
    };
  }, [socket]);

  const [openModalInfo, setOpenModalInfo] = useState(false);

  const handleNotification = () => {
    navigate('lista-de-notificaciones');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('arrChecked');
    socket.disconnect();
    navigate('login');
  };
  const handleHome = () => {
    navigate('/home');
  };
  const handleShowSidebar = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setSidebarShow(!sidebarShow);
  };

  // const selectPdfForUserRol = () => {
  //   if (userSession.role === 'EMPLOYEE')
  //     return window.open('/public/tutorials/MANUAL_DE_USUARIO.pdf', '_blank');
  //   return window.open(
  //     '/public/tutorials/MANUAL_DE_ADMINISTRADOR.pdf',
  //     '_blank'
  //   );
  // };
  // const selectVideoForUserRol = () => {
  //   if (userSession.role === 'EMPLOYEE')
  //     return window.open('/public/tutorials/USER_GUIDE.mkv', '_blank');
  //   return window.open('/public/tutorials/ADMIN_GUIDE.mkv', '_blank');
  // };

  const openModal = () => setOpenModalInfo(true);
  const closeModal = () => setOpenModalInfo(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleMenuMoreInfo = () => setIsOpenMoreInfo(!isOpenMoreInfo);

  useEffect(() => {
    const handleClick = () => setSidebarShow(false);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const icons = [
    {
      id: 1,
      name: '/svg/bell.svg',
      link: '/lista-de-notificaciones',
      action: handleNotification,
    },
    {
      id: 2,
      name: '/svg/question-circle.svg',
      link: '/dashboard',
      action: toggleMenuMoreInfo,
    },
    {
      id: 3,
      name: getIconDefault(profile.dni),
      link: '/dashboard',
      action: toggleMenu,
    },
  ];
  const menuMoreInfo = [
    {
      id: 1,
      name: 'Ver Video tutorial',
      icon: '/svg/file-video-solid.svg',
    },
    {
      id: 3,
      name: 'Ver PDF',
      icon: '/svg/file-pdf-solid.svg',
      // action: selectPdfForUserRol,
    },
  ];
  const menu = [
    {
      id: 1,
      name: 'Editar Perfil',
      icon: '/svg/Group.svg',
      action: openModal,
    },
    {
      id: 3,
      name: 'Acerca de',
      icon: '/svg/question-circle.svg',
      action: null,
    },
    {
      id: 4,
      name: 'Salir',
      icon: '/svg/ri_logout-box-r-line.svg',
      action: handleLogout,
    },
  ];
  return (
    <>
      <div className={`sidebar ${sidebarShow && 'sidebar---show'}`}>
        <nav className="nav-container containerXD ">
          <div className="nav-options">
            <figure className="sidebar-figure">
              <img
                className="nav-logo"
                src="/img/logo_img.png"
                onClick={handleHome}
                alt="logo QuisVar"
              />
            </figure>
            <span className="items-list">
              {role?.menuPoints?.map(item => (
                <ChipItem key={item.id} item={item} />
              ))}
            </span>
          </div>
          <ul className="icons-list">
            {icons.map(icon => (
              <li key={icon.id} className="icon-list">
                {icon.id !== 1 && (
                  <figure
                    className={`${
                      icon.id === 3 ? 'user-profile-figure' : 'icon-list-item'
                    } `}
                  >
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={e => {
                        icon.id === 3 && e.stopPropagation();
                        icon.action();
                      }}
                      src={icon.name}
                      alt={icon.name}
                    />
                  </figure>
                )}
                {icon.id === 2 && isOpenMoreInfo && (
                  <Menu data={menuMoreInfo} />
                )}
                {icon.id === 3 && isOpen && <Menu data={menu} />}
              </li>
            ))}
          </ul>
        </nav>

        {<CardEditInformation isOpen={openModalInfo} onClose={closeModal} />}
      </div>
      <div className="sidebar-menu-open" onClick={handleShowSidebar}>
        <figure className="sidebar-menu_figure">
          <img src={`/svg/menu_default.svg`} alt="menu" />
        </figure>
      </div>
    </>
  );
};

export default Sidebar;
