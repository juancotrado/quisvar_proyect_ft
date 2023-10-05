/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import './mailPage.css';
import { axiosInstance } from '../../services/axiosInstance';
import {
  MailType,
  MessageStatus,
  MessageTypeImbox,
  UserRoleType,
  licenseList,
} from '../../types/types';
import CardMessage from '../../components/shared/card/cardMessage/CardMessage';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import CardRegisterMessage from '../../components/shared/card/cardRegisterMessage/CardRegisterMessage';
import Button from '../../components/shared/button/Button';
import SelectOptions from '../../components/shared/select/Select';
import { listStatusMsg, listTypeMsg } from '../../utils/files/files.utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { CardGenerateReport, CardLicense } from '../../components';
import { isOpenCardLicense$ } from '../../services/sharingSubject';
import { LicenseListHeader, LicenseListItem } from '..';

const InitTMail: MailType['type'] = 'RECEIVER';
const MailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userSession: user } = useSelector((state: RootState) => state);
  const [listMessage, setListMessage] = useState<MailType[] | null>(null);
  const [listLicense, setListLicense] = useState<licenseList[]>([]);
  const [viewLicense, setViewLicense] = useState(false);
  const [totalMail, setTotalMail] = useState(0);
  const [skip, setSkip] = useState(0);
  //-----------------------------QUERIES-----------------------------------
  const [typeMsg, setTypeMsg] = useState<MessageTypeImbox | null>(null);
  const [typeMail, setTypeMail] = useState<MailType['type'] | null>(InitTMail);
  const [statusMsg, setStatusMsg] = useState<MessageStatus | null>(null);
  //-----------------------------------------------------------------------
  const size = !!searchParams.get('size') || false;
  const refresh = !!searchParams.get('refresh') || false;
  const [isNewMessage, setIsNewMessage] = useState(false);
  const permissions = ['SUPER_MOD', 'MOD', 'EMPLOYEE'].includes(user.role);
  const viewMessage = (id: number, type: MailType['type']) =>
    navigate(`${id}?size=true&type=${type}`);

  useEffect(() => {
    if (!permissions) verifyLicenses();
  }, []);
  useEffect(() => getMessages(), [typeMail, typeMsg, statusMsg]);
  useEffect(() => {
    getMessages();
  }, [refresh]);
  const handleNewMessage = () => setIsNewMessage(true);
  const handleCloseMessage = () => setIsNewMessage(false);
  const handleSaveMessage = () => {
    getMessages();
    setIsNewMessage(false);
  };
  const getMessages = () => {
    const type = (typeMail && `&type=${typeMail}`) || '';
    const status = (statusMsg && `&status=${statusMsg}`) || '';
    const typeMessage = (typeMsg && `&typeMessage=${typeMsg}`) || '';
    const offset = `&skip=${skip}`;
    const query = `/mail?${type}${status}${typeMessage}${offset}`;
    if (typeMail !== 'LICENSE') {
      axiosInstance.get(query).then(res => {
        setListMessage(res.data.mail);
        setTotalMail(res.data.total);
      });
    } else {
      if (user.role && permissions) {
        axiosInstance.get(`license/employee/${user.id}`).then(res => {
          setListLicense(res.data);
        });
      }
      if (!permissions) {
        axiosInstance.get('license/status').then(res => {
          setListLicense(res.data);
        });
      }
    }
  };
  const handleSelectReceiver = () => {
    setViewLicense(false);
    setTypeMail('RECEIVER');
    setStatusMsg(null);
    setTypeMsg(null);
  };
  const handleSelectSender = () => {
    setViewLicense(false);
    setTypeMail('SENDER');
    setStatusMsg(null);
    setTypeMsg(null);
  };
  const handleArchived = () => {
    setViewLicense(false);
    setTypeMail(null);
    setStatusMsg('ARCHIVADO');
    setTypeMsg(null);
  };
  const handlelicense = () => {
    setViewLicense(true);
    setTypeMail('LICENSE');
    setStatusMsg(null);
    setTypeMsg(null);
  };

  const handleNextPage = () => {
    const total = Math.floor(totalMail / 20);
    const limit = Math.ceil(skip / 20);
    if (limit < total) setSkip(skip === 0 ? skip + 21 : skip + 20);
  };
  const handlePreviusPage = () => {
    const limit = Math.floor(skip / 20);
    if (0 < limit) setSkip(skip === 21 ? skip - 21 : skip - 20);
  };
  const showCardReport = () => {
    isOpenCardLicense$.setSubject = {
      isOpen: true,
    };
  };
  const showCardReportData = (data: licenseList) => {
    isOpenCardLicense$.setSubject = {
      isOpen: true,
      data,
    };
  };
  const verifyLicenses = () => {
    axiosInstance
      .post('/license/expired')
      .then(() => console.log('Datos limpiados'));
  };
  return (
    <div className="mail-main container">
      <div className="mail-main-master-container">
        <div className="mail-messages-container">
          <div className={`message-container-header`}>
            <div className="message-container-header-options">
              <h2>Trámites</h2>
              <Button
                icon="refresh"
                text={(!size && 'Actualizar') || undefined}
                className={`mail-main-options-btn`}
                onClick={getMessages}
              />
            </div>
            <div className="message-options-filter">
              <div className="mail-main-options-container">
                <Button
                  icon="inbox"
                  text={(!size && 'Bandeja de entrada') || undefined}
                  className={`mail-main-options-btn
                  ${typeMail === 'RECEIVER' && 'options-main-selected'} `}
                  onClick={handleSelectReceiver}
                />
                <Button
                  icon="tabler"
                  text={(!size && 'Enviados') || undefined}
                  className={`mail-main-options-btn
                  ${typeMail === 'SENDER' && 'options-main-selected'} `}
                  onClick={handleSelectSender}
                />
                <Button
                  icon="archiver-box"
                  text={(!size && 'Archivados') || undefined}
                  className={`mail-main-options-btn
                  ${!typeMail && 'options-main-selected'}`}
                  onClick={handleArchived}
                />
                <Button
                  icon="archiver-box"
                  text={(!size && 'Solicitud de Licencias') || undefined}
                  className={`mail-main-options-btn
                  ${typeMail === 'LICENSE' && 'options-main-selected'}`}
                  onClick={handlelicense}
                />
              </div>
              <div className="mail-main-options-container">
                <span className="mail-main-options-title-filter">
                  <img
                    className="mail-mail-options-title-filter-img"
                    src="/svg/filter.svg"
                  />
                  Filtrar
                </span>
                <SelectOptions
                  data={listStatusMsg}
                  className="mail-option-select"
                  placeholder="Estado"
                  onChange={({ target }) =>
                    target.value !== '0' &&
                    setStatusMsg(target.value as MessageStatus)
                  }
                  name="Status"
                  itemKey="id"
                  textField="id"
                />
                <SelectOptions
                  className="mail-option-select"
                  placeholder="Documento"
                  data={listTypeMsg}
                  onChange={({ target }) =>
                    target.value !== '0' &&
                    setTypeMsg(target.value as MessageTypeImbox)
                  }
                  name="type"
                  itemKey="id"
                  textField="id"
                />
              </div>
              {permissions && (
                <span className="mail-license" onClick={showCardReport}>
                  <img
                    className="mail-mail-options-title-filter-img"
                    src="/svg/license-icon.svg"
                  />
                  Solicitar Licencia
                </span>
              )}
              <Button
                onClick={handleNewMessage}
                icon="plus-dark"
                text="Nuevo Trámite"
                className="mail-new-message-btn"
              />
            </div>
            {!viewLicense ? (
              <div
                className={`message-container-header-titles status-mail-header-${size} `}
              >
                <div className="message-header-item">
                  <span>#DOCUMENTO</span>
                </div>
                <div className="message-header-item">
                  <span>{`${
                    typeMail === 'RECEIVER' ? 'REMITENTE' : 'DESTINATARIO'
                  }`}</span>
                </div>
                <div className="message-header-item mail-grid-col-2">
                  <span>ASUNTO</span>
                </div>
                {!size && (
                  <>
                    <div className="message-header-item">
                      <span>ESTADO</span>
                    </div>
                    <div className="message-header-item">
                      <span>DEPENDENCIA</span>
                    </div>
                    <div className="message-header-item">
                      <span>FECHA DE ENVÍO</span>
                    </div>
                    {user.role === 'SUPER_ADMIN' && (
                      <div className="message-header-item message-cursor-none">
                        <span>ARCHIVAR</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <LicenseListHeader isEmployee={permissions} />
            )}
          </div>
          <div className="mail-grid-container">
            {!viewLicense ? (
              listMessage &&
              listMessage.map(({ message, messageId, type }) => (
                <CardMessage
                  user={user}
                  isActive={size}
                  key={messageId}
                  type={type}
                  onArchiver={handleSaveMessage}
                  onClick={() => viewMessage(messageId, type)}
                  message={message}
                />
              ))
            ) : listLicense.length > 0 ? (
              listLicense.map((license, index) => (
                <LicenseListItem
                  key={license.id}
                  data={license}
                  index={index}
                  isEmployee={permissions}
                  editData={() => showCardReportData(license)}
                  onSave={getMessages}
                />
              ))
            ) : (
              <div>hola mundo</div>
            )}
          </div>
          <div className="mail-footer-section">
            <Button
              className="mail-previus-btn-pagination"
              icon="down"
              onClick={handlePreviusPage}
            />
            <span className="mail-pagination-title">
              {skip === 0 && totalMail !== 0 ? 1 : skip}
              {`-${skip + totalMail < 20 ? totalMail : 20}`} de {totalMail}
            </span>
            <Button
              className="mail-next-btn-pagination"
              icon="down"
              onClick={handleNextPage}
            />
          </div>
        </div>
      </div>
      <div className={`mail-messages-details mail-m-size-${size}`}>
        <Outlet />
      </div>
      <CardGenerateReport />

      {isNewMessage && (
        <CardRegisterMessage
          onClosing={handleCloseMessage}
          onSave={handleSaveMessage}
        />
      )}
      {/* {user.role === 'EMPLOYEE'} */}
      <CardLicense />
    </div>
  );
};

export default MailPage;
