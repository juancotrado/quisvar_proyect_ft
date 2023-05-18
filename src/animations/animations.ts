export const dropIn = {
  hidden: {
    y: '-100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.2,
      type: 'spring',
      damping: 30,
      stiffness: 300,
    },
  },
  leave: {
    opacity: 0,
    y: '-100vh',
  },
};
