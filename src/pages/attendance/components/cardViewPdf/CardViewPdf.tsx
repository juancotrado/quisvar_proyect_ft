import { useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import { isOpenCardViewPdf$ } from '../../../../services/sharingSubject';
import './CardViewPdf.css';
import { AttendanceRange } from '../../../../types';
import { AttendancePdf, AttendanceRangePdf } from '..';
import { CloseIcon, Modal } from '../../../../components';

export const CardViewPdf = () => {
  //   const filterdUsers = exportPDF.filter(user => user.list.length !== 0);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<AttendanceRange[] | null>(null);
  const [position, setPosition] = useState<number>();
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
      setPosition(value.position);
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
        <CloseIcon onClick={closeFunctions} />
        {data && typeReport === 'daily' && (
          <AttendancePdf data={data} daily={daily} position={position} />
        )}
        {data && typeReport === 'range' && (
          <AttendanceRangePdf data={data} rangeDate={rangeDate} />
        )}
      </div>
    </Modal>
  );
};

export default CardViewPdf;
