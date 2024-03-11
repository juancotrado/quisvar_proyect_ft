import { useRole } from '../../../../hooks';
import { MessageSender } from '../../../../types';
import { MailTypeProcedure, TypeProcedure } from '../../models';
import './cardMessageHeader.css';

interface CardMessageHeaderProps {
  typeMail: MailTypeProcedure | MessageSender | null;
  option: TypeProcedure;
}

const CardMessageHeader = ({ typeMail, option }: CardMessageHeaderProps) => {
  const { hasAccess } = useRole('MOD', null, 'tramite-de-pago');

  return (
    <div
      className={`cardMessageRow-container ${
        option === 'comunication' && 'cardMessageRow-grid-comunication'
      } `}
    >
      <div className="cardMessageHeader-header-item">
        <span>#DOCUMENTO</span>
      </div>
      <div className="cardMessageHeader-header-item">
        <span>{`${
          typeMail === 'RECEIVER' ? 'REMITENTE' : 'DESTINATARIO'
        }`}</span>
      </div>
      <div className="cardMessageHeader-header-item ">
        <span>ASUNTO</span>
      </div>
      <div className="cardMessageHeader-header-item">
        <span>ESTADO</span>
      </div>
      <div className="cardMessageHeader-header-item">
        <span>DEPENDENCIA</span>
      </div>
      {option !== 'comunication' && (
        <div className="cardMessageHeader-header-item">
          <span>TRAMITANTE</span>
        </div>
      )}
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
