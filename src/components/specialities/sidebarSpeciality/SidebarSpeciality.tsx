import { FocusEvent, useCallback, useState } from 'react';
import './sidebarSpeciality.css';
import { SectorType } from '../../../types/types';
import { CardRegisterProject, LoaderForComponent, Select } from '../..';
import { yearData } from '../const';
import { axiosInstance } from '../../../services/axiosInstance';
import { useMotionValue, motion, PanInfo } from 'framer-motion';
import DropDownSidebarSpeciality from './dropDownSidebarSpeciality/DropDownSidebarSpeciality';
import useSector from '../../../hooks/useSector';

const SidebarSpeciality = () => {
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
    <motion.aside className={`sidebarSpeciality `} style={style}>
      {sectors ? (
        <>
          {contentVisible && (
            <Select
              label="Año de Especialidad:"
              required={true}
              name="typeSpeciality"
              data={yearData}
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
  );
};

export default SidebarSpeciality;
