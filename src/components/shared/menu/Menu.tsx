import { motion } from 'framer-motion';

const Menu = ({ data }: any) => {
  return (
    <motion.ul
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
      className="header-toggle"
    >
      {data.map((value: any, index: number) => (
        <motion.li
          key={index}
          whileTap={{ scale: 0.9 }}
          onClick={() => value.action()}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          {' '}
          &#127814; {value.name}
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default Menu;
