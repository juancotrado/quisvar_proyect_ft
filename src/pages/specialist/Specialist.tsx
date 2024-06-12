import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Input, Button, Aside, DotsRight } from '../../components';
import { isOpenCardSpecialist$ } from '../../services/sharingSubject';
import './specialist.css';
import { Option, SpecialistList } from '../../types';
import { axiosInstance } from '../../services/axiosInstance';
import { getIconDefault } from '../../utils';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Subject, debounceTime, switchMap } from 'rxjs';
import { CardSpecialist } from './views';
import { ContextMenuTrigger } from 'rctx-contextmenu';

export const Specialist = () => {
  const [specialist, setSpecialist] = useState<SpecialistList[]>();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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
        setSpecialist(response.data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);
    if (!value) getSpecialists();
    apiSubjectRef.current.next(value);
  };
  const handleDelete = (id: number) => {
    axiosInstance.delete(`specialists/delete/${id}`).then(() => {
      getSpecialists();
      navigate(`/especialistas`);
    });
  };
  return (
    <div className="specialist">
      <Aside>
        <div className="specialist-add-area">
          <h3 className="specialist-title">Especialistas: </h3>
          <Button
            icon="plus-dark"
            onClick={handleAddSpecilist}
            className="specialist-add-btn"
          />
        </div>

        <div className="search-box">
          <Input
            placeholder="Buscar por DNI"
            className="specialist-search-input"
            onChange={handleSearch}
            value={searchTerm}
            styleInput={4}
          />
        </div>
        {specialist &&
          specialist.map(item => {
            const dataDots: Option[] = [
              {
                name: 'Eliminar',
                type: 'button',
                icon: 'trash-red',
                function: () => handleDelete(item.id),
              },
            ];
            return (
              <ContextMenuTrigger id={`sp-sidebar-${item.id}`} key={item.id}>
                <NavLink
                  className={({ isActive }) =>
                    `specialist-items  ${isActive && 'contract-selected'} `
                  }
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

                  <DotsRight
                    data={dataDots}
                    idContext={`sp-sidebar-${item.id}`}
                  />
                </NavLink>
              </ContextMenuTrigger>
            );
          })}
      </Aside>

      <section className="specialist-info">
        <Outlet />
      </section>
      <CardSpecialist onSave={getSpecialists} />
    </div>
  );
};
