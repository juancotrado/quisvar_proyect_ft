import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Input } from '../../components';
import Button from '../../components/shared/button/Button';
import CardSpecialist from '../../components/shared/card/cardSpecialist/CardSpecialist';
import { isOpenCardSpecialist$ } from '../../services/sharingSubject';
import './specialist.css';
import { SpecialistList } from '../../types/types';
import { axiosInstance } from '../../services/axiosInstance';
import { getIconDefault } from '../../utils/tools';
import { NavLink, Outlet } from 'react-router-dom';
import { Subject, debounceTime, switchMap } from 'rxjs';

const Specialist = () => {
  const [specialist, setSpecialist] = useState<SpecialistList[]>();
  const [searchTerm, setSearchTerm] = useState('');

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
  // const apiSubject = new Subject();
  const apiSubjectRef = useRef(new Subject());
  useEffect(() => {
    const subscription = apiSubjectRef.current
      .pipe(
        debounceTime(500),
        switchMap(dni => {
          return axiosInstance.get(`specialists/dni/${dni}`);
        })
      )
      .subscribe(response => {
        console.log(response.data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);
    if (!value) return;
    apiSubjectRef.current.next(value);
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
          onChange={handleSearch}
          value={searchTerm}
        />
        {specialist &&
          specialist.map(item => (
            <NavLink
              className="specialist-items"
              key={item.id}
              to={`informacion/${item.id}`}
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
            </NavLink>
          ))}
      </div>
      <section className="specialist-info">
        <Outlet />
      </section>
      <CardSpecialist onSave={getSpecialists} />
    </div>
  );
};

export default Specialist;
