import { useParams } from 'react-router-dom';
import './specialistInformation.css';
import { getIconDefault } from '../../../utils/tools';
import {
  Experience,
  SpecialistProject,
  Specialists,
  Training,
} from '../../../types/types';
import { useCallback, useEffect, useState } from 'react';
import { URL, axiosInstance } from '../../../services/axiosInstance';
import formatDate from '../../../utils/formatDate';
import { AnimatePresence, motion } from 'framer-motion';
import {
  isOpenAddExperience$,
  isOpenAddTraining$,
} from '../../../services/sharingSubject';
import CardAddExperience from '../../../components/shared/card/cardAddExperience/CardAddExperience';
import { ExperienceTable, TrainingTable } from '../../../components';
import { sumAllExperience } from '../../../utils/experienceFunctions/experienceFunctions';
import CardAddTraining from '../../../components/shared/card/cardAddTraining/CardAddTraining';

const SpecialistInformation = () => {
  const { infoId } = useParams();
  const [data, setData] = useState<Specialists>();
  const [experiences, setExperiences] = useState<Experience[]>();
  const [training, setTraining] = useState<Training[]>();
  const [projectSelected, setProjectSelected] = useState<number | null>(null);
  const [experienceSelected, setExperienceSelected] = useState<number | null>(
    null
  );
  const [trainingSelected, setTrainingSelected] = useState<number | null>(null);
  const toggleDetailProject = (projectID: number) => {
    if (projectSelected === projectID) {
      setProjectSelected(null);
    } else {
      setProjectSelected(projectID);
    }
  };
  const toggleDetailExperience = (experienceID: number) => {
    if (experienceSelected === experienceID) {
      setExperienceSelected(null);
    } else {
      setExperienceSelected(experienceID);
    }
  };
  const toggleDetailTraining = (trainingID: number) => {
    if (trainingSelected === trainingID) {
      setTrainingSelected(null);
    } else {
      setTrainingSelected(trainingID);
    }
  };
  const getSpecialist = useCallback(() => {
    axiosInstance
      .get(`/specialists/information/${infoId}`)
      .then(item => setData(item.data));
  }, [infoId]);
  const getExperience = useCallback(() => {
    axiosInstance
      .get(`/areaSpecialty/${infoId}`)
      .then(item => setExperiences(item.data));
  }, [infoId]);
  const getTraining = useCallback(() => {
    axiosInstance
      .get(`/trainingSpecialty/${infoId}`)
      .then(item => setTraining(item.data));
  }, [infoId]);
  useEffect(() => {
    getSpecialist();
    getExperience();
    getTraining();
    return () => {
      setProjectSelected(null);
      setExperienceSelected(null);
      setTrainingSelected(null);
    };
  }, [getExperience, getSpecialist, getTraining]);

  const getDate = (value: string) => {
    const date = formatDate(new Date(value), {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
    return date;
  };
  const handleAddExperience = () => {
    isOpenAddExperience$.setSubject = true;
  };
  const handleAddTraining = () => {
    isOpenAddTraining$.setSubject = true;
  };

  return (
    <>
      <div className="specialist-experience">
        <section className="specialist-info-exp">
          <span className="specialist-info-title">Especialidades</span>
          <div className="specialist-more-info">
            {experiences &&
              experiences.map((experience, idx) => {
                const res = sumAllExperience(experience.datos);
                return (
                  <div className="smi-container" key={experience.specialtyName}>
                    <div
                      className="smi-items"
                      onClick={() => toggleDetailExperience(idx)}
                    >
                      <div className="smi-specialty-name">
                        <h3>Especialidad: </h3>
                        <h4>{experience.specialtyName}</h4>
                      </div>
                      <div className="smi-specialty-name">
                        <h3>Años de experiencia: </h3>
                        <h4>{`${res.totalYears} año(s) y ${res.totalMonths} mes(es)`}</h4>
                      </div>
                      <img
                        src="/svg/down.svg"
                        alt=""
                        style={{ width: '20px' }}
                      />
                    </div>
                    {experienceSelected === idx &&
                      experience.datos.length > 0 && (
                        <ExperienceTable datos={experience.datos} />
                      )}
                  </div>
                );
              })}
            <span className="smi-add-specialty" onClick={handleAddExperience}>
              <img src="/svg/plus.svg" alt="" style={{ width: '12px' }} />
              <h3>Añadir especialidad</h3>
            </span>
          </div>
        </section>
        <section className="specialist-info-exp">
          <span className="specialist-info-title">Capacitaciones</span>
          <div className="specialist-more-info">
            {training &&
              training.map((train, idx) => (
                <div className="smi-container" key={train.trainingName}>
                  <div
                    className="smi-items"
                    onClick={() => toggleDetailTraining(idx)}
                  >
                    <div className="smi-specialty-name">
                      <h3>Tipo de capacitacion: </h3>
                      <h4>{train.trainingName}</h4>
                    </div>
                    <div className="smi-specialty-name">
                      <h3>Cantidad: </h3>
                      <h4>
                        {train.datos.length} {`certificado(s)`}
                      </h4>
                    </div>
                    <img src="/svg/down.svg" alt="" style={{ width: '20px' }} />
                  </div>
                  {trainingSelected === idx && train.datos.length > 0 && (
                    <TrainingTable datos={train.datos} />
                  )}
                </div>
              ))}

            <span className="smi-add-specialty" onClick={handleAddTraining}>
              <img src="/svg/plus.svg" alt="" style={{ width: '12px' }} />
              <h3>Añadir capacitación</h3>
            </span>
          </div>
        </section>
      </div>
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
          {data &&
            data?.projects.map(({ project }: SpecialistProject) => (
              <div
                key={project.id}
                onClick={() => toggleDetailProject(project.id)}
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
                      {project.stages.length > 0 &&
                        project.stages.map(stage => (
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
              </div>
            ))}
        </div>
      </div>
      <CardAddExperience onSave={getExperience} />
      <CardAddTraining onSave={getTraining} />
    </>
  );
};

export default SpecialistInformation;
