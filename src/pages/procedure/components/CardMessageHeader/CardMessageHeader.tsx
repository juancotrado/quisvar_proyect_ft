import { useRole } from '../../../../hooks';
import { MessageSender } from '../../../../types';
import { MailTypeProcedure } from '../../models';
import './cardMessageHeader.css';

interface CardMessageHeaderProps {
  typeMail: MailTypeProcedure | MessageSender | null;
}

const CardMessageHeader = ({ typeMail }: CardMessageHeaderProps) => {
  const { hasAccess } = useRole('MOD', null, 'tramite-de-pago');

  return (
    <div className={`cardMessageHeader-container-header-titles  `}>
      <div className="cardMessageHeader-header-item">
        <span>#DOCUMENTO</span>
      </div>
      <div className="cardMessageHeader-header-item">
        <span>{`${
          typeMail === 'RECEIVER' ? 'REMITENTE' : 'DESTINATARIO'
        }`}</span>
      </div>
      <div className="cardMessageHeader-header-item mail-grid-col-2">
        <span>ASUNTO</span>
      </div>
      <div className="cardMessageHeader-header-item">
        <span>ESTADO</span>
      </div>
      <div className="cardMessageHeader-header-item">
        <span>DEPENDENCIA</span>
      </div>
      <div className="cardMessageHeader-header-item">
        <span>FECHA DE ENVÍO</span>
      </div>
      {hasAccess && (
        <div className="cardMessageHeader-header-item cardMessageHeader-cursor-none">
          <span>ARCHIVAR</span>
        </div>
      )}
    </div>
  );
};

export default CardMessageHeader;
