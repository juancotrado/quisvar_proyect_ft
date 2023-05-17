import { useEffect, useState } from 'react';
import AreaCard from '../../components/workArea/areaCard/AreaCard';
import './workArea.css';
import { axiosInstance } from '../../services/axiosInstance';
import { CardRegisterArea } from '../../components';
import Button from '../../components/shared/button/Button';

interface Areas {
  id: number;
  name: string;
  description: string;
  _count?: { project: number };
}
const WorkArea = () => {
  const [areas, setAreas] = useState<Areas[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [areaData, setAreaData] = useState<Areas | null>(null);
  const [role, setRole] = useState('EMPLOYEE');

  useEffect(() => {
    getAreas();
  }, []);

  useEffect(() => {
    const userInfo = localStorage.getItem('personalData');
    if (typeof userInfo !== 'string') return;
    const _user = JSON.parse(userInfo);
    setRole(_user.role);
  }, []);

  const getAreas = async () => {
    await axiosInstance.get('/workareas').then(res => {
      setAreas(res.data);
    });
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
              onClick={() => {
                setAreaData(null);
                setIsOpen(true);
              }}
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
              onClick={() => {
                setAreaData({ id, name, description });
                setIsOpen(true);
              }}
            />
          ))}
      </div>
      <CardRegisterArea
        isOpen={isOpen}
        dataWorkArea={areaData}
        onChangeStatus={() => setIsOpen(false)}
        onSave={() => {
          getAreas();
          setAreaData(null);
        }}
      />
    </div>
  );
};

export default WorkArea;
