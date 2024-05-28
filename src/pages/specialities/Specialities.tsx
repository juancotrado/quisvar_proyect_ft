import './specialities.css';
import { Outlet } from 'react-router-dom';
import { useSector } from '../../hooks';
import { FocusEvent, useEffect, useState } from 'react';
import { SectorType } from '../../types';
import { axiosInstance } from '../../services/axiosInstance';
import { LoaderForComponent, Select } from '../../components';
import { DropDownSidebarSpeciality } from './components';
import { YEAR_DATA } from './models';
import { CardRegisterProject } from './views';
import { Resizable } from 're-resizable';

export const Specialities = () => {
  const { getSpecialities, sectors, settingSectors } = useSector();
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const handleFilterForYear = async (e: FocusEvent<HTMLSelectElement>) => {
    const { data } = await axiosInstance.get<SectorType[]>('/sector');
    const { value } = e.target;
    const filterForYear = data
      .map(sector => {
        const specialitiesFilter = sector.specialities.filter(spaciality => {
          const year = new Date(spaciality.createdAt).getFullYear();
          return year === +value;
        });
        return {
          ...sector,
          specialities: specialitiesFilter,
        };
      })
      .filter(sector => sector.specialities.length);
    settingSectors(filterForYear);
  };

  useEffect(() => {
    const cleanupLocalStorage = () => {
      localStorage.removeItem('arrCheckedLevel');
    };
    const handleResize = () => {
      setIsSidebarHidden(window.innerWidth < 1000);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cleanupLocalStorage();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebarVisibility = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };
  return (
    <div className="speciality-main">
      <Resizable
        defaultSize={{
          width: 300,
          height: '100%',
        }}
        className={`sidebarSpeciality-resizable ${
          isSidebarHidden ? 'sidebar-hidden' : ''
        }`}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
        }}
      >
        <div className="sidebarSpeciality">
          {sectors ? (
            <>
              <Select
                label="Año de Especialidad:"
                required={true}
                name="typeSpeciality"
                data={YEAR_DATA}
                onChange={handleFilterForYear}
                extractValue={({ year }) => year}
                renderTextField={({ year }) => year}
              />
              <DropDownSidebarSpeciality
                data={{
                  id: 0,
                  name: '',
                  sectors,
                }}
                onSave={getSpecialities}
              />
            </>
          ) : (
            <LoaderForComponent />
          )}
          <CardRegisterProject onSave={getSpecialities} />
        </div>
      </Resizable>
      <div className="button-sidebar">
        <button className="button-icon" onClick={toggleSidebarVisibility}>
          <svg
            className={`icon ${isSidebarHidden ? 'icon-invert' : ''}`}
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 330 330"
            stroke="#ffffff"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {' '}
              <path
                id="XMLID_222_"
                d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"
              ></path>{' '}
            </g>
          </svg>
        </button>
      </div>

      <Outlet />
    </div>
  );
};
