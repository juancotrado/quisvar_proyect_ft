import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ConsortiumType } from '../../../../types';
import { URL, axiosInstance } from '../../../../services/axiosInstance';
import './consortium.css';
import { isOpenCardAddCompany$ } from '../../../../services/sharingSubject';
import { Button, ButtonDelete } from '../../../../components';
import { CardAddCompany } from './views';

export const Consortium = () => {
  const { id } = useParams();
  const [data, setData] = useState<ConsortiumType>();
  const [, setProjectSelected] = useState<number | null>(null);

  const getConsortium = useCallback(() => {
    axiosInstance.get(`/consortium/${id}`).then(item => setData(item.data));
  }, [id]);
  useEffect(() => {
    getConsortium();
    return setProjectSelected(null);
  }, [getConsortium]);

  const handleOpenCard = (id: number) => {
    isOpenCardAddCompany$.setSubject = {
      isOpen: true,
      id,
    };
  };
  return (
    <>
      <div className="company-experience"></div>
      <div className="company-data">
        <div className="company-main-info">
          <span className="company-main-img">
            <img
              className="company-img-size"
              src={
                data?.img
                  ? `${URL}/images/img/consortium/${data.img}`
                  : '/svg/user_icon.svg'
              }
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
          <div className="grc-title-list">
            <h1 className="grc-title-name">Empresas asociadas</h1>
            <Button
              text="Agregar"
              icon="plus"
              className="grc-btn-add"
              onClick={() => id && handleOpenCard(+id)}
            />
          </div>
          <div className="consortium-table" key={data?.id}>
            <div className="consortium-header">
              <h1 className="consortium-member">#</h1>
              <h1 className="consortium-member">Empresa</h1>
              <h1 className="consortium-member">Borrar</h1>
            </div>
            {data &&
              data?.companies.map((company, index) => (
                <div key={index} className="consortium-company-members">
                  <h1 className="consortium-company-name">{index + 1}</h1>
                  <h1 className="consortium-company-name">
                    {company?.companies.name}
                  </h1>
                  <span className="ule-size-pc">
                    <ButtonDelete
                      icon="trash"
                      url={`/consortium/relation/${company?.companies.id}/${id}`}
                      className="role-delete-icon"
                      onSave={getConsortium}
                    />
                  </span>
                </div>
              ))}
          </div>
        </div>
        <CardAddCompany onSave={getConsortium} />
      </div>
    </>
  );
};
