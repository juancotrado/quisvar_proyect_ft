import { useContext, useEffect, useState } from 'react';
import CloseIcon from '../closeIcon/CloseIcon';
import './AlertNotification.css';
import { motion } from 'framer-motion';
import { SocketContext } from '../../../context/SocketContex';
import notificationSound from '/sounds/notification.mp3';
const AlertNotification = () => {
  const socket = useContext(SocketContext);

  const [showAlert, setShowAlert] = useState(false);
  const handleClose = () => setShowAlert(false);

  useEffect(() => {
    socket.on('server:call-notification', () => {
      if (showAlert) return;
      const audio = new Audio(notificationSound); // Puedes usar la importación o la ruta directa al archivo
      audio.play();
      setShowAlert(true);
    });
    return () => {
      socket.off('server:call-notification');
    };
  }, [socket, showAlert]);
  return (
    <>
      {showAlert && (
        <motion.div
          className={`alertNotify-content  `}
          initial={{ x: '+100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.5 }}
        >
          <CloseIcon onClick={handleClose} />
          <h4 className="alertNotify-title">Se llamará asistencia en breve</h4>
          <div className="alertNotify-body">
            <figure className="alertNotify-figure">
              <img
                src="/img/call_assintan.png"
                alt=""
                className="alertNotify-img"
              />
            </figure>
            <p className="alertNotify-text">
              Por favor, tome sus precauciones y permanezca en su área de
              trabajo. Agradecemos su colaboración
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default AlertNotification;
