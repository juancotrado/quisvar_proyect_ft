import './specialities.css';
import { Outlet } from 'react-router-dom';
import { useMotionValue, motion, PanInfo } from 'framer-motion';
import { useSector } from '../../hooks';
import { FocusEvent, useCallback, useEffect, useState } from 'react';
import { SectorType } from '../../types';
import { axiosInstance } from '../../services/axiosInstance';
import { LoaderForComponent, Select } from '../../components';
import { DropDownSidebarSpeciality } from './components';
import { YEAR_DATA } from './models';
import { CardRegisterProject } from './views';

export const Specialities = () => {
  const { getSpecialities, sectors, settingSectors } = useSector();
  const mWidth = useMotionValue(300);
  const [contentVisible, setContentVisible] = useState(true);
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

  const handleDrag = useCallback(
    (_event: MouseEvent, info: PanInfo) => {
      const newWidth = mWidth.get() + info.delta.x;
      if (newWidth < 100) {
        setContentVisible(false);
      } else {
        setContentVisible(true);
      }
      if (newWidth > 21 && newWidth < 600) {
        mWidth.set(mWidth.get() + info.delta.x);
      }
    },
    [mWidth]
  );
  const style = {
    width: mWidth,
  };
  return (
    <div className="speciality-main">
      {/* <SidebarSpeciality /> */}
      <motion.aside className={`sidebarSpeciality `} style={style}>
        {sectors ? (
          <>
            {contentVisible && (
              <Select
                label="Año de Especialidad:"
                required={true}
                name="typeSpeciality"
                data={YEAR_DATA}
                itemKey="year"
                onChange={handleFilterForYear}
                textField="year"
              />
            )}
            <DropDownSidebarSpeciality
              data={{
                id: 0,
                name: '',
                sectors,
              }}
              onSave={getSpecialities}
            />
            <motion.div
              drag="x"
              onDrag={handleDrag}
              dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
              dragElastic={0}
              dragMomentum={false}
              className="sidebarSpeciality-resize-content"
            />
          </>
        ) : (
          <LoaderForComponent />
        )}
        <CardRegisterProject onSave={getSpecialities} />
      </motion.aside>
      <Outlet />
    </div>
  );
};
