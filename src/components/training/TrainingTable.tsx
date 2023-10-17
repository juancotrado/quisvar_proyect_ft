import { URL } from '../../services/axiosInstance';
import { Training } from '../../types/types';
import formatDate from '../../utils/formatDate';
import './trainingTable.css';
interface ExperienceTableProps {
  datos: Training['datos'];
}
const TrainingTable = ({ datos }: ExperienceTableProps) => {
  const formattedDate = (value: Date) => {
    const newDate = formatDate(new Date(value), {
      month: 'short',
      year: 'numeric',
    });
    return newDate;
  };
  return (
    <div className="training-table-content">
      <div className="training-table-header">
        <div className="ex-center">ITEM</div>
        <div>INSTITUCIÓN</div>
        <div>EMISIÓN</div>
        <div>DURACIÓN</div>
        <div>HORAS</div>
        <div className="ex-center">DOCUMENTO</div>
      </div>
      {datos &&
        datos.map((dato, idx) => {
          return (
            <div className="training-table-body" key={idx}>
              <div className="tr-center">{idx + 1}</div>
              <div>{dato.institution}</div>
              <div>
                {formatDate(new Date(dato.issue), {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
              <div>
                {formattedDate(dato.startDate) +
                  ' - ' +
                  formattedDate(dato.untilDate)}
              </div>
              <div>{dato.hours}</div>
              <div className="tr-center">
                <span className="specialist-icon-cv">
                  <a
                    href={`${URL}/file-user/training/${dato?.trainingFile}`}
                    target="_blank"
                  >
                    <img
                      src="/svg/pdf-red.svg"
                      className="specialist-info-icon"
                    />
                  </a>
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default TrainingTable;
