import './CardViewDocs.css';
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import Modal from '../../../portal/Modal';
import { isOpenViewDocs$ } from '../../../../services/sharingSubject';
import { Subscription } from 'rxjs';
import UploadUserFile from '../../../userList/uploadUserFile/UploadUserFile';
import { User } from '../../../../types/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { getListUsers } from '../../../../store/slices/listUsers.slice';

interface CardViewProps {
  user: User | null;
  // getUsers: () => void;
}

const CardViewDocs = ({ user }: CardViewProps) => {
  const { listUsers } = useSelector((state: RootState) => state);
  const [isOpen, setIsOpen] = useState(false);
  const [docs, setDocs] = useState<User>();
  const dispatch: AppDispatch = useDispatch();
  const handleIsOpen = useRef<Subscription>(new Subscription());
  const getUsers = async () => {
    dispatch(getListUsers());
  };

  const closeFunctions = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    // getUsers();
    if (listUsers && listUsers.length > 0) {
      const filterUser = listUsers?.find(data => data.id === user?.id);
      setDocs(filterUser);
    }
  }, [user, listUsers]);

  useEffect(() => {
    handleIsOpen.current = isOpenViewDocs$.getSubject.subscribe(value =>
      setIsOpen(value)
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  // console.log(docs);
  // console.log(user);

  return (
    <Modal size={50} isOpenProp={isOpen}>
      <div className="card-register-users">
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h1>Documentos</h1>
        {/* <div className="vd-container-list">
          <div className="vd-list-text">CV</div>
          <div className="vd-list-text">DECLARACION</div>
          <div className="vd-list-text">CONTRATO</div>
        </div> */}
        <div className="vd-docs-area">
          <div className="vd-list-text">
            <label>Curriculum Vitae</label>
            <UploadUserFile
              fileName={docs?.cv}
              typeFile="cv"
              userId={docs?.id}
              onSave={getUsers}
            />
          </div>
          <div className="vd-list-text">
            <label>Declaración Jurada</label>
            <UploadUserFile
              fileName={docs?.declaration}
              typeFile="declaration"
              userId={docs?.id}
              onSave={getUsers}
            />
          </div>
          <div className="vd-list-text">
            <label>Contrato</label>
            <UploadUserFile
              fileName={docs?.contract}
              typeFile="contract"
              userId={docs?.id}
              onSave={getUsers}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CardViewDocs;
