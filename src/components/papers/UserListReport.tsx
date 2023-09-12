import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import PaperCardList from '../shared/card/paperCard/PaperCardList';
import './userListReport.css';
import { ListReport } from '../../types/types';

interface UserListReportProps {
  className?: string;
}

const UserListReport = ({ className }: UserListReportProps) => {
  const [listReport, setListReport] = useState<ListReport[] | null>(null);
  const id = 1;
  useEffect(() => {
    listUser();
  }, []);

  const listUser = () => {
    axiosInstance
      .get(`/resource/${id}`)
      .then(({ data }) => setListReport(data));
  };

  return (
    <div className={`${className}`}>
      <ul className="paper-card-list-container user-list-header">
        <li className="paper-list-item-header">
          <span>#item</span>
          <img
            className="paper-list-item-icon"
            src="/svg/column-sorting.svg"
            alt="icon-item"
          />
        </li>
        <li className="paper-list-item-header p-list-col-2">
          <span>Nombres</span>
          <img
            className="paper-list-item-icon"
            src="/svg/column-sorting.svg"
            alt="icon-item"
          />
        </li>
        <li className="paper-list p-list-col-2">Reporte</li>
        <li className="paper-list ">Estado</li>
        <li className="paper-list p-list-col-2 ">Acción</li>
        <li className="paper-list p-list-col-3 ">Comentarios</li>
      </ul>
      {listReport &&
        listReport.map(report => (
          <PaperCardList key={report.id} data={report} />
        ))}
    </div>
  );
};

export default UserListReport;
