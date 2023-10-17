import { URL } from '../../services/axiosInstance';
import { Experience } from '../../types/types';
import { calcDates } from '../../utils/experienceFunctions/experienceFunctions';
import formatDate from '../../utils/formatDate';
import './experienceTable.css';
interface ExperienceTableProps {
  datos: Experience['datos'];
}
const ExperienceTable = ({ datos }: ExperienceTableProps) => {
  const formattedDate = (value: Date) => {
    const newDate = formatDate(new Date(value), {
      month: 'short',
      year: 'numeric',
    });
    return newDate;
  };
  return (
    <div className="experience-table-content">
      <div className="experience-table-header">
        <div className="ex-center">ITEM</div>
        <div>INSTITUCIÓN</div>
        <div>DESCRIPCIÓN</div>
        <div>FECHA</div>
        <div>PERMANENCIA</div>
        <div className="ex-center">DOCUMENTO</div>
      </div>
      {datos &&
        datos.map((dato, idx) => {
          const res = calcDates(dato.startDate, dato.untilDate);
          return (
            <div className="experience-table-body" key={idx}>
              <div className="ex-center">{idx + 1}</div>
              <div>{dato.institution}</div>
              <div>descripcion</div>
              <div>
                {formattedDate(dato.startDate) +
                  ' - ' +
                  formattedDate(dato.untilDate)}
              </div>
              <div>{`${res.years} año(s) y ${res.months} mes(es)`}</div>
              <div className="ex-center">
                <span className="specialist-icon-cv">
                  <a
                    href={`${URL}/file-user/specialty/${dato?.file}`}
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

export default ExperienceTable;
