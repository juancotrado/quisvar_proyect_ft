import { URL } from '../../../../services/axiosInstance';
import { ListReport } from '../../../../types/types';
import Button from '../../button/Button';
import PaperCard from './PaperCard';
import './paperCardList.css';
interface PaperCardListProps {
  data: ListReport;
}

const PaperCardList = ({ data }: PaperCardListProps) => {
  const { profile } = data.user;

  const submitReport = () => {
    const _data = {
      id: data.id,
      stage: '',
    };
    return _data;
  };
  // const declineReport = () => {};
  return (
    <form action="">
      <ul className="paper-card-list-container">
        <li className="paper-list ">{data.id}</li>
        <li className="paper-list p-list-col-2">
          <span className="paper-list-text">
            {profile.lastName} {profile.firstName}
          </span>
        </li>
        <li className="paper-list p-list-col-2">
          <a
            href={`${URL}/reports/${data.name}`}
            target="_blank"
            className="subtaskFile-anchor"
            download={true}
          >
            <PaperCard
              description={data.name.split('$').at(-1)}
              icon="pdf-red"
            />
          </a>
        </li>
        <li className="paper-list p-list-col-22 paper-status">
          <PaperCard
            className="paper-status-card "
            description={`${
              data.status === 'DECLINE'
                ? 'Rechazado'
                : data.status === 'PROCESS'
                ? 'Pendiente'
                : 'Aceptado'
            }`}
            classInfo={`${data.status} paper-status-info`}
          />
        </li>
        <li className="paper-list p-list-col-2 list-options">
          <Button
            text="Aprobar"
            icon="check-white"
            className="paper-button-done"
          />
          <Button
            text="Denegar"
            icon="close"
            className="paper-button-decline"
          />
        </li>
        <li className="paper-list p-list-col-3 ">
          {/* {supervisor.comments ? (
            <p className="paper-comments">{data.comments}</p>
          ) : (
            <input
              className="paper-comments-input"
              type="text"
              placeholder="Escribir un comentario"
            />
          )} */}
        </li>
      </ul>
    </form>
  );
};

export default PaperCardList;
