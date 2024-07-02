import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  Input,
  Select,
  TextArea,
  Button,
  AdvancedSelect,
} from '../../../../../../../../components';
import './generateOrderService.css';
import {
  validateWhiteSpace,
  validateOnlyDecimals,
} from '../../../../../../../../utils';
import {
  Companies,
  CompanySelect,
  MessageType,
  ServiceOrderForm,
} from '../../../../../../../../types';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../../../../../services/axiosInstance';
import { ReceiptOfPaymentPdf, ServiceOrderPdf } from '../../pdfGenerate';
import { PAY_TYPE_OPTIONS } from '../../models';
import { isOpenViewPdf$ } from '../../../../../../../../services/sharingSubject';

interface GenerateOrderServiceProps {
  message: MessageType;
  onSave?: () => void;
}

const GenerateOrderService = ({
  message,
  onSave,
}: GenerateOrderServiceProps) => {
  const [companies, setCompanies] = useState<null | CompanySelect[]>(null);

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ServiceOrderForm>();

  useEffect(() => {
    axiosInstance.get<Companies[]>('/companies').then(res => {
      const transformData: CompanySelect[] = res.data.map(el => ({
        ...el,
        label: el.name,
        value: String(el.id),
      }));
      setCompanies(transformData);
    });
  }, []);

  const onSubmit: SubmitHandler<ServiceOrderForm> = async () => {
    const data = getData();
    axiosInstance
      .patch(`/paymail/done/${message.id}`, {
        paymentPdfData: JSON.stringify(data),
        ordenNumber: data.ordenNumber,
        companyId: +data.company.id,
      })
      .then(onSave);
  };

  const getData = () => {
    const { profile, ruc, address } = message.userInit?.user;
    const { company, ...formData } = watch();
    const dataServiceOrder = {
      ...formData,
      ...profile,
      ruc,
      address,
      title: message.title,
      company,
    };
    return dataServiceOrder;
  };
  const handleClickPdf = (type: 'orderServices' | 'paymentReceipt') => {
    const dataService = getData();
    const isOrderService = type === 'orderServices';
    const { firstName, lastName } = dataService;
    isOpenViewPdf$.setSubject = {
      fileNamePdf: `${
        isOrderService ? 'Orden de servicio' : 'Recibo de Pago'
      } - ${firstName} ${lastName}`,
      pdfComponentFunction: isOrderService
        ? ServiceOrderPdf({ data: dataService })
        : ReceiptOfPaymentPdf({ data: dataService }),
      isOpen: true,
    };
  };
  const hasRuc = !!getData().ruc.length;
  return (
    <div className="generateOrderService">
      <h2 className="generateOrderService-title">
        GENERAR ORDEN DE SERVICIO Y RECIBO DE PAGO
      </h2>
      <form
        className="generateOrderService-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-input">
          {companies && (
            <Controller
              control={control}
              name="company"
              rules={{ required: 'Debes seleccionar una opción' }}
              render={({ field }) => (
                <AdvancedSelect
                  {...field}
                  placeholder="Selecione una opción"
                  options={companies}
                  isClearable
                  label={'Empresa:'}
                  errors={errors}
                  name="company"
                  onChange={value => {
                    setValue('ordenNumber', value?.orderQuantity ?? 0);
                    field.onChange(value);
                  }}
                />
              )}
            />
          )}
          <Input
            label="Numero de orden:"
            {...register('ordenNumber', {
              validate: { validateWhiteSpace, validateOnlyDecimals },
              valueAsNumber: true,
            })}
            errors={errors}
            placeholder="N° Orden"
            name="ordenNumber"
          />
        </div>
        <TextArea
          label="Concepto:"
          {...register('concept', {
            validate: { validateWhiteSpace },
          })}
          defaultValue={message.header}
          rows={3}
          name="concept"
          placeholder="Concepto"
          errors={errors}
        />
        <div className="col-input">
          <Input
            label="Monto (S/.):"
            {...register('amount', { validate: { validateWhiteSpace } })}
            errors={errors}
            placeholder="Monto"
            name="amount"
          />
          <Select
            label="Tipo de pago:"
            {...register('payType', {
              validate: { validateWhiteSpace },
            })}
            name="payType"
            data={PAY_TYPE_OPTIONS}
            extractValue={({ id }) => id}
            renderTextField={({ value }) => value}
            errors={errors}
            placeholder="Seleccione"
          />
        </div>
        {watch('payType') === 'CUENTA' && (
          <Input
            label="N° de Cuenta"
            {...register('acountNumber', { validate: { validateWhiteSpace } })}
            errors={errors}
            className="messagePage-input"
            placeholder="N° de Cuenta"
            name="acountNumber"
            type="text"
          />
        )}
        {watch('payType') === 'CHEQUE' && (
          <Input
            label="N° de Cheque"
            {...register('acountCheck', { validate: { validateWhiteSpace } })}
            errors={errors}
            className="messagePage-input"
            placeholder="N° de Cheque"
            name="acountCheck"
            type="text"
          />
        )}
        {!hasRuc && (
          <span style={{ color: 'red', fontSize: '1rem' }}>
            Usuario sin ruc
          </span>
        )}

        <Button
          className={`messagePage-btn-submit`}
          text="Enviar Formulario"
          disabled={!hasRuc}
        />
      </form>
      <div className="generateOrderService-previews-btns">
        <Button
          icon="preview-pdf"
          text="Orden de Servicio"
          styleButton={2}
          onClick={() => handleClickPdf('orderServices')}
        />

        <Button
          icon="preview-pdf"
          text="Recibo de Pago"
          styleButton={2}
          onClick={() => handleClickPdf('paymentReceipt')}
        />
      </div>
    </div>
  );
};

export default GenerateOrderService;
