import { useParams } from 'react-router-dom';
import './specialistInformation.css';
import { getIconDefault } from '../../../utils/tools';
import { SpecialistProject, Specialists } from '../../../types/types';
import { useCallback, useEffect, useState } from 'react';
import { URL, axiosInstance } from '../../../services/axiosInstance';
import formatDate from '../../../utils/formatDate';
import { AnimatePresence, motion } from 'framer-motion';

const SpecialistInformation = () => {
  const { infoId } = useParams();
  const [data, setData] = useState<Specialists>();
  const [projectSelected, setProjectSelected] = useState<number | null>(null);

  const toggleDetalleProyecto = (projectID: number) => {
    if (projectSelected === projectID) {
      setProjectSelected(null);
    } else {
      setProjectSelected(projectID);
    }
  };
  const getSpecialist = useCallback(() => {
    axiosInstance
      .get(`/specialists/information/${infoId}`)
      .then(item => setData(item.data));
  }, [infoId]);
  useEffect(() => {
    getSpecialist();
    return setProjectSelected(null);
  }, [getSpecialist]);
  const getDate = (value: string) => {
    const date = formatDate(new Date(value), {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
    return date;
  };
  return (
    <>
      <div className="specialist-experience"></div>
      <div className="specialist-data">
        <div className="specialist-main-info">
          <span className="specialist-main-img">
            <img
              className="specialist-img-size"
              src={data ? getIconDefault(data?.lastName) : '/svg/user_icon.svg'}
            />
          </span>
          <div className="specialist-info-text">
            <div className="specialist-icons-area">
              <img
                src="/svg/pencil-line.svg"
                className="specialist-info-icon"
              />
              <span className="specialist-icon-cv">
                <a href={`${URL}/file-user/cv/${data?.cv}`} target="_blank">
                  <img
                    src="/svg/download.svg"
                    className="specialist-info-icon"
                  />
                </a>
                <h4>CV</h4>
              </span>
            </div>
            <h1 className="specialist-info-name">
              {data?.firstName + ' ' + data?.lastName}
            </h1>
            <h3>{data?.career}</h3>
          </div>
        </div>
        <div className="specialist-aditional-info">
          <div className="specialist-info-rows">
            <h3>DNI:</h3>
            <h3>{data?.dni}</h3>
          </div>
          <div className="specialist-info-rows">
            <h3>Colegiatura:</h3>
            <h3>{data?.CIP}</h3>
          </div>
          <div className="specialist-info-rows">
            <h3>Correo:</h3>
            <h3>{data?.email}</h3>
          </div>
        </div>
        <hr className="specialist-hr" />
        <div className="specialist-projects-list">
          <h3>Proyectos</h3>
          {data?.projects.map(({ project }: SpecialistProject) => (
            <div
              key={project.id}
              onClick={() => toggleDetalleProyecto(project.id)}
              className="sp-motion-click"
            >
              <h4 className="sp-name">{project.name}</h4>
              <h4 className="sp-cui">CUI: {project.CUI}</h4>
              <AnimatePresence>
                {projectSelected === project.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="sp-motion-div"
                  >
                    {project.stages.map(stage => (
                      <div className="sp-details-area" key={stage.id}>
                        <h4 className="sp-details">{stage.name}</h4>
                        <h4 className="sp-details">
                          Inicio: {getDate(stage?.startDate)}
                        </h4>
                        <h4 className="sp-details">
                          Fin: {getDate(stage?.untilDate)}
                        </h4>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {/* <hr className="sp-hr" /> */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SpecialistInformation;
