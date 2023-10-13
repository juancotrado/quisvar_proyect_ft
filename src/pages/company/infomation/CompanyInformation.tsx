import { useParams } from 'react-router-dom';
import './companyInformation.css';
import { useCallback, useEffect, useState } from 'react';
import { Companies } from '../../../types/types';
import { axiosInstance } from '../../../services/axiosInstance';
import { getIconDefault } from '../../../utils/tools';
import { AnimatePresence, motion } from 'framer-motion';

const CompanyInformation = () => {
  const { infoId } = useParams();
  console.log(infoId);

  const [data, setData] = useState<Companies>();
  const [projectSelected, setProjectSelected] = useState<number | null>(null);
  const toggleDetalleProyecto = (projectID: number) => {
    if (projectSelected === projectID) {
      setProjectSelected(null);
    } else {
      setProjectSelected(projectID);
    }
  };
  const getCompanies = useCallback(() => {
    axiosInstance
      .get(`/companies/information/${infoId}`)
      .then(item => setData(item.data));
  }, [infoId]);
  useEffect(() => {
    getCompanies();
    return setProjectSelected(null);
  }, [getCompanies]);

  return (
    <>
      <div className="specialist-experience"></div>
      <div className="specialist-data">
        <div className="specialist-main-info">
          <span className="specialist-main-img">
            <img
              className="specialist-img-size"
              src={data ? getIconDefault(data?.name) : '/svg/user_icon.svg'}
            />
          </span>
          <div className="specialist-info-text">
            <div className="specialist-icons-area">
              <img
                src="/svg/pencil-line.svg"
                className="specialist-info-icon"
              />
              <span className="specialist-icon-cv">
                <img src="/svg/download.svg" className="specialist-info-icon" />
                <h4>CV</h4>
              </span>
            </div>
            <h1 className="specialist-info-name">{data?.name}</h1>
            <h3>{data?.manager}</h3>
          </div>
        </div>
        <div className="specialist-aditional-info">
          <div className="specialist-info-rows">
            <h3>RUC:</h3>
            <h3>{data?.ruc}</h3>
          </div>
          <div className="specialist-info-rows">
            <h3>Domicilio Fiscal:</h3>
            <h3>{data?.address}</h3>
          </div>
          <div className="specialist-info-rows">
            <h3>Partida Registral:</h3>
            <h3>{data?.departure}</h3>
          </div>
        </div>
        <hr className="specialist-hr" />
        <div className="specialist-projects-list">
          <h3>Proyectos</h3>
        </div>
      </div>
    </>
  );
};

export default CompanyInformation;
