import { Button } from '../../../../../../components';
import { Reception } from '../../../../models';
import { TYPE_STATUS } from '../../models';
import { formatDateTimeUtc } from '../../../../../../utils/dayjsSpanish';
import { UserProfile } from '../../../../../../types';

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

  const mainReceiver = reception.users.find(
    user => user.role === 'MAIN' && user.type === 'RECEIVER'
  );

  const getFullName = (user?: UserProfile) =>
    user ? `${user.profile.firstName} ${user.profile.lastName}` : '---';
  return (
    <div className={`cardMessageRow-container pointer`} onClick={onClick}>
      <div className="card-message-section-item">
        <span className="card-status-span ">{reception.title}</span>
      </div>
      <div className="card-message-section-item ">
        <span className="card-status-span ">{getFullName(sender?.user)}</span>
      </div>
      <div className="card-message-section-item ">
        <span className="card-status-span ">{reception.header}</span>
      </div>
      <div className="card-message-section-item">
        <span className={`card-status-span `}>
          {getFullName(receiver?.user)}
        </span>
      </div>
      <div className="card-message-section-item">
        <span className={`card-status-message status-${reception.status}`}>
          {TYPE_STATUS[reception.status]?.toLowerCase()}
        </span>
      </div>
      <div className="card-message-section-item">
        <span className={`card-status-span`}>
          {reception?.office?.name || getFullName(mainReceiver?.user)}
        </span>
      </div>
      <div className="card-message-section-item">
        <span className="card-status-span">
          {formatDateTimeUtc(reception.updatedAt)}
        </span>
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
