import { motion } from 'framer-motion';
import './Menu.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Menu = ({ data }: any) => {
  const [personalData, setPersonalData] = useState('');
  const { userSession } = useSelector((state: RootState) => state);

  useEffect(() => {
    setPersonalData(userSession?.profile.firstName);
  }, []);

  return (
    <motion.ul
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="header-toggle"
    >
      <p className="fullname-menu">{personalData} </p>
      <div className="line"></div>
      {data.map(
        (value: any) =>
          (userSession.role !== 'EMPLOYEE' || value.id !== 2) && (
            <motion.li
              key={value.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => value.action()}
              className="list-menu"
            >
              <img src={value.icon} alt="" className="icon-menu-left" />
              <p> {value.name}</p>
              <img
                src="/svg/material-symbols_navigate-next.svg"
                className="icon-menu-right"
              />
            </motion.li>
          )
      )}
    </motion.ul>
  );
};

export default Menu;
