import { useLocation } from 'react-router-dom';
import './detailsContracts.css';
import { Contract, Schedule } from '../../../../types/types';
import { _date } from '../../../../utils/formatDate';
import { FocusEvent, useEffect, useState } from 'react';
import { SnackbarUtilities } from '../../../../utils/SnackbarManager';
import Button from '../../../../components/shared/button/Button';

const DetailsContracts = () => {
  const [schedules, setSchedules] = useState<Schedule[] | null>(null);
  const { state } = useLocation();
  const [textareaValue, setTextareaValue] = useState<string | null>(null);
  const contract: Contract = state.contract;
  const dataProcedures = {
    ['Nomenclatura']: contract.name,
    ['Descripcion del Objeto']: contract.projectName,
    ['Fecha y Hora de Publicacion']: _date(new Date(contract.createdAt)),
  };
  const handleDelete = () => {
    setSchedules(null);
  };
  const transformShedule = () => {
    try {
      if (!textareaValue) throw new Error();
      const [_header, ...body] = textareaValue.split('\n');
      const data: Schedule[] = [];
      for (let i = 0; i < body.length; i += 2) {
        const otherBody = body[i + 1].split('\t');
        if (otherBody.length === 2) {
          const [initDate, finishDate] = otherBody;
          data.push({
            title: body[i],
            initDate,
            finishDate,
          });
        }
        if (otherBody.length === 3) {
          const [moreValue, initDate, finishDate] = otherBody;
          data.push({
            title: `${body[i]} - ${moreValue}`,
            initDate,
            finishDate,
          });
        }
      }
      setSchedules(data);
    } catch (err) {
      SnackbarUtilities.error('Formato Invalido');
    }
  };
  const handleChange = (e: FocusEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setTextareaValue(value);
  };
  return (
    <div className="detailsContracts">
      <div>
        <h5 className="detailsContracts-title">Datos del Procedimiento</h5>
        {Object.entries(dataProcedures).map(([title, value]) => (
          <div key={title} className="detailsContracts-row-container">
            <span className="detailsContracts-text-subtitle">{title}</span>
            <span className="detailsContracts-text-info">{value}</span>
          </div>
        ))}
        <div className="detailsContracts-row-container" />
      </div>
      <div>
        <div className="detailsContracts-title-container">
          <h5 className="detailsContracts-title">
            Cronograma del procedimiento
          </h5>
          <Button
            className="detailsContracts-btn detailsContracts-btn-red"
            text="Reintentar"
            icon="refresh"
            onClick={handleDelete}
          />
        </div>
        {schedules ? (
          <>
            <div className="detailsContracts-row-schedule">
              <span className="detailsContracts-text-title">Etapa</span>
              <span className="detailsContracts-text-title">Fecha Inicio</span>
              <span className="detailsContracts-text-title">Fecha Fin</span>
            </div>
            {schedules?.map(schedule => (
              <div
                key={schedule.title}
                className="detailsContracts-row-schedule"
              >
                <span className="detailsContracts-text-subtitle">
                  {schedule.title}
                </span>
                <span className="detailsContracts-text-info">
                  {schedule.initDate}
                </span>
                <span className="detailsContracts-text-info">
                  {schedule.finishDate}
                </span>
              </div>
            ))}
            <div className="detailsContracts-row-schedule" />
          </>
        ) : (
          <div className="detailsContract-schedule-transform">
            <textarea
              className="detailsContracts-textarea"
              name="textarea"
              rows={10}
              onBlur={handleChange}
            />
            <Button
              className="detailsContracts-btn"
              text="Procesar"
              onClick={transformShedule}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsContracts;
