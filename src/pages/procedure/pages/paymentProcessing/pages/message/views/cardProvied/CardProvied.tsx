import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ProviedForm } from '../../models';
import './cardProvied.css';
import {
  AdvancedSelect,
  Button,
  Input,
} from '../../../../../../../../components';
import { validateWhiteSpace } from '../../../../../../../../utils';
import { useListUsers } from '../../../../../../../../hooks';

const CardProvied = () => {
  const { users } = useListUsers('MOD', 'tramites', 'tramite-regular');

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<ProviedForm>();
  const onSubmit: SubmitHandler<ProviedForm> = async data => {
    console.log('data', data);
  };
  const usersSelect = users.map(user => ({ value: user.id, label: user.name }));
  return (
    <form className="cardProvied" onSubmit={handleSubmit(onSubmit)}>
      <div className="messagePage-input-contain">
        <Input
          {...register('title', { validate: { validateWhiteSpace } })}
          errors={errors}
          label="Titulo:"
          placeholder="Titulo"
          styleInput={2}
        />
        <Input
          {...register('numberPage', { validate: { validateWhiteSpace } })}
          errors={errors}
          label="Númeracion:"
          placeholder="Númeracion"
          styleInput={2}
        />
      </div>

      <Controller
        control={control}
        name="to"
        rules={{ required: 'Debes seleccionar una opción' }}
        render={({ field: { onChange } }) => (
          <AdvancedSelect
            placeholder="Selecione una opción"
            options={usersSelect}
            isClearable
            label={'Para:'}
            errors={errors}
            name="to"
            onChange={onChange}
          />
        )}
      />
      <Input
        {...register('observation', { validate: { validateWhiteSpace } })}
        errors={errors}
        label="Observaciones:"
        placeholder="Observaciones"
        styleInput={2}
      />
      <Button type="submit" text="Enviar" styleButton={4} />
    </form>
  );
};

export default CardProvied;
