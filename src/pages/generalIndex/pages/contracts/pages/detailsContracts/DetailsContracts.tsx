import './detailsContracts.css';
import { Schedule } from '../../../../../../types';
import { _date, actualDate, SnackbarUtilities } from '../../../../../../utils';
import { FocusEvent, useEffect, useState } from 'react';
import { Button } from '../../../../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../../store';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { getContractThunks } from '../../../../../../store/slices/contract.slice';
import { v4 as uuidv4 } from 'uuid';

import {
  ContractRowSchedule,
  ContractRowPhase,
  ContractRow,
} from './components';
import {
  CONTACT_PHASES_TITLE,
  ContractPhases,
  INIT_VALUES_PHASE,
  PhaseData,
} from './models';
import { useSearchParams } from 'react-router-dom';

export const DetailsContracts = () => {
  const [textareaValue, setTextareaValue] = useState<string | null>(null);
  const contract = useSelector((state: RootState) => state.contract);
  const [dataPhases, setDataPhases] = useState<PhaseData[]>([]);
  const [viewTableEjecution, setViewTableEjecution] = useState(true);
  const [params, setParams] = useSearchParams();
  const dispatch: AppDispatch = useDispatch();
  const [contractPhase, setContractPhase] =
    useState<ContractPhases>('convocationPhase');

  if (!contract) return <div></div>;
  const { details } = contract;
  const dataProcedures = {
    ['Nombre de Contrato']: contract.contractNumber,
    ['Nomenclatura']: contract.name,
    ['CUI']: contract.cui,
    ['Nombre largo del proyecto']: contract.projectName,
    ['Fecha de firma de contrato']: actualDate(new Date(contract.createdAt)),
  };

  useEffect(() => {
    if (contract) {
      const { phases } = contract;
      const covertPhases = JSON.parse(phases);
      setDataPhases(covertPhases);
    }
  }, [contract]);

  const toglePhase = (type: ContractPhases) => {
    setContractPhase(type);
  };

  const addPhase = (phase: PhaseData, type: keyof PhaseData) => {
    const updatePhase = dataPhases.map(dataPhase => {
      if (dataPhase.id === phase.id) return phase;
      if (type === 'isActive') return { ...dataPhase, isActive: false };
      return dataPhase;
    });
    setDataPhases(updatePhase);
  };
  const handleDelete = () => {
    axiosInstance
      .put(`/contract/${contract.id}/details`, { details: null })
      .then(() => dispatch(getContractThunks(String(contract.id))));
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
      const details = JSON.stringify(data);
      axiosInstance
        .put(`/contract/${contract.id}/details`, { details })
        .then(() => dispatch(getContractThunks(String(contract.id))));
    } catch (err) {
      SnackbarUtilities.error('Formato Invalido');
    }
  };
  const handleChange = (e: FocusEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setTextareaValue(value);
  };
  const handleViewEjecution = () => {
    setViewTableEjecution(!viewTableEjecution);
  };
  const deletePhase = (id: string) => {
    const newPhases = dataPhases.filter(phases => phases.id !== id);
    setDataPhases(newPhases);
  };
  const addNewInput = () => {
    const newPhase = [...dataPhases, { ...INIT_VALUES_PHASE, id: uuidv4() }];
    setDataPhases(newPhase);
  };
  const savePhases = () => {
    const phases = JSON.stringify(dataPhases);
    axiosInstance
      .put(`/contract/${contract.id}/phases`, { phases })
      .then(() => {
        params.set('savePhase', String(new Date().getTime()));
        setParams(params);
        dispatch(getContractThunks(String(contract.id)));
        handleViewEjecution();
      });
  };
  return (
    <div className="detailsContracts">
      <div>
        <h5 className="detailsContracts-title">Datos del Procedimiento</h5>
        {Object.entries(dataProcedures).map(([title, value]) => (
          <ContractRow key={title} title={title} value={value} />
        ))}
        <div className="detailsContracts-row-container" />
      </div>
      <div className="detailsContracts-phases-contain">
        <div className="detailsContracts-phases-contain-titles">
          {CONTACT_PHASES_TITLE.map(({ title, type }) => (
            <h4
              key={type}
              className={`detailsContracts-phases-title ${
                contractPhase === type &&
                'detailsContracts-phases-title--active'
              }`}
              onClick={() => toglePhase(type)}
            >
              {title}
            </h4>
          ))}
        </div>
        <div className="detailsContracts-title-container">
          <h5 className="detailsContracts-title">
            {contractPhase === 'convocationPhase'
              ? 'Cronograma del procedimiento'
              : 'Cronograma de ejecución'}
          </h5>
          {contractPhase === 'convocationPhase' && (
            <Button
              className="detailsContracts-btn detailsContracts-btn-red"
              text="Reintentar"
              icon="refresh"
              onClick={handleDelete}
            />
          )}
          {contractPhase === 'ejecutionPhase' && (
            <Button
              className="detailsContracts-btn detailsContracts-btn-red"
              text={viewTableEjecution ? 'Editar' : 'Ver Tabla'}
              onClick={handleViewEjecution}
            />
          )}
        </div>
        {contractPhase === 'convocationPhase' && (
          <>
            {details ? (
              <div>
                <ContractRowSchedule
                  title={'Etapa'}
                  firstValue={'Fecha Inicio'}
                  secondValue={'Fecha Fin'}
                  isHeader
                />
                {(JSON.parse(details) as Schedule[])?.map(
                  ({ title, finishDate, initDate }) => (
                    <ContractRowSchedule
                      key={title}
                      firstValue={initDate}
                      secondValue={finishDate}
                      title={title}
                    />
                  )
                )}
                <div className="detailsContracts-row-schedule" />
              </div>
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
          </>
        )}

        {contractPhase === 'ejecutionPhase' &&
          (viewTableEjecution ? (
            <div>
              <ContractRowSchedule
                title={'Etapa'}
                firstValue={'Plazo de presentación'}
                secondValue={'Activo'}
                isHeader
              />
              {dataPhases.map(({ days, name, isActive }) => (
                <ContractRowSchedule
                  title={name}
                  firstValue={`${days} dias `}
                  secondValue={isActive ? '✅' : ''}
                />
              ))}
              <div className="detailsContracts-row-container" />
            </div>
          ) : (
            <div className="detailsContracts-phase-ejecution">
              <div className="detailsContracts-phase-ejecution-img">
                <figure className="detailsContracts-phase-ejecution-figure">
                  <img
                    src="/img/example-day-ejecution.png"
                    alt="dias en ejecucion"
                  />
                </figure>
              </div>
              <div className="detailsContracts-phase-ejecution-data">
                <div className="detailsContracts-phase-ejecution-row">
                  <span className="detailsContracts-text-title">Etapa</span>
                  <span className="detailsContracts-text-title">
                    Plazo de presentación
                  </span>
                  <span className="detailsContracts-text-title">Activo</span>
                </div>
                {dataPhases.map(phaseData => (
                  <ContractRowPhase
                    key={phaseData.id}
                    addPhase={addPhase}
                    deletePhase={deletePhase}
                    phaseData={phaseData}
                  />
                ))}
                <span
                  onClick={addNewInput}
                  className="detailsContracts-add-span"
                >
                  Añadir nuevo plazo
                </span>
                <Button
                  className="detailsContracts-btn"
                  text="Guardar"
                  onClick={savePhases}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DetailsContracts;
