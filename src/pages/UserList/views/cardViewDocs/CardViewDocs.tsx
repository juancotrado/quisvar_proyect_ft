import './CardViewDocs.css';
import { useEffect, useRef, useState } from 'react';
import { isOpenViewDocs$ } from '../../../../services/sharingSubject';
import { Subscription } from 'rxjs';
import { TypeFileUser, User } from '../../../../types';
import { axiosInstance } from '../../../../services/axiosInstance';
import { useDispatch } from 'react-redux';
import { getListUsers } from '../../../../store/slices/listUsers.slice';
import { AppDispatch } from '../../../../store';
import { Modal } from '../../../../components';
import { UploadUserFile } from '../../components';

interface UserDocument {
  [key: string]: {
    fileName: string | null | undefined;
    typeFile: TypeFileUser;
  };
}

const CardViewDocs = () => {
  const dispatch: AppDispatch = useDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleIsOpen = useRef<Subscription>(new Subscription());
  const updateUser = () => {
    axiosInstance.get(`/users/${user?.id}`).then(res => {
      setUser(res.data);
      dispatch(getListUsers());
    });
  };

  const closeFunctions = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    handleIsOpen.current = isOpenViewDocs$.getSubject.subscribe(data => {
      const { isOpen, user } = data;
      setUser(user);
      setIsOpen(isOpen);
    });
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);

  const dataDocuments: UserDocument = {
    ['Curriculum Vitae']: { fileName: user?.cv, typeFile: 'cv' },
    ['Declaración Jurada']: {
      fileName: user?.declaration,
      typeFile: 'declaration',
    },
    ['Contrato']: { fileName: user?.contract, typeFile: 'contract' },
    ['Declaracion Jurada al retirarse']: {
      fileName: user?.withdrawalDeclaration,
      typeFile: 'withdrawalDeclaration',
    },
  };

  return (
    <Modal size={50} isOpenProp={isOpen}>
      <div className="card-register-users">
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h1>Documentos</h1>
        <div className="vd-docs-area">
          {Object.entries(dataDocuments).map(
            ([key, { fileName, typeFile }]) => (
              <div className="vd-list-text">
                <label>{key}</label>
                <UploadUserFile
                  fileName={fileName}
                  typeFile={typeFile}
                  userId={user?.id}
                  onSave={updateUser}
                />
              </div>
            )
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CardViewDocs;
