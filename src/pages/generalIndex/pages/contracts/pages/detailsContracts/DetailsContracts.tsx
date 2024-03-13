import './detailsContracts.css';
import { ContractIndexData, Schedule } from '../../../../../../types';
import { _date, actualDate, SnackbarUtilities } from '../../../../../../utils';
import { FocusEvent, useEffect, useState } from 'react';
import { Button } from '../../../../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../../store';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { getContractThunks } from '../../../../../../store/slices/contract.slice';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

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
import { getStatusColor } from '../../utils';

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
  const contractIndex: ContractIndexData[] = JSON.parse(
    contract?.indexContract
  );
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
      const convertPhases = JSON.parse(phases);
      setDataPhases(convertPhases);
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
    const phaseLevel = contractIndex.at(1)?.nextLevel?.[1].nextLevel;
    const findPhaseLevel = phaseLevel?.find(
      phase => phase.deliverLettersId === id
    );
    if (findPhaseLevel?.hasFile === 'yes')
      return SnackbarUtilities.error('Asegurese de borrar el archivo antes.');
    const newPhases = dataPhases.filter(phases => phases.id !== id);
    setDataPhases(newPhases);
  };
  const hasFileInPay = (id: string) => {
    const payLevel = contractIndex.at(1)?.nextLevel?.[0].nextLevel;

    const findPayLevel = payLevel?.find(pay => pay.deliverLettersId === id);

    return findPayLevel?.hasFile === 'yes';
  };
  const statusPhase = (id: string) => {
    const phaseLevel = contractIndex.at(1)?.nextLevel?.[1].nextLevel;

    const dataPhasesWithStatus = phaseLevel?.map((phase, i) => {
      const statusTime = getStatusColor(
        contract.createdAt,
        dataPhases[i],
        phase.uploadDate ?? new Date()
      );
      let status = 'black';
      if (phaseLevel[i - 1]?.hasFile === 'yes') {
        status = statusTime;
      }
      if (phase.hasFile === 'yes') {
        if (statusTime === 'skyBlue') {
          status = 'green';
        }
        if (statusTime === 'yellow') {
          status = 'green';
        }
        if (statusTime === 'red') {
          status = 'gray';
        }
      }
      return {
        ...dataPhases[i],
        status,
      };
    });
    const findStatusPhase = dataPhasesWithStatus?.find(
      dataPha => dataPha.id === id
    );
    return findStatusPhase?.status ?? 'pink';
  };
  const addNewInput = () => {
    const newPhase = [...dataPhases, { ...INIT_VALUES_PHASE, id: uuidv4() }];
    setDataPhases(newPhase);
  };
  const savePhases = async () => {
    const phases = JSON.stringify(dataPhases);
    await axiosInstance.put(`/contract/${contract.id}/phases`, { phases });
    await updateContractIndex();
    params.set('savePhase', String(new Date().getTime()));
    setParams(params);
    dispatch(getContractThunks(String(contract.id)));
    handleViewEjecution();
  };

  const updateContractIndex = async () => {
    const covertPhases: PhaseData[] = dataPhases;
    const levelId2 = contractIndex.at(1)?.nextLevel;
    const payArray = covertPhases
      .map(phase => phase.payData)
      .filter(phase => phase)
      .flat();
    if (levelId2) {
      const phaseTransform = covertPhases.map((pha, i) => {
        const findPhase = levelId2[1].nextLevel?.find(
          phaNext => phaNext.deliverLettersId === pha.id
        );
        return {
          id: `2.2.${i + 1}`,
          name: `Entregable ${i + 1}`,
          nivel: 3,
          hasFile: findPhase ? findPhase.hasFile : 'no',
          deliverLettersId: pha.id,
        };
      });
      const payTransform = payArray.map((pay, i) => {
        const findPay = levelId2[0].nextLevel?.find(
          payNext => payNext.deliverLettersId === pay.id
        );
        return {
          id: `2.1.${i + 1}`,
          name: `Carta de pago ${i + 1}`,
          nivel: 3,
          hasFile: findPay ? findPay.hasFile : 'no',
          deliverLettersId: pay.id,
        };
      });
      // const payTransfomr=covertPhases.map(({}))
      levelId2[1].nextLevel = phaseTransform;
      levelId2[0].nextLevel = payTransform;
      const indexContract = JSON.stringify(contractIndex);
      await axiosInstance.put(`/contract/${contract.id}/index`, {
        indexContract,
      });
    }
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
                  data={{
                    1: { value: 'Etapa', fr: '1fr' },
                    2: { value: 'Fecha Inicio', fr: '1fr' },
                    3: { value: 'Fecha Fin', fr: '1fr' },
                  }}
                  isHeader
                />
                {(JSON.parse(details) as Schedule[])?.map(
                  ({ title, finishDate, initDate }) => (
                    <ContractRowSchedule
                      key={title}
                      data={{
                        1: { value: title, fr: '1fr' },
                        2: { value: initDate, fr: '1fr' },
                        3: { value: finishDate, fr: '1fr' },
                      }}
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
                data={{
                  1: { value: 'Entregable', fr: '1fr' },
                  2: { value: 'Descripción', fr: '2fr' },
                  3: { value: 'Plazo', fr: '1fr' },
                  4: { value: 'Fecha limite', fr: '1fr' },
                  5: { value: 'Carta de pago', fr: '1fr' },
                }}
                isHeader
              />
              {dataPhases.map(({ days, name, isActive, id, payData }, i) => (
                <ContractRowSchedule
                  key={id}
                  data={{
                    1: { value: String(i + 1), fr: '1fr' },
                    2: { value: name, fr: '2fr' },
                    3: { value: `${days} dias `, fr: '1fr' },
                    4: {
                      value: moment(contract.createdAt)
                        .add(days, 'days')
                        .format('DD-MM-YYYY'),
                      fr: '1fr',
                    },
                    5: { value: isActive ? '✅' : '', fr: '1fr' },
                  }}
                  statusPhase={() => statusPhase(id)}
                  hasFileInPay={hasFileInPay}
                  extraData={payData}
                />
              ))}
              <div className="detailsContracts-row-container" />
            </div>
          ) : (
            <div className="detailsContracts-phase-ejecution-data">
              <div className="detailsContracts-phase-ejecution-row">
                <span className="detailsContracts-text-title">Entregable</span>
                <span className="detailsContracts-text-title">Descripcion</span>
                <span className="detailsContracts-text-title">
                  Plazo de presentación
                </span>
              </div>
              <div className="detailsContracts-phases">
                {dataPhases.map((phaseData, i) => (
                  <ContractRowPhase
                    key={phaseData.id}
                    addPhase={addPhase}
                    deletePhase={deletePhase}
                    phaseData={phaseData}
                    index={i + 1}
                    contractIndex={contractIndex}
                  />
                ))}
              </div>
              <span
                onClick={addNewInput}
                className="detailsContracts-add-span "
              >
                Añadir nuevo plazo
              </span>
              <Button
                className="detailsContracts-btn"
                text="Guardar"
                onClick={savePhases}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default DetailsContracts;
