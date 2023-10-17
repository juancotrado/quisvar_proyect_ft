import { URL } from '../../services/axiosInstance';
import { Experience } from '../../types/types';
import { calcDates } from '../../utils/experienceFunctions/experienceFunctions';
import formatDate, { _date } from '../../utils/formatDate';
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
        <div>ITEM</div>
        <div>INSTITUCION</div>
        <div>DESCRIPCION</div>
        <div>FECHA</div>
        <div>PERMANENCIA</div>
        <div>DOCUMENTO</div>
      </div>
      {datos &&
        datos.map((dato, idx) => {
          const res = calcDates(dato.startDate, dato.untilDate);
          return (
            <div className="experience-table-body" key={idx}>
              <div>{idx + 1}</div>
              <div>{dato.institution}</div>
              <div>descripcion</div>
              <div>
                {formattedDate(dato.startDate) +
                  ' - ' +
                  formattedDate(dato.untilDate)}
              </div>
              <div>{`${res.years} año(s) y ${res.months} mes(es)`}</div>
              <div>
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
