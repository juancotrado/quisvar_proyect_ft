import { useParams } from 'react-router-dom';
import './specialistInformation.css';
import { getIconDefault } from '../../../../utils';
import {
  AreaSpecialty,
  Experience,
  // SpecialistProject,
  Specialists,
  Training,
  TrainingSpecialty,
} from '../../../../types';
import { useCallback, useEffect, useState } from 'react';
import { URL, axiosInstance } from '../../../../services/axiosInstance';
import {
  isOpenAddExperience$,
  isOpenAddTraining$,
  isOpenCardSpecialist$,
} from '../../../../services/sharingSubject';
import { ExperienceInformation, TrainingInformation } from './components';
import { CardAddExperience, CardAddTraining } from './views';
// import { CardSpecialist } from '../../views';

export const SpecialistInformation = () => {
  const { infoId } = useParams();
  const [data, setData] = useState<Specialists>();
  const [experiences, setExperiences] = useState<Experience[]>();
  const [training, setTraining] = useState<Training[]>();
  const [, setProjectSelected] = useState<number | null>(null);

  // const toggleDetailProject = (projectID: number) => {
  //   if (projectSelected === projectID) {
  //     setProjectSelected(null);
  //   } else {
  //     setProjectSelected(projectID);
  //   }
  // };
  const getSpecialist = useCallback(() => {
    axiosInstance
      .get(`/specialists/information/${infoId}`)
      .then(item => setData(item.data));
  }, [infoId]);
  const getExperience = useCallback(() => {
    axiosInstance
      .get(`/areaSpecialtyList/${infoId}`)
      .then(item => setExperiences(item.data));
  }, [infoId]);
  const getTraining = useCallback(() => {
    axiosInstance
      .get(`/trainingSpecialtyList/${infoId}`)
      .then(item => setTraining(item.data));
  }, [infoId]);
  useEffect(() => {
    getSpecialist();
    getExperience();
    getTraining();
    return () => {
      setProjectSelected(null);
    };
  }, [getExperience, getSpecialist, getTraining, infoId]);

  // const getDate = (value: string) => {
  //   const date = formatDate(new Date(value), {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: '2-digit',
  //   });
  //   return date;
  // };
  const handleAddExperience = (value: boolean, identifier: number) => {
    isOpenAddExperience$.setSubject = {
      isOpen: value,
      id: identifier,
    };
  };
  const handleEditExperience = (
    value: boolean,
    identifier: number,
    data: AreaSpecialty
  ) => {
    isOpenAddExperience$.setSubject = {
      isOpen: value,
      id: identifier,
      data,
    };
  };
  const handleAddTraining = (value: boolean, identifier: number) => {
    isOpenAddTraining$.setSubject = {
      isOpen: value,
      id: identifier,
    };
  };
  const handleEditTraining = (
    value: boolean,
    identifier: number,
    data: TrainingSpecialty
  ) => {
    isOpenAddTraining$.setSubject = {
      isOpen: value,
      id: identifier,
      data,
    };
  };
  const handleEditInfo = (specialist?: Specialists) => {
    isOpenCardSpecialist$.setSubject = {
      isOpen: true,
      data: specialist,
      function: () => getSpecialist(),
    };
  };
  return (
    <>
      <div className="specialist-experience">
        <section className="specialist-info-exp">
          <ExperienceInformation
            onSave={getExperience}
            handleAddExperience={handleAddExperience}
            handleEditExperience={handleEditExperience}
            experiences={experiences}
          />
        </section>
        <section className="specialist-info-exp">
          <TrainingInformation
            training={training}
            onSave={getTraining}
            handleAddTraining={handleAddTraining}
            handleEditTraining={handleEditTraining}
          />
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
                onClick={e => {
                  e.stopPropagation();
                  handleEditInfo(data);
                }}
              />
              <span className="specialist-icon-cv">
                <a href={`${URL}/file-user/cv/${data?.cvFile}`} target="_blank">
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
            <h3>{data?.tuition}</h3>
          </div>
          <div className="specialist-info-rows">
            <h3>Correo:</h3>
            <h3>{data?.email}</h3>
          </div>
        </div>
        <hr className="specialist-hr" />
        {/* <div className="specialist-projects-list">
        <h3 className="specialist-sub-title">Proyectos</h3>
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
      </div> */}
      </div>
      <CardAddExperience onSave={getExperience} />
      <CardAddTraining onSave={getTraining} />
    </>
  );
};

export default SpecialistInformation;
