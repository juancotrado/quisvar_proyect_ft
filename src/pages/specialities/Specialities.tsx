import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Button from '../../components/shared/button/Button';
import './specialities.css';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { SpecialityType } from '../../types/types';
import CardSpeciality from '../../components/speciality/cardSpeciality/CardSpeciality';

const Specialities = () => {
  const { userSession } = useSelector((state: RootState) => state);
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';
  const [specialities, setSpecialities] = useState<SpecialityType[] | null>(
    null
  );

  useEffect(() => {
    getSpecialities();
  }, []);

  const getSpecialities = async () => {
    await axiosInstance
      .get('/specialities')
      .then(res => setSpecialities(res.data));
  };

  return (
    <div className="container speciality">
      <div className="speciality-head">
        <h1 className="speciality-title">
          <span className="speciality-title-span">ESPECIALIDADES</span>
        </h1>
        {role !== 'EMPLOYEE' && (
          <Button text="AGREGAR" icon="plus" className="speciality-add" />
        )}
      </div>
      <div className="speciality-card-container">
        {specialities &&
          specialities.map(_speciality => (
            <CardSpeciality
              key={_speciality.id}
              data={_speciality}
              onDelete={getSpecialities}
              onUpdate={getSpecialities}
            />
          ))}
      </div>
    </div>
  );
};

export default Specialities;
