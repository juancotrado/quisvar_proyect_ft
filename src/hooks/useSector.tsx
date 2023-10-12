import { useCallback, useEffect, useState } from 'react';
import { SectorType } from '../types/types';
// import { axiosInstance } from '../services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const useSector = () => {
  const [sectors, setSectors] = useState<SectorType[] | null>(null);
  const { id, role } = useSelector((state: RootState) => state.userSession);

  const getSpecialities = useCallback(async () => {
    if (!id) return;
    // const response = await axiosInstance.get('/sector');
    // const sectors: SectorType[] = response.data;
    // const sectorFilter = false
    //   ? filterForUserCoordinator(sectors, id)
    //   : sectors;
    setSectors(null);
  }, [id, role]);

  useEffect(() => {
    getSpecialities();
  }, [getSpecialities]);

  // const filterForUserCoordinator = (sectors: SectorType[], userId: number) => {
  //   return sectors
  //     .map(sector => {
  //       const specialitiesFilter = sector.specialities
  //         .map(spaciality => {
  //           const typeSpecialitiesFilter = spaciality.typeSpecialities
  //             ?.map(typeSpeciality => {
  //               const typeProjectFilter = typeSpeciality.projects.filter(
  //                 project => project.userId === userId
  //               );
  //               return { ...typeSpeciality, projects: typeProjectFilter };
  //             })
  //             .filter(typeSpeciality => typeSpeciality.projects.length);
  //           return { ...spaciality, typeSpecialities: typeSpecialitiesFilter };
  //         })
  //         .filter(spaciality => spaciality.typeSpecialities?.length);
  //       return { ...sector, specialities: specialitiesFilter };
  //     })
  //     .filter(sector => sector.specialities.length);
  // };
  const settingSectors = (sectors: SectorType[]) => {
    setSectors(sectors);
  };
  return { getSpecialities, sectors, settingSectors };
};

export default useSector;
