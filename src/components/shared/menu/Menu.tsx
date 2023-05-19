import { motion } from 'framer-motion';
import './Menu.css';
import { useEffect, useState } from 'react';

const initValues = {
  name: 'unknown',
  id: null,
};

const Menu = ({ data }: any) => {
  const [personalData, setPersonalData] = useState(initValues);

  useEffect(() => {
    const personalData = localStorage.getItem('personalData') || null;
    if (!personalData) return;
    setPersonalData(JSON.parse(personalData));
  }, []);

  return (
    <motion.ul
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
      className="header-toggle"
    >
      <p className="fullname-menu">{personalData.name}</p>
      <div className="line"></div>
      {data.map((value: any, index: number) => (
        <motion.li
          key={index}
          whileTap={{ scale: 0.9 }}
          onClick={() => value.action()}
          className="list-menu"
        >
          <img src={value.icon} alt="" className="icon-menu" />
          <p> {value.name}</p>
          <img
            src="/svg/material-symbols_navigate-next.svg"
            alt=""
            className="icon-menu-right"
          />
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default Menu;
