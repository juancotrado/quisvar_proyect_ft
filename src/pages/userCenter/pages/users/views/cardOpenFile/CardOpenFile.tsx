import './CardOpenFile.css';
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { isOpenCardFiles$ } from '../../../../../../services/sharingSubject';
import { Subscription } from 'rxjs';
import { URL } from '../../../../../../services/axiosInstance';
import {
  ButtonDelete,
  CloseIcon,
  LoaderOnly,
  Modal,
  UploadFile,
} from '../../../../../../components';
import { useDirectives } from '../../../../../../hooks';
import { formatDateTimeWeekdayUtc } from '../../../../../../utils/dayjsSpanish';

const CardOpenFile = () => {
  const directivesQuery = useDirectives();

  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const handleIsOpen = useRef<Subscription>(new Subscription());

  const getGeneralFiles = () => {
    directivesQuery.refetch();
  };
  const closeFunctions = () => setIsOpen(false);

  useEffect(() => {
    handleIsOpen.current = isOpenCardFiles$.getSubject.subscribe(
      ({ isOpen, isAdmin = false }) => {
        setIsOpen(isOpen);
        setIsAdmin(isAdmin);
      }
    );
    return () => handleIsOpen.current.unsubscribe();
  }, []);

  return (
    <Modal size={50} isOpenProp={isOpen}>
      <div className="card-register-users">
        <CloseIcon onClick={closeFunctions} />
        <h1>Directivas</h1>
        {directivesQuery.isFetching && (
          <div className="cardFile-loader">
            <LoaderOnly />
          </div>
        )}
        {isAdmin && (
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
          {directivesQuery.data?.map(file => (
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
                    {formatDateTimeWeekdayUtc(file.createdAt)}
                  </span>
                </div>
              </a>

              {isAdmin && (
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
