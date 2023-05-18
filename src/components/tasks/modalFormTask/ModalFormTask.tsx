import { FormEvent, useEffect, useRef, useState } from 'react';
import Modal from '../../portal/Modal';
import Button from '../../shared/button/Button';
import { isOpenModal$ } from '../../../services/sharingSubject';

const ModalFormTask = () => {
  const sendForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const closeModal = () => (isOpenModal$.setSubject = false);

  return (
    <Modal size={50}>
      <form onSubmit={sendForm} className="card-register-area">
        <span className="close-icon" onClick={closeModal}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <div className="col">
          <div className="btn-contain">
            <Button
              text={'ACTUALIZAR'}
              className="btn-area"
              whileTap={{ scale: 0.9 }}
              type="submit"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ModalFormTask;
