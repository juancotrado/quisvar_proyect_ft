import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Input,
  Select,
  TextArea,
  Button,
} from '../../../../../../../../components';
import './generateOrderService.css';
import { validateWhiteSpace } from '../../../../../../../../utils';
import {
  Companies,
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
  const [companies, setCompanies] = useState<null | Companies[]>(null);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<ServiceOrderForm>();

  useEffect(() => {
    axiosInstance.get('/companies').then(res => {
      setCompanies(res.data);
    });
  }, []);

  const onSubmit: SubmitHandler<ServiceOrderForm> = async () => {
    const data = getData();
    axiosInstance
      .patch(`/paymail/done/${message.id}`, {
        paymentPdfData: JSON.stringify(data),
      })
      .then(onSave);
  };

  const getData = () => {
    const { profile, ruc, address } = message.userInit.user;
    const { companyId, ...formData } = watch();
    const companySelect = companies?.find(company => company.id === +companyId);
    const dataServiceOrder = {
      ...formData,
      ...profile,
      ruc,
      address,
      title: message.title,
      companyName: companySelect?.name ?? '',
      companyRuc: companySelect?.ruc ?? '',
      companyId,
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
            <Select
              {...register('companyId', {
                validate: { validateWhiteSpace },
              })}
              label="Empresa:"
              name="companyId"
              data={companies}
              itemKey="id"
              textField="name"
              errors={errors}
              placeholder="Seleccionar la empresa"
              className="messagePage-input"
            />
          )}
          <Input
            label="Numero de orden:"
            {...register('ordenNumber', {
              validate: { validateWhiteSpace },
              valueAsNumber: true,
            })}
            errors={errors}
            placeholder="N° Orden"
            name="ordenNumber"
            type="number"
          />
        </div>
        <TextArea
          label="Concepto:"
          {...register('concept', {
            validate: { validateWhiteSpace },
          })}
          defaultValue={message.header}
          rows={3}
          isRelative
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
            type="number"
          />
          <Select
            label="Tipo de pago:"
            {...register('payType', {
              validate: { validateWhiteSpace },
            })}
            name="payType"
            data={PAY_TYPE_OPTIONS}
            itemKey="id"
            textField="value"
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
        <Button className={`messagePage-btn-submit`} text="Enviar Formulario" />
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
