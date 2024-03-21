import { useSelector } from 'react-redux';
import { useRole } from '../../../../hooks';
import './licensePage.css';
import { RootState } from '../../../../store';
import { useContext, useEffect, useState } from 'react';
import { axiosInstance } from '../../../../services/axiosInstance';
import { licenseList } from '../../../../types';
import {
  LicenseListHeader,
  LicenseListItem,
} from '../paymentProcessing/components';
import { isOpenCardLicense$ } from '../../../../services/sharingSubject';
import { CardLicense } from './views';
import { SocketContext } from '../../../../context';
import { Button } from '../../../../components';

type LicenseRes = {
  licenses: licenseList[];
  count: number;
};

export const LicensePage = () => {
  const { role, id } = useSelector((state: RootState) => state.userSession);
  const { hasAccess } = useRole('MOD', 'tramites', 'salidas');
  const [listLicense, setListLicense] = useState<licenseList[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, _] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [skip, setSkip] = useState(0);
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.on('server:license-update', () => {
      getHistory();
      if (hasAccess) verifyLicenses();
    });

    return () => {
      socket.off('server:license-update');
    };
  }, []);

  useEffect(() => {
    // console.log(page);
    getHistory(page, pageSize);
    if (hasAccess) verifyLicenses();
  }, [page, pageSize]);
  const verifyLicenses = () => {
    axiosInstance
      .post('/license/expired')
      .then(() => console.log('Datos limpiados'));
  };
  const getHistory = (_page?: number, _pageSize?: number) => {
    if (role && !hasAccess) {
      axiosInstance
        .get<LicenseRes>(
          `license/employee/${id}?page=${_page}&pageSize=${_pageSize}`
        )
        .then(res => {
          setListLicense(res.data.licenses);
          console.log(res.data.count);
          setTotal(res.data.count);
        });
    }
    if (hasAccess) {
      axiosInstance
        .get<LicenseRes>(`license/status?page=${_page}&pageSize=${_pageSize}`)
        .then(res => {
          setListLicense(res.data.licenses);
          setTotal(res.data.count);
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

  const handleNextPage = () => {
    if (listLicense.length === 20 && total > 20) {
      setSkip(skip === 0 ? skip + 21 : skip + 20);
      setPage(page + 1);
    }
  };
  const handlePreviusPage = () => {
    if (page - 1 > 0) {
      setSkip(skip === 21 ? skip - 20 : skip - 20);
      setPage(page - 1);
    }
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
      <LicenseListHeader isEmployee={!hasAccess} refresh={getHistory} />
      <div className="lp-grid-container">
        {listLicense.map((license, index) => (
          <LicenseListItem
            key={license.id}
            data={license}
            index={index + (skip === 0 ? skip : skip - 1)}
            isEmployee={!hasAccess as boolean}
            editData={() => showCardReportData(license)}
            onSave={getHistory}
          />
        ))}
      </div>
      <CardLicense onSave={getHistory} />
      <div className="mail-footer-section">
        <Button
          className="mail-previus-btn-pagination"
          icon="down"
          onClick={handlePreviusPage}
        />
        <span className="mail-pagination-title">
          {skip === 0 && total !== 0 ? 1 : skip}
          {`-${
            skip + total <= 20
              ? total
              : listLicense.length === 20
              ? 20 + (skip === 0 ? skip : skip - 1)
              : total
          }`}{' '}
          de {total}
        </span>
        <Button
          className="mail-next-btn-pagination"
          icon="down"
          onClick={handleNextPage}
        />
      </div>
    </div>
  );
};
