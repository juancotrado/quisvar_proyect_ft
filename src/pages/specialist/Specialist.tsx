import { useEffect, useState } from 'react';
import { Input } from '../../components';
import Button from '../../components/shared/button/Button';
import CardSpecialist from '../../components/shared/card/cardSpecialist/CardSpecialist';
import { isOpenCardSpecialist$ } from '../../services/sharingSubject';
import './specialist.css';
import { Specialists } from '../../types/types';
import { axiosInstance } from '../../services/axiosInstance';
import { getIconDefault } from '../../utils/tools';

const Specialist = () => {
  const [specialist, setSpecialist] = useState<Specialists[]>();
  const [data, setData] = useState<Specialists>();
  useEffect(() => {
    getSpecialists();
  }, []);
  const getSpecialists = () => {
    axiosInstance.get('/specialists').then(item => setSpecialist(item.data));
  };
  const handleAddSpecilist = () => {
    isOpenCardSpecialist$.setSubject = {
      isOpen: true,
    };
  };
  const handleViewMore = (value: Specialists) => {
    setData(value);
  };
  return (
    <div className="specialist container">
      <div className="specialist-list">
        <div className="specialist-add-area">
          <h3 className="specialist-title">Especialistas: </h3>
          <Button
            icon="plus-dark"
            onClick={handleAddSpecilist}
            className="specialist-add-btn"
          />
        </div>
        <Input
          placeholder="Buscar por DNI"
          className="specialist-search-input"
        />
        {specialist &&
          specialist.map(item => (
            <div
              className="specialist-items"
              key={item.id}
              onClick={() => handleViewMore(item)}
            >
              <img
                src={getIconDefault(item.lastName)}
                alt=""
                className="specialist-item-user-img"
              />
              <div className="specialist-items-content">
                <h3 className="specialist-item-name">
                  {item.firstName + ' ' + item.lastName}
                </h3>
                <h3 className="specialist-item-dni">DNI: {item.dni}</h3>
              </div>
            </div>
          ))}
      </div>
      <section className="specialist-info">
        <div className="specialist-experience"></div>
        <div className="specialist-data">
          <div className="specialist-main-info">
            <span className="specialist-main-img">
              <img
                className="specialist-img-size"
                src={
                  data ? getIconDefault(data?.lastName) : '/svg/user_icon.svg'
                }
              />
            </span>
            <div className="specialist-info-text">
              <div className="specialist-icons-area">
                <img
                  src="/svg/pencil-line.svg"
                  className="specialist-info-icon"
                />
                <span className="specialist-icon-cv">
                  <img
                    src="/svg/download.svg"
                    className="specialist-info-icon"
                  />
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
              <h3>315413</h3>
            </div>
            <div className="specialist-info-rows">
              <h3>Correo:</h3>
              <h3>milito@gmail.com</h3>
            </div>
          </div>
          <hr className="specialist-hr" />
          <div className="specialist-projects-list"></div>
        </div>
      </section>
      <CardSpecialist onSave={getSpecialists} />
    </div>
  );
};

export default Specialist;
