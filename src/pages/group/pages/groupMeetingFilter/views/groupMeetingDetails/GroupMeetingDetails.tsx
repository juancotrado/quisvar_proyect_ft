import { Button, DefaultUserImage } from '../../../../../../components';
import { _date } from '../../../../../../utils';
import { GroupRes } from '../../../../types';
import { DutyPdf } from '../../../groupContent/views';
import './groupMeetingDetails.css';
interface GroupDetailsProps {
  item: GroupRes;
  onClose: () => void;
}
const GroupMeetingDetails = ({ item, onClose }: GroupDetailsProps) => {
  const info = {
    title: item?.title ?? '',
    group: `Grupo : ${item?.groups.name}`,
    mod: `${
      item?.groups.moderator.profile.firstName +
      ' ' +
      item?.groups.moderator.profile.lastName
    }`,
    createdAt: item?.createdAt as string,
  };
  return (
    <div className="gmd-content">
      <span className="gmd-close">
        <Button
          text="Cerrar"
          className="attendance-add-btn"
          onClick={onClose}
          style={{ backgroundColor: 'red' }}
        />
      </span>
      <section className="gmd-info">
        <div className="gmd-row">
          <h5>Asunto de la reunion:</h5>
          <h5 className="gmd-text">{item.title}</h5>
        </div>
        <div className="gmd-row">
          <h5>Fecha:</h5>
          <h5 className="gmd-text">{_date(item.createdAt as Date)}</h5>
        </div>
        <div className="gmd-row">
          <h5>Grupo:</h5>
          <h5 className="gmd-text">Grupo: {item.groups.gNumber}</h5>
        </div>
        <div className="gmd-row">
          <h5>Archivo</h5>
          <DutyPdf info={info} attendance={item.attendance} duty={item.duty} />
        </div>
      </section>
      <div className="divider" style={{ backgroundColor: '#0000004D' }}></div>
      <h1>Asistencia</h1>
      <section className="gmd-attendance">
        <div className="gmd-table">
          <h3 className="gmd-headers">#</h3>
          <h3 className="gmd-headers">NOMBRES</h3>
          <h3 className="gmd-headers">ASISTENCIA</h3>
        </div>
        {item.attendance.map((value, idx) => (
          <div className="gmd-table-row" key={value.id}>
            <h3 className="gmd-table-col">{idx + 1}</h3>
            <h3 className="gmd-table-col">
              {value.user.profile.firstName + '' + value.user.profile.lastName}
            </h3>
            <h3 className="gmd-table-col">{value.status}</h3>
          </div>
        ))}
      </section>
      <div className="divider" style={{ backgroundColor: '#0000004D' }}></div>
      <h1>Compromisos</h1>
      <section className="gmd-duty">
        {item.duty.map(value => (
          <div className="gmd-duty-card" key={value.id}>
            <div className="gmd-duty-name">
              <h3 className="gmd-name">Nombre: {value.fullName}</h3>
              <h3>Plazo: {_date(value.untilDate as Date)}</h3>
            </div>
            <div className="gmd-description">
              <h3 style={{ fontWeight: '600' }}>Compromiso:</h3>
              <p className="gmd-text-des">{value.description}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default GroupMeetingDetails;
