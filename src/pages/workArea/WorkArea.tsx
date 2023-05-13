import { useEffect, useState } from 'react';
import AreaCard from '../../components/workArea/areaCard/AreaCard';
import './workArea.css';
import { axiosInstance } from '../../services/axiosInstance';

interface Areas {
  id: number;
  name: string;
  description: string;
}
const WorkArea = () => {
  const [areas, setAreas] = useState<Areas[] | null>(null);

  useEffect(() => {
    axiosInstance
      .get('/workareas')
      .then(res => {
        setAreas(res.data);
      })
      .catch(err => {
        console.log('error', err);
      });
  }, []);

  return (
    <div className="container area">
      <h1 className="area-title">
        ÁREAS DE <span className="area-title-span">TRABAJO</span>
      </h1>
      <div className="area-card-container">
        {areas &&
          areas.map(({ id, name }) => (
            <AreaCard key={id} name={name} id={id} />
          ))}
      </div>
    </div>
  );
};

export default WorkArea;
