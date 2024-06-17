import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ConsortiumType } from '../../../../types';
import { URL, axiosInstance } from '../../../../services/axiosInstance';
import './consortium.css';
import {
  isOpenCardAddCompany$,
  isOpenCardConsortium$,
} from '../../../../services/sharingSubject';
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
  // const deleteCompany = async (company: number, id: number) => {
  //   axiosInstance.delete(`/consortium/relation/${company}/${id}`);
  //   getConsortium();
  // };
  const handleAddConsortium = async (id?: number) => {
    isOpenCardConsortium$.setSubject = {
      isOpen: true,
      id,
    };
    // getConsortium();
  };
  return (
    <>
      <div className="company-experience"></div>
      <div className="company-data">
        <div className="company-main-info">
          <div className=" company-main-img-center">
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
          </div>
          <div className="company-info-text">
            <div className="company-icons-area">
              <img
                src="/svg/pencil-line.svg"
                className="company-info-icon"
                onClick={() => handleAddConsortium(data?.id)}
              />

              <span className="company-icon-cv">
                <img src="/svg/download.svg" className="company-info-icon" />
                <h4>CV</h4>
              </span>
            </div>
            <h1 className="company-info-name">{data?.name}</h1>
            <h3>{data?.manager}</h3>
          </div>
        </div>
        {/* <div className="company-aditional-info">
          <div className="company-info-rows">
            <h3>RUC:</h3>
            <h3>{data?.manager}</h3>
          </div>
          <div className="company-info-rows">
            <h3>Domicilio Fiscal:</h3>
            <h3>{data?.address}</h3>
          </div>
          <div className="company-info-rows">
            <h3>Partida Registral:</h3>
            <h3>{data?.departure}</h3>
          </div>
        </div> */}
        <hr className="company-hr" />
        <div className="company-projects-list">
          <div className="grc-title-list">
            <h1 className="grc-title-name">Empresas asociadas</h1>
            <div className="grc-title-list">
              <div className="btn-build">
                <Button
                  text="Editar"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => id && handleOpenCard(+id)}
                />
              </div>
            </div>
            {/* <Button
              text="Agregar"
              icon="plus"
              className="grc-btn-add"
              onClick={() => id && handleOpenCard(+id)}
            /> */}
          </div>
          <div className="consortium-table">
            <div className="consortium-header">
              <h1 className="consortium-member">#</h1>
              <h1 className="consortium-member">Empresa</h1>
              <h1 className="consortium-member">Porcentaje</h1>
              <h1 className="consortium-member">Acciones</h1>
            </div>
            {data?.companies?.map((item, index) => (
              <div key={index} className="consortium-company-members">
                <h1 className="consortium-company-name">{index + 1}</h1>
                <h1 className="consortium-company-name">
                  {item?.companies.name}
                </h1>
                <h1 className="consortium-company-name">{item?.percentaje}%</h1>
                <span className="ule-size-pc">
                  <p>Editar</p>
                  <ButtonDelete
                    icon="trash"
                    url={`/consortium/relation/${item?.companies.id}/${id}`}
                    className="role-delete-icon"
                    onSave={getConsortium}
                  />
                </span>
              </div>
            ))}
          </div>
          <div className="btn-build">
            <Button
              text="Empresa"
              icon="plus"
              whileTap={{ scale: 0.9 }}
              color="lightPrimary"
              textColor="secondary"
              onClick={() => id && handleOpenCard(+id)}
            />
          </div>
        </div>
        <CardAddCompany onSave={getConsortium} />
      </div>
    </>
  );
};
