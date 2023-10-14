import { useEffect, useRef, useState } from 'react';
import Modal from '../../../portal/Modal';
import { Subscription } from 'rxjs';
import { isOpenCardViewPdf$ } from '../../../../services/sharingSubject';
import { AttendancePdf } from '../../..';
// import { AttendanceRange } from '../../../../types/types';
import './CardViewPdf.css';
import { AttendanceRange } from '../../../../types/types';
import AttendanceRangePdf from '../../attendanceRangePdf/AttendanceRangePdf';
// interface CardViewProps {
//   exportPDF: AttendanceRange[];
//   daily?: string;
// }

const CardViewPdf = () => {
  //   const filterdUsers = exportPDF.filter(user => user.list.length !== 0);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<AttendanceRange[]>();
  const [daily, setDaily] = useState<string>();
  const [typeReport, setTypeReport] = useState<'range' | 'daily' | null>(null);
  const [rangeDate, setRangeDate] = useState({
    startDate: '',
    endDate: '',
  });

  const handleIsOpen = useRef<Subscription>(new Subscription());
  useEffect(() => {
    handleIsOpen.current = isOpenCardViewPdf$.getSubject.subscribe(value => {
      setIsOpen(value.isOpen);
      setData(value.data);
      setTypeReport(value.typeReport);

      if (value.daily) setDaily(value.daily);
      if (value.rangeDate) setRangeDate(value.rangeDate);
    });
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const closeFunctions = () => {
    setIsOpen(false);
  };
  return (
    <Modal size={60} isOpenProp={isOpen}>
      <div className="card-view-main">
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        {/* <h1>VISTA PREVIA</h1> */}
        {data && typeReport === 'daily' && (
          <AttendancePdf data={data} daily={daily} />
        )}
        {data && typeReport === 'range' && (
          <AttendanceRangePdf data={data} rangeDate={rangeDate} />
        )}
      </div>
    </Modal>
  );
};

export default CardViewPdf;
