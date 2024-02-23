import { useSelector } from 'react-redux';
import { useRole } from '../../../../hooks';
import './licensePage.css';
import { RootState } from '../../../../store';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../services/axiosInstance';
import { licenseList } from '../../../../types';
import {
  LicenseListHeader,
  LicenseListItem,
} from '../paymentProcessing/components';
import { isOpenCardLicense$ } from '../../../../services/sharingSubject';
import { CardLicense } from './views';
export const LicensePage = () => {
  const { role, id } = useSelector((state: RootState) => state.userSession);
  const { hasAccess } = useRole('MOD', 'tramites', 'salidas');
  const [listLicense, setListLicense] = useState<licenseList[]>([]);
  useEffect(() => {
    getHistory();
    if (hasAccess) verifyLicenses();
  }, []);
  const verifyLicenses = () => {
    axiosInstance
      .post('/license/expired')
      .then(() => console.log('Datos limpiados'));
  };
  const getHistory = () => {
    if (role && !hasAccess) {
      axiosInstance.get(`license/employee/${id}`).then(res => {
        setListLicense(res.data);
      });
    }
    if (hasAccess) {
      axiosInstance.get('license/status').then(res => {
        setListLicense(res.data);
      });
    }
  };
  const showCardReportData = (data: licenseList) => {
    isOpenCardLicense$.setSubject = {
      isOpen: true,
      data,
    };
  };
  const showCardReport = () => {
    isOpenCardLicense$.setSubject = {
      isOpen: true,
    };
  };
  const showCardReportFreeDay = () => {
    isOpenCardLicense$.setSubject = {
      isOpen: true,
      type: 'free',
    };
  };
  return (
    <div className="lp-content">
      {!hasAccess ? (
        <span className="lp-license" onClick={showCardReport}>
          <img className="lp-free-day-img" src="/svg/license-icon.svg" />
          Solicitar Hoja de ruta
        </span>
      ) : (
        <span className="lp-license" onClick={showCardReportFreeDay}>
          <img className="lp-free-day-img" src="/svg/license-icon.svg" />
          Día libre
        </span>
      )}
      <LicenseListHeader isEmployee={!hasAccess} />
      <div className="lp-grid-container">
        {listLicense.map((license, index) => (
          <LicenseListItem
            key={license.id}
            data={license}
            index={index}
            isEmployee={!hasAccess as boolean}
            editData={() => showCardReportData(license)}
            onSave={getHistory}
          />
        ))}
      </div>
      <CardLicense onSave={getHistory} />
    </div>
  );
};
