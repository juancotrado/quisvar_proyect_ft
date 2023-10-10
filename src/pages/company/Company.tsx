import { CardCompany } from '../../components';
import Button from '../../components/shared/button/Button';
import { isOpenCardCompany$ } from '../../services/sharingSubject';
import './company.css';

const Company = () => {
  const viewCompany = () => {
    isOpenCardCompany$.setSubject = true;
  };
  return (
    <div className="attendance container">
      <div className="attendance-head">
        <div>
          <h1 className="main-title">
            LISTA DE <span className="main-title-span">EMPRESAS </span>
          </h1>
        </div>
      </div>
      <Button text="Agregar" onClick={viewCompany} />
      <CardCompany />
    </div>
  );
};

export default Company;
