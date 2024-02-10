import './specialities.css';
import { Outlet } from 'react-router-dom';
import { useSector } from '../../hooks';
import { FocusEvent, useEffect } from 'react';
import { SectorType } from '../../types';
import { axiosInstance } from '../../services/axiosInstance';
import { LoaderForComponent, Select } from '../../components';
import { DropDownSidebarSpeciality } from './components';
import { YEAR_DATA } from './models';
import { CardRegisterProject } from './views';
import { Resizable } from 're-resizable';

export const Specialities = () => {
  const { getSpecialities, sectors, settingSectors } = useSector();
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
    return () => {
      localStorage.removeItem('arrCheckedLevel');
    };
  }, []);

  return (
    <div className="speciality-main">
      <Resizable
        defaultSize={{
          width: 300,
          height: '100%',
        }}
        className={`sidebarSpeciality `}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: true,
        }}
      >
        {sectors ? (
          <>
            <Select
              label="Año de Especialidad:"
              required={true}
              name="typeSpeciality"
              data={YEAR_DATA}
              itemKey="year"
              onChange={handleFilterForYear}
              textField="year"
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
      </Resizable>
      <Outlet />
    </div>
  );
};
