import './CardOpenFile.css';
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import Modal from '../../../portal/Modal';
import { isOpenCardFiles$ } from '../../../../services/sharingSubject';
import { Subscription } from 'rxjs';
import { URL, axiosInstance } from '../../../../services/axiosInstance';
import ButtonDelete from '../../button/ButtonDelete';
import UploadFile from '../../uploadFile/UploadFile';
import formatDate from '../../../../utils/formatDate';

interface GeneralFile {
  id: number;
  name: string;
  dir: string;
  createdAt: string;
}
const CardOpenFile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleIsOpen = useRef<Subscription>(new Subscription());
  const [generalFiles, setGeneralFiles] = useState<GeneralFile[] | null>(null);
  const getGeneralFiles = async () => {
    await axiosInstance.get('/files/generalFiles').then(res => {
      setGeneralFiles(res.data);
    });
  };
  const closeFunctions = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    getGeneralFiles();
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
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h1>Archivos</h1>
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

                <ButtonDelete
                  icon="trash-red"
                  onSave={getGeneralFiles}
                  url={`/files/generalFiles/${file.id}`}
                  className="subtaskFile-btn-delete"
                />
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};

export default CardOpenFile;
