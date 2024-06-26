import { useCallback, useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { ProjectContext, SocketContext } from '../../../../../../context';
import { DegreType, Level, StatusType } from '../../../../../../types';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { motion } from 'framer-motion';
import './budgetsPage.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store';
import {
  Button,
  FloatingText,
  LoaderForComponent,
  Select,
} from '../../../../../../components';
import { DropdownLevel, MoreInfo, StatusText } from '../../components';
import { COST_DATA, FILTER_OPTIONS } from './models';
import { GenerateDetailedIndexPdf, GenerateIndexPdf } from './pdfgenerator';
import { CardRegisterSubTask } from './views';
import { getIdsSubTasksRecursive } from '../../utils/tools';
import {
  handleCompressPdf,
  handleMergePdf,
} from '../../models/servicesProject';
import { TypeArchiver } from '../../models/types';
import { DaysTaskEdit } from '../../components/daysTaskEdit';

export const BudgetsPage = () => {
  const { stageId } = useParams();
  const { setDayTaksRef } = useContext(ProjectContext);

  const modAuthProject = useSelector(
    (state: RootState) => state.modAuthProject
  );
  const [status, setStatus] = useState<StatusType | ''>('');
  const [degree, setDegree] = useState<DegreType | ''>('');
  const [levels, setlevels] = useState<Level | null>(null);
  const [openFilter, setOpenFilter] = useState(false);
  const socket = useContext(SocketContext);
  const getLevels = useCallback(
    (signal: AbortSignal) => {
      axiosInstance
        .get(`/stages/${stageId}`, {
          headers: { noLoader: true },
          signal,
        })
        .then(res => {
          if (stageId) {
            socket.emit('join', `project-${stageId}`);
            const levels = { ...res.data, stagesId: +stageId };
            setlevels(levels);
            const idsLevel = getIdsSubTasksRecursive(levels);
            setDayTaksRef?.(idsLevel);
          }
        });
    },
    [socket, stageId]
  );

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    getLevels(signal);
    return () => {
      abortController.abort();
    };
  }, [getLevels, stageId]);

  useEffect(() => {
    if (!stageId) return;
    socket.on('server:budget-load-stage', (data: Level) => {
      setlevels({ ...data, stagesId: +stageId });
      const idsLevel = getIdsSubTasksRecursive(data);
      setDayTaksRef?.(idsLevel);
    });
    return () => {
      socket.off('server:budget-load-stage');
    };
  }, [socket]);
  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    getLevels(signal);
    return () => {
      abortController.abort();
    };
  }, [getLevels, stageId]);

  useEffect(() => {
    socket.on('server:update-project', (Level: Level) => {
      if (stageId) {
        setlevels(Level);
        const idsLevel = getIdsSubTasksRecursive(Level);
        setDayTaksRef?.(idsLevel);
      }
    });
    return () => {
      socket.off('server:update-project');
    };
  }, [socket, stageId]);

  const getLevelsForSocket = () => {
    axiosInstance.get(`/stages/${stageId}`).then(res => {
      socket.emit('client:update-project', { ...res.data, stagesId: stageId });
    });
  };
  const levelFilter = (value: StatusType | '') => {
    setStatus(value);
    axiosInstance
      .get(
        `/stages/${stageId}?${value && `status=${value}`}${
          degree && `&typecost=${degree}`
        }`
      )
      .then(res => {
        if (stageId) {
          setlevels({ ...res.data, stagesId: +stageId });
        }
      });
  };
  const levelFilterForDegree = (value: DegreType) => {
    setDegree(value);
    axiosInstance
      .get(
        `/stages/${stageId}?${status && `status=${status}`}${
          value && `&typecost=${value}`
        }`
      )
      .then(res => {
        if (stageId) {
          setlevels({ ...res.data, stagesId: +stageId });
        }
      });
  };

  const closeFilter = () => {
    setOpenFilter(false);
    levelFilter('');
  };

  if (!levels) return <LoaderForComponent />;
  const handleCompresStage = (type: TypeArchiver) =>
    handleCompressPdf(type, 'stage', levels.id, levels.name);

  const archiverOptions = [
    {
      name: 'Comprimir',
      fn: () => handleCompresStage('all'),
      icon: 'zip-normal',
    },
    {
      name: 'Comprimir PDF',
      fn: () => handleCompresStage('pdf'),
      icon: 'zip-pdf',
    },
    {
      name: 'Comprimir Editables',
      fn: () => handleCompresStage('nopdf'),
      icon: 'zip-edit',
    },
    {
      name: 'Unir PDFs',
      fn: () => handleMergePdf('level', levels.id, levels.name),
      icon: 'merge-pdf',
    },
  ];
  return (
    <>
      <div className="budgetsPage-filter-contain">
        <div className="budgetsPage-filter">
          <FloatingText text="Descargar Índice" xPos={-50}>
            <PDFDownloadLink
              document={<GenerateIndexPdf data={levels} />}
              fileName={`${levels.projectName}.pdf`}
              className="budgetsPage-filter-icon"
            >
              <figure className="budgetsPage-figure-icon">
                <img src={`/svg/index-icon.svg`} />
              </figure>
              Índice
            </PDFDownloadLink>
          </FloatingText>
          <FloatingText text="Descargar Índice" xPos={-50}>
            <PDFDownloadLink
              document={<GenerateDetailedIndexPdf data={levels} />}
              fileName={`${levels.projectName}.pdf`}
              className="budgetsPage-filter-icon"
            >
              <figure className="budgetsPage-figure-icon">
                <img src={`/svg/index-icon.svg`} />
              </figure>
              Índice Detallado
            </PDFDownloadLink>
          </FloatingText>
          <span
            className="budgetsPage-filter-icon"
            onClick={() => setOpenFilter(true)}
          >
            <img src="/svg/filter.svg" />
            Filtrar
          </span>

          {openFilter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="budgetsPage-filter-area"
            >
              {FILTER_OPTIONS.map(option => (
                <StatusText
                  key={option}
                  status={option}
                  onClick={() => levelFilter(option)}
                />
              ))}
              <Button
                onClick={closeFilter}
                icon="close"
                className="budgetsPage-filter-close"
              />
            </motion.div>
          )}
          <DaysTaskEdit />
        </div>
        <div className="budgetsPage-filter-select">
          <Select
            name="difficulty"
            data={COST_DATA}
            extractValue={({ key }) => key}
            renderTextField={({ value }) => value}
            defaultValue={degree}
            onChange={({ target }) =>
              levelFilterForDegree(target.value as DegreType)
            }
          />
        </div>
      </div>

      <div className="budgetsPage-contain ">
        <div className="budgetsPage-title-contain">
          <div className="budgetsPage-contain-left">
            <figure className="budgetsPage-figure">
              <img src="/svg/engineering.svg" alt="W3Schools" />
            </figure>
            <h4 className="budgetsPage-title">{levels?.projectName}</h4>
          </div>
          {levels && modAuthProject && (
            <div className="budgetsPage-contain-right">
              <MoreInfo data={levels} archiverOptions={archiverOptions} />
            </div>
          )}
        </div>
        {levels && <DropdownLevel level={levels} onSave={getLevelsForSocket} />}
      </div>

      <Outlet />
      <CardRegisterSubTask />
    </>
  );
};
