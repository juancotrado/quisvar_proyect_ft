import { ContextMenuTrigger } from 'rctx-contextmenu';
import { URL } from '../../../../../../services/axiosInstance';
import { Option, Training, TrainingSpecialty } from '../../../../../../types';
import { formatDate } from '../../../../../../utils';
import './trainingTable.css';
import { DotsRight, Button } from '../../../../../../components';

interface ExperienceTableProps {
  datos: Training['trainingSpecialistName'];
  id: number;
  handleFuntion: (open: boolean, identifier: number) => void;
  handleEdit: (
    open: boolean,
    identifier: number,
    data: TrainingSpecialty
  ) => void;
  handleDelete: (id: number) => void;
}
const TrainingTable = ({
  datos,
  id,
  handleFuntion,
  handleEdit,
  handleDelete,
}: ExperienceTableProps) => {
  const formattedDate = (value: Date) => {
    const newDate = formatDate(new Date(value), {
      month: 'short',
      year: 'numeric',
    });
    return newDate;
  };
  return (
    <div className="training-table-content">
      <div className="experience-table-title">
        <h4 className="ex-table-title-text">Capacitaciones y certificados</h4>
        <Button
          text="+ Agregar Capacitación"
          className="exp-table-title-btn"
          onClick={() => handleFuntion(true, id)}
        />
      </div>
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
          const optionsData: Option[] = [
            {
              name: 'Editar',
              type: 'button',
              icon: 'pencil',
              function: () => handleEdit(true, dato.id, dato),
            },
            {
              name: 'Eliminar',
              type: 'button',
              icon: 'trash-red',
              function: () => handleDelete(dato.id),
            },
          ];
          return (
            <>
              <ContextMenuTrigger
                className="training-table-body"
                key={idx}
                id={`training-table-${dato.id}`}
              >
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
                  {formattedDate(dato.startDate as Date) +
                    ' - ' +
                    formattedDate(dato.untilDate as Date)}
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
              </ContextMenuTrigger>
              <DotsRight
                data={optionsData}
                idContext={`training-table-${dato.id}`}
              />
            </>
          );
        })}
    </div>
  );
};

export default TrainingTable;
