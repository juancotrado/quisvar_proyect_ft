import { useEffect, useRef, useState } from 'react';
import Modal from '../../../portal/Modal';
import { Subscription } from 'rxjs';
import { isOpenCardViewPdf$ } from '../../../../services/sharingSubject';
import { AttendancePdf } from '../../..';
import { AttendanceRange } from '../../../../types/types';
import './CardViewPdf.css';
interface CardViewProps {
  exportPDF: AttendanceRange[];
  daily?: string;
}

const CardViewPdf = ({ exportPDF, daily }: CardViewProps) => {
  const filterdUsers = exportPDF.filter(user => user.list.length !== 0);
  const [isOpen, setIsOpen] = useState(false);
  const handleIsOpen = useRef<Subscription>(new Subscription());
  useEffect(() => {
    handleIsOpen.current = isOpenCardViewPdf$.getSubject.subscribe(value =>
      setIsOpen(value)
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const closeFunctions = () => {
    setIsOpen(false);
    // onClose?.();
    // setErrorPassword({});
    // reset();
  };
  return (
    <Modal size={50} isOpenProp={isOpen}>
      <div className="card-view-main">
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        {/* <h1>VISTA PREVIA</h1> */}
        <AttendancePdf data={filterdUsers} daily={daily} />
      </div>
    </Modal>
  );
};

export default CardViewPdf;
