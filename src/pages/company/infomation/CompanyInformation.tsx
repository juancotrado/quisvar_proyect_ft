import { useParams } from 'react-router-dom';
import './companyInformation.css';
import { useCallback, useEffect, useState } from 'react';
import { Companies } from '../../../types/types';
import { axiosInstance } from '../../../services/axiosInstance';
import { getIconDefault } from '../../../utils/tools';
// import { AnimatePresence, motion } from 'framer-motion';

const CompanyInformation = () => {
  const { infoId } = useParams();
  const [data, setData] = useState<Companies>();
  const [, setProjectSelected] = useState<number | null>(null);
  // const toggleDetalleProyecto = (projectID: number) => {
  //   if (projectSelected === projectID) {
  //     setProjectSelected(null);
  //   } else {
  //     setProjectSelected(projectID);
  //   }
  // };
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
      <div className="company-experience"></div>
      <div className="company-data">
        <div className="company-main-info">
          <span className="company-main-img">
            <img
              className="company-img-size"
              src={data ? getIconDefault(data?.name) : '/svg/user_icon.svg'}
            />
          </span>
          <div className="company-info-text">
            <div className="company-icons-area">
              <img src="/svg/pencil-line.svg" className="company-info-icon" />
              <span className="company-icon-cv">
                <img src="/svg/download.svg" className="company-info-icon" />
                <h4>CV</h4>
              </span>
            </div>
            <h1 className="company-info-name">{data?.name}</h1>
            <h3>{data?.manager}</h3>
          </div>
        </div>
        <div className="company-aditional-info">
          <div className="company-info-rows">
            <h3>RUC:</h3>
            <h3>{data?.ruc}</h3>
          </div>
          <div className="company-info-rows">
            <h3>Domicilio Fiscal:</h3>
            <h3>{data?.address}</h3>
          </div>
          <div className="company-info-rows">
            <h3>Partida Registral:</h3>
            <h3>{data?.departure}</h3>
          </div>
        </div>
        <hr className="company-hr" />
        <div className="company-projects-list">
          <h3>Proyectos</h3>
        </div>
      </div>
    </>
  );
};

export default CompanyInformation;
