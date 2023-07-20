import { motion } from 'framer-motion';
import Portal from '../../../portal/Portal';
import { dropIn } from '../../../../animations/animations';

interface CardAddStageProps {
  children: React.ReactNode;
  size?: number;
  isOpen: boolean;
  onChangeStatus?: () => void;
}

const CardAddStage = ({
  children,
  size,
  isOpen,
  onChangeStatus,
}: CardAddStageProps) => {
  if (!isOpen) return null;
  return (
    <Portal wrapperId="modal">
      <motion.div
        onClick={onChangeStatus}
        role="dialog"
        className="modal-main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { delay: 2 } }}
      >
        <motion.div
          className={`modal-children`}
          onClick={e => e.stopPropagation()}
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="leave"
          style={{ minWidth: `${size ? size : 100}%` }}
        >
          {children}
        </motion.div>
      </motion.div>
    </Portal>
  );
};

export default CardAddStage;
