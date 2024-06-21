import './specialities.css';
import { Outlet } from 'react-router-dom';
import { useHideElement, useSector } from '../../hooks';
import { FocusEvent, useEffect } from 'react';
import { SectorType } from '../../types';
import { axiosInstance } from '../../services/axiosInstance';
import { LoaderForComponent, ResizableIcon, Select } from '../../components';
import { DropDownSidebarSpeciality } from './components';
import { YEAR_DATA } from './models';
import { CardRegisterProject } from './views';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export const Specialities = () => {
  const { getSpecialities, sectors, settingSectors } = useSector();
  const { handleHideElements, hideElements } = useHideElement(1000);

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
    return () => {
      cleanupLocalStorage();
    };
  }, []);

  return (
    <div className="speciality-main">
      <PanelGroup direction="horizontal">
        <Panel
          defaultSize={20}
          order={1}
          className={`sidebarSpeciality-resizable ${
            hideElements && 'sidebar-hidden'
          }`}
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
        </Panel>
        {!hideElements && <PanelResizeHandle />}

        <ResizableIcon
          handleHideElements={handleHideElements}
          hideElements={hideElements}
        />
        <Panel defaultSize={80} order={2}>
          <Outlet />
        </Panel>
      </PanelGroup>
    </div>
  );
};
