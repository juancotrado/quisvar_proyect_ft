import { motion } from 'framer-motion';
// import { useParams } from 'react-router-dom';
import { GeneralData } from '../../../../components';

const DetailsPage = () => {
  // const { stageId } = useParams();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%' }}
    >
      <GeneralData />
    </motion.div>
  );
};

export default DetailsPage;
