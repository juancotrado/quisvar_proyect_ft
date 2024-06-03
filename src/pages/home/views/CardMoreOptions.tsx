import { useNavigate } from 'react-router-dom';
import './cardMoreOptions.css';
import { motion } from 'framer-motion';

interface CardMoreOptionsProps {
  isExpanded: boolean;
}
const CardMoreOptions = ({ isExpanded }: CardMoreOptionsProps) => {
  const navigate = useNavigate();
  const options = [
    {
      img: 'invoiceComputer.png',
      name: 'Factura personalizada',
      linkFn: () => navigate('/factura'),
    },
  ];
  return (
    <motion.div
      className="cardMoreOptions"
      initial={{ width: 'auto', height: 0 }}
      animate={{ height: 'auto' }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="cardMoreOptions-title">DHYRIUM SAA</h2>
      <div className="cardMoreOptions-items">
        {options.map(({ img, linkFn, name }) => (
          <div className={'cardMoreOptions-item'} onClick={linkFn}>
            <figure className={'cardMoreOptions-figure'}>
              <img src={'/img/' + img} alt={name} />
            </figure>
            <div className={'cardMoreOptions-name'}>{name}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CardMoreOptions;
