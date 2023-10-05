import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { SocketContext } from '../../../../context/SocketContex';
import { Level, StatusType } from '../../../../types/types';
import { axiosInstance } from '../../../../services/axiosInstance';
import MoreInfo from '../../../../components/project/moreInfo/MoreInfo';
import DropdownLevel from '../../../../components/project/dropdownLevel/DropdownLevel';
import CardRegisterSubTask from '../../../../components/shared/card/cardRegisterSubTask/CardRegisterSubTask';
import Button from '../../../../components/shared/button/Button';
import { motion } from 'framer-motion';
import './budgetsPage.css';
import StatusText from '../../../../components/shared/statusText/StatusText';
import LoaderForComponent from '../../../../components/shared/loaderForComponent/LoaderForComponent';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { generateIndexPdf } from '../../../../components/shared/generateIndexPdf/GenerateIndexPdf';
import FloatingText from '../../../../components/shared/floatingText/FloatingText';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';

const BudgetsPage = () => {
  const { stageId } = useParams();
  const { modAuthProject } = useSelector((state: RootState) => state);

  const [levels, setlevels] = useState<Level | null>(null);
  const [openFilter, setOpenFilter] = useState(false);
  const socket = useContext(SocketContext);
  const getLevels = useCallback(() => {
    axiosInstance.get(`/stages/${stageId}`).then(res => {
      if (stageId) {
        socket.emit('join', `project-${stageId}`);
        setlevels({ ...res.data, stagesId: +stageId });
      }
    });
  }, [socket, stageId]);
  useEffect(() => {
    getLevels();
  }, [getLevels, stageId]);
  useEffect(() => {
    socket.on('server:update-project', (Level: Level) => {
      if (stageId) setlevels(Level);
    });
    return () => {
      socket.off('server:update-project');
    };
  }, [socket, stageId]);

  const levelFilter = (value: string) => {
    axiosInstance.get(`/stages/${stageId}?&status=${value}`).then(res => {
      if (stageId) {
        setlevels({ ...res.data, stagesId: +stageId });
      }
    });
  };

  const closeFilter = () => {
    getLevels();
    setOpenFilter(false);
  };

  const FilterOptions: StatusType[] = [
    'UNRESOLVED',
    'PROCESS',
    'INREVIEW',
    'DENIED',
    'DONE',
    'LIQUIDATION',
  ];
  if (!levels)
    return (
      <div className="task-loader">
        <LoaderForComponent />
      </div>
    );
  return (
    <>
      <div className="budgetsPage-filter">
        <FloatingText text="Descargar Indice" xPos={-50}>
          <PDFDownloadLink
            document={generateIndexPdf({ data: levels })}
            fileName={`${levels.projectName}.pdf`}
            className="budgetsPage-filter-icon"
          >
            <img src={`/svg/index-icon.svg`} />
            Indice
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
            {FilterOptions.map(option => (
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
      </div>
      <div className="budgetsPage-title-contain">
        <div className="budgetsPage-contain-left">
          <figure className="budgetsPage-figure">
            <img src="/svg/engineering.svg" alt="W3Schools" />
          </figure>
          <h4 className="budgetsPage-title">{levels?.projectName}</h4>
        </div>
        {levels && modAuthProject && (
          <div className="budgetsPage-contain-right">
            <MoreInfo data={levels} />
          </div>
        )}
      </div>
      <div className="budgetsPage-contain">
        {levels && <DropdownLevel level={levels} onSave={getLevels} />}
      </div>

      <Outlet />
      <CardRegisterSubTask />
    </>
  );
};

export default BudgetsPage;
