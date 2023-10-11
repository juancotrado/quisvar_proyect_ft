import { useEffect, useState } from 'react';
import { Input } from '../../components';
import Button from '../../components/shared/button/Button';
import CardSpecialist from '../../components/shared/card/cardSpecialist/CardSpecialist';
import { isOpenCardSpecialist$ } from '../../services/sharingSubject';
import './specialist.css';
import { Specialists } from '../../types/types';
import { axiosInstance } from '../../services/axiosInstance';

const Specialist = () => {
  const [data, setData] = useState<Specialists[]>();

  useEffect(() => {
    getSpecialists();
  }, []);
  const getSpecialists = () => {
    axiosInstance.get('/specialists').then(item => setData(item.data));
  };
  const handleAddSpecilist = () => {
    isOpenCardSpecialist$.setSubject = {
      isOpen: true,
    };
  };
  return (
    <div className="specialist container">
      <div className="specialist-list">
        <Button text="Agregar" onClick={handleAddSpecilist} />
        <h3>Especialistas:</h3>
        <Input placeholder="Buscar por DNI" />
        {data &&
          data.map(data => (
            <div className="specialist-items" key={data.id}>
              <h3>{data.firstName + ' ' + data.lastName}</h3>
              <h3>{data.dni}</h3>
            </div>
          ))}
      </div>
      <section className="specialist-info">
        <div className="specialist-experience"></div>
        <div className="specialist-data">
          <div className="specialist-main-info">
            <span className="specialist-main-img">
              <img src="" alt="" />
            </span>
            <div className="specialist-info-text">
              <h1>DIEGO ROMANI</h1>
              <h3>Ingeniero de Sistemas</h3>
            </div>
          </div>
          <div className="specialist-aditional-info">
            <div>
              <h3>DNI:</h3>
              <h3>71449908</h3>
            </div>
            <div>
              <h3>Colegiatura:</h3>
              <h3>315413</h3>
            </div>
            <div>
              <h3>Correo:</h3>
              <h3>milito@gmail.com</h3>
            </div>
          </div>
          <div className="specialist-projects-list"></div>
        </div>
      </section>
      <CardSpecialist onSave={getSpecialists} />
    </div>
  );
};

export default Specialist;
