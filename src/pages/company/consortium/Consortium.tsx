import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ConsortiumType } from '../../../types/types';
import { axiosInstance } from '../../../services/axiosInstance';
import { getIconDefault } from '../../../utils/tools';

const Consortium = () => {
  const { id } = useParams();
  const [data, setData] = useState<ConsortiumType>();
  const [, setProjectSelected] = useState<number | null>(null);
  // const toggleDetalleProyecto = (projectID: number) => {
  //   if (projectSelected === projectID) {
  //     setProjectSelected(null);
  //   } else {
  //     setProjectSelected(projectID);
  //   }
  // };
  const getConsortium = useCallback(() => {
    axiosInstance.get(`/consortium/${id}`).then(item => setData(item.data));
  }, [id]);
  useEffect(() => {
    getConsortium();
    return setProjectSelected(null);
  }, [getConsortium]);
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
              {/* <span className="company-icon-cv">
              <img src="/svg/download.svg" className="company-info-icon" />
              <h4>CV</h4>
            </span> */}
            </div>
            <h1 className="company-info-name">{data?.name}</h1>
            <h3>{data?.manager}</h3>
          </div>
        </div>
        <div className="company-aditional-info">
          <div className="company-info-rows">
            {/* <h3>RUC:</h3> */}
            {/* <h3>{data?.manager}</h3> */}
          </div>
          {/* <div className="company-info-rows">
          <h3>Domicilio Fiscal:</h3>
          <h3>{data?.address}</h3>
        </div>
        <div className="company-info-rows">
          <h3>Partida Registral:</h3>
          <h3>{data?.departure}</h3>
        </div> */}
        </div>
        <hr className="company-hr" />
        <div className="company-projects-list">
          <h3>Proyectos</h3>
        </div>
      </div>
    </>
  );
};

export default Consortium;
