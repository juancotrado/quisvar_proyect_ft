import { useParams } from 'react-router-dom';
import useArchiver from '../../../hooks/useArchiver';
import { axiosInstance } from '../../../services/axiosInstance';
import { Level } from '../../../types/types';
import { excelSimpleReport } from '../../../utils/excelGenerate/excelReportForLevel';
import './moreInfo.css';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import { toggle$ } from '../../../services/sharingSubject';
interface MoreInfoProps {
  data: Level;
}
const MoreInfo = ({ data }: MoreInfoProps) => {
  const { projectId } = useParams();
  const [showArchiverOption, setShowArchiverOption] = useState(false);
  const handleToggleRef = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleToggleRef.current = toggle$.getSubject.subscribe((value: boolean) => {
      setShowArchiverOption(value);
    });
    return () => {
      handleToggleRef.current.unsubscribe();
    };
  }, []);
  const handleReports = () => {
    axiosInstance.get(`/projects/${projectId}`).then(res => {
      console.log(res.data);
      const {
        department,
        district,
        province,
        // startDate,
        // untilDate,
        description,
        CUI,
      } = res.data;
      const { firstName, lastName } = res.data.moderator.profile;
      // const initialDate = formatDate(new Date(startDate), {
      //   day: 'numeric',
      //   weekday: 'long',
      //   month: 'long',
      //   year: 'numeric',
      // });
      // const finishDate = formatDate(new Date(untilDate), {
      //   day: 'numeric',
      //   weekday: 'long',
      //   month: 'long',
      //   year: 'numeric',
      // });
      const infoData = {
        department,
        district,
        province,
        initialDate: 'Fecha de inicio',
        finishDate: 'fecha Final',
        description,
        CUI,
        fullName: firstName + ' ' + lastName,
      };
      excelSimpleReport(data, infoData, 'areas');
    });
  };
  const type = data.projectName ? 'stages' : 'levels';
  const { handleArchiver } = useArchiver(
    data.id,
    type,
    data.projectName ?? data.name
  );
  const handleArchiverOptions = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowArchiverOption(!showArchiverOption);
  };
  return (
    <>
      <div className="moreInfo-currency-contain">
        <div className="moreInfo-currency">
          <span className="moreInfo-currency-money">
            S/.{data.balance.toFixed(2)}
          </span>
          {data.projectName && (
            <span className="moreInfo-currency-info">Saldo</span>
          )}
        </div>
        <div className="moreInfo-currency">
          <span className="moreInfo-currency-money money--red">
            -/S.{data.spending.toFixed(2)}
          </span>
          {data.projectName && (
            <span className="moreInfo-currency-info">Gasto</span>
          )}
        </div>
        <div className="moreInfo-currency">
          <span className="moreInfo-currency-money">
            S/.{data.price.toFixed(2)}
          </span>
          {data.projectName && (
            <span className="moreInfo-currency-info">Total</span>
          )}
        </div>
        <div className="moreInfo-currency">
          <span className="moreInfo-currency-money">
            {data?.percentage?.toFixed(2)}%
          </span>
          {data.projectName && (
            <span className="moreInfo-currency-info">Porcentaje</span>
          )}
        </div>
        <div className="moreInfo-currency moreInfo-currency-width">
          <span className="moreInfo-currency-money">{data.total}</span>
          {data.projectName && (
            <span className="moreInfo-currency-info">Tareas</span>
          )}
        </div>
        <div className="moreInfo-currency moreInfo-currency-width">
          <span className="moreInfo-currency-money">{data.days}</span>
          {data.projectName && (
            <span className="moreInfo-currency-info">
              Dia{data.days !== 1 && 's'}
            </span>
          )}
        </div>
      </div>
      <div className="moreInfo-details-contain">
        {showArchiverOption && (
          <div className="moreInfo-details-contain moreInfo-details-absolute">
            <div
              className="moreInfo-detail"
              onClick={handleArchiver}
              title={'Comprimir'}
            >
              <figure className="moreInfo-detail-icon">
                <img src="/svg/zip-normal.svg" alt="W3Schools" />
              </figure>
              <span className="moreInfo-detail-info">Comprimir</span>
            </div>
            <div className="moreInfo-detail" title={'Comprimir PDFs'}>
              <figure className="moreInfo-detail-icon">
                <img src="/svg/zip-pdf.svg" alt="W3Schools" />
              </figure>
              <span className="moreInfo-detail-info">
                Comprimir <br /> PDF
              </span>
            </div>
            <div
              className="moreInfo-detail"
              title={'Comprimir Editables'}
              onClick={handleReports}
            >
              <figure className="moreInfo-detail-icon">
                <img src="/svg/zip-edit.svg" alt="W3Schools" />
              </figure>
              <span className="moreInfo-detail-info">
                Comprimir <br /> Editables
              </span>
            </div>
          </div>
        )}

        <div
          className="moreInfo-detail"
          title={'Comprimir PDFs'}
          onClick={handleArchiverOptions}
        >
          <figure className="moreInfo-detail-icon">
            <img src="/svg/compres-icon.svg" alt="W3Schools" />
          </figure>
          {data.projectName && (
            <span className="moreInfo-detail-info">Comprimir</span>
          )}
        </div>
        <div
          className="moreInfo-detail"
          title={'Comprimir Editables'}
          onClick={handleReports}
        >
          <figure className="moreInfo-detail-icon">
            <img src="/svg/reportExcel-icon.svg" alt="W3Schools" />
          </figure>
          {data.projectName && (
            <span className="moreInfo-detail-info">
              Generar <br /> reporte
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default MoreInfo;
