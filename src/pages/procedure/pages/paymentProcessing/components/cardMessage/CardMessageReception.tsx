import moment from 'moment/moment';
import 'moment/locale/es';
import { Button } from '../../../../../../components';
import { Reception } from '../../../../models';
import { TYPE_STATUS } from '../../models';

interface cardMessageReceptionProps {
  reception: Reception;
  onClick: () => void;
  handleButton: (id: number) => void;
}

const cardMessageReception = ({
  reception,
  handleButton,
  onClick,
}: cardMessageReceptionProps) => {
  const [receiver, sender] = reception.users;
  return (
    <div className={`cardMessageRow-container pointer`} onClick={onClick}>
      <div className="card-message-section-item">
        <span className="card-status-span">
          {moment(reception.updatedAt).format('DD/MM/YYYY, hh:mm a')}
        </span>
      </div>
      <div className="card-message-section-item">
        <span className="card-status-span ">{reception.title}</span>
      </div>
      <div className="card-message-section-item ">
        <span className="card-status-span ">
          {sender?.user.profile.firstName} {sender?.user.profile.lastName}
        </span>
      </div>
      <div className="card-message-section-item">
        <span className={`card-status-span `}>
          {receiver?.user.profile.firstName} {receiver?.user.profile.lastName}
        </span>
      </div>
      <div className="card-message-section-item">
        <span className={`card-status-message status-${reception.status}`}>
          {TYPE_STATUS[reception.status]?.toLowerCase()}
        </span>
      </div>
      <div className="card-message-section-item">
        <span className={`card-status-span`}>---</span>
      </div>
      <div className="card-message-section-item">
        <span className="card-status-span ">--</span>
      </div>
      <div
        className="card-message-section-item message-cursor-none"
        onClick={e => e.stopPropagation()}
        style={{ justifyContent: 'center' }}
      >
        {reception.onHolding ? (
          <Button
            icon="check-blue"
            style={{ border: 'none', backgroundColor: 'inherit' }}
            text="Aprobar"
            onClick={() => handleButton(reception.id)}
          />
        ) : (
          'Aprobado'
        )}
      </div>
    </div>
  );
};

export default cardMessageReception;
