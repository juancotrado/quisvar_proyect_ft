import { useEffect, useState } from 'react';
import AreaCard from '../../components/workArea/areaCard/AreaCard';
import './workArea.css';
import { axiosInstance } from '../../services/axiosInstance';
import { CardRegisterArea } from '../../components';
import Button from '../../components/shared/button/Button';
import useRole from '../../hooks/useRole';
import { isOpenModal$ } from '../../services/sharingSubject';

interface Areas {
  id: number;
  name: string;
  description: string;
  _count?: { project: number };
}
const WorkArea = () => {
  const [areas, setAreas] = useState<Areas[] | null>(null);
  const [areaData, setAreaData] = useState<Areas | null>(null);
  const { role } = useRole();
  useEffect(() => {
    getAreas();
  }, []);

  const getAreas = async () => {
    await axiosInstance.get('/workareas').then(res => {
      setAreas(res.data);
    });
  };
  const addNewArea = () => {
    isOpenModal$.setSubject = true;
    setAreaData(null);
  };

  const editArea = ({ id, name, description }: Areas) => {
    isOpenModal$.setSubject = true;
    setAreaData({ id, name, description });
  };
  return (
    <div className="container area">
      <div className="area-head">
        <h1 className="area-title">
          ÁREAS DE <span className="area-title-span">TRABAJO</span>
        </h1>
        {role !== 'EMPLOYEE' && (
          <div>
            <Button
              text="Agregar"
              icon="plus"
              className="btn-add"
              onClick={addNewArea}
            />
          </div>
        )}
      </div>
      <div className="area-card-container">
        {areas &&
          areas.map(({ id, name, description, _count }) => (
            <AreaCard
              key={id}
              name={name}
              id={id}
              total={_count?.project}
              onClick={() => editArea({ id, name, description })}
              onDelete={() => getAreas()}
            />
          ))}
      </div>
      <CardRegisterArea
        dataWorkArea={areaData}
        onSave={() => {
          getAreas();
          setAreaData(null);
        }}
      />
    </div>
  );
};

export default WorkArea;
