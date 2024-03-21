import { useEffect, useRef, useState } from 'react';
import {
  Button,
  CloseIcon,
  Modal,
  TextArea,
} from '../../../../../../components';
import { SubmitHandler, useForm } from 'react-hook-form';
import { validateWhiteSpace } from '../../../../../../utils';
import { Subscription } from 'rxjs';
import { isOpenCardObservations$ } from '../../../../../../services/sharingSubject';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../../store';
import { getContractThunks } from '../../../../../../store/slices/contract.slice';

const CardObservations = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<{ observations: string }>();
  const contract = useSelector((state: RootState) => state.contract);
  const dispatch: AppDispatch = useDispatch();

  const handleIsOpen = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleIsOpen.current = isOpenCardObservations$.getSubject.subscribe(
      data => {
        const { isOpen, observations } = data;
        setIsOpenModal(isOpen);

        reset({
          observations,
        });
      }
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, [reset]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const onSubmit: SubmitHandler<{ observations: string }> = ({
    observations,
  }) => {
    if (!contract) return;
    axiosInstance
      .put(`/contract/${contract.id}/observations`, { observations })
      .then(() => {
        dispatch(getContractThunks(String(contract.id)));
        closeFunctions();
      });
  };
  const closeFunctions = () => {
    reset({});
    setIsOpenModal(false);
  };
  return (
    <Modal size={50} isOpenProp={isOpenModal}>
      <CloseIcon onClick={closeFunctions} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-register-project"
        autoComplete="off"
      >
        <h2>Observaciones</h2>
        <hr />
        <div className="card-register-project-container-details">
          <TextArea
            {...register('observations', {
              validate: { validateWhiteSpace },
            })}
            isRelative
            rows={15}
            name="observations"
            className="input-main-style-2_1"
            placeholder="Observaciones"
            errors={errors}
            styleInput={3}
          />
        </div>

        <Button type="submit" text={`Guardar`} styleButton={4} />
      </form>
    </Modal>
  );
};

export default CardObservations;
