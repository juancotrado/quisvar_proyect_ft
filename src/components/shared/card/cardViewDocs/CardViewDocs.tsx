import './CardViewDocs.css';
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import Modal from '../../../portal/Modal';
import { isOpenViewDocs$ } from '../../../../services/sharingSubject';
import { Subscription } from 'rxjs';
import UploadUserFile from '../../../userList/uploadUserFile/UploadUserFile';
import { User } from '../../../../types/types';

interface CardViewProps {
  user: User | null;
  getUsers: () => void;
}

const CardViewDocs = ({ user, getUsers }: CardViewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleIsOpen = useRef<Subscription>(new Subscription());

  const closeFunctions = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    handleIsOpen.current = isOpenViewDocs$.getSubject.subscribe(value =>
      setIsOpen(value)
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);

  return (
    <Modal size={50} isOpenProp={isOpen}>
      <div className="card-register-users">
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h1>Documentos</h1>
        <div className="vd-container-list">
          <div className="vd-list-text">CV</div>
          <div className="vd-list-text">DECLARACION</div>
          <div className="vd-list-text">CONTRATO</div>
        </div>
        <div className="col-span vd-docs-area">
          <UploadUserFile
            fileName={user?.cv}
            typeFile="cv"
            userId={user?.id}
            onSave={getUsers}
          />
          <UploadUserFile
            fileName={user?.declaration}
            typeFile="declaration"
            userId={user?.id}
            onSave={getUsers}
          />
          <UploadUserFile
            fileName={user?.contract}
            typeFile="contract"
            userId={user?.id}
            onSave={getUsers}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CardViewDocs;
