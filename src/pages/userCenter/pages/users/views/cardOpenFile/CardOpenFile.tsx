import './CardOpenFile.css';
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { isOpenCardFiles$ } from '../../../../../../services/sharingSubject';
import { Subscription } from 'rxjs';
import { URL } from '../../../../../../services/axiosInstance';
import { GeneralFile } from '../../../../../../types';
import { formatDate } from '../../../../../../utils';
import {
  ButtonDelete,
  CloseIcon,
  Modal,
  UploadFile,
} from '../../../../../../components';

interface CardOpenFileProps {
  generalFiles: GeneralFile[];
  getGeneralFiles?: () => void;
}

const CardOpenFile = ({ generalFiles, getGeneralFiles }: CardOpenFileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleIsOpen = useRef<Subscription>(new Subscription());

  const closeFunctions = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    handleIsOpen.current = isOpenCardFiles$.getSubject.subscribe(value =>
      setIsOpen(value)
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const formatedDate = (date: string) =>
    formatDate(new Date(date), {
      day: 'numeric',
      weekday: 'long',
      month: 'long',
      year: 'numeric',
    });

  return (
    <Modal size={50} isOpenProp={isOpen}>
      <div className="card-register-users">
        <CloseIcon onClick={closeFunctions} />
        <h1>Directivas</h1>
        {getGeneralFiles && (
          <div className="col-input card-open-file-main">
            <div className="card-open-file-contain">
              <UploadFile
                text="Subir Archivo"
                onSave={getGeneralFiles}
                uploadName="generalFile"
                URL={`/files/uploadGeneralFiles`}
                className="userList-upload"
              />
            </div>
          </div>
        )}

        <div className="card-open-files-contain">
          {generalFiles &&
            generalFiles.map(file => (
              <div key={file.id} className="subtaskFile-contain">
                <a
                  href={`${URL}/${file.dir}`}
                  target="_blank"
                  className="subtaskFile-anchor"
                  download={true}
                >
                  <img
                    src="/svg/file-download.svg"
                    alt="W3Schools"
                    className="subtaskFile-icon"
                  />
                  <div className="card-openfile-info">
                    <span className="card-openfile-name">{file.name}</span>
                    <span className="card-openfile-date">
                      {formatedDate(file.createdAt)}
                    </span>
                  </div>
                </a>

                {getGeneralFiles && (
                  <ButtonDelete
                    icon="trash-red"
                    onSave={getGeneralFiles}
                    url={`/files/generalFiles/${file.id}`}
                    className="subtaskFile-btn-delete"
                  />
                )}
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};

export default CardOpenFile;
