import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Input,
  Select,
  TextArea,
  Button,
} from '../../../../../../../../components';
import './generateOrderService.css';
import { validateWhiteSpace } from '../../../../../../../../utils';
import { PDFDownloadLink } from '@react-pdf/renderer';
import {
  Companies,
  MessageType,
  ServiceOrderData,
  ServiceOrderForm,
} from '../../../../../../../../types';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../../../../../services/axiosInstance';
import { ReceiptOfPaymentPdf, ServiceOrderPdf } from '../../pdfGenerate';

const payTypeOptions = [
  { id: 'EFECTIVO', value: 'EFECTIVO' },
  { id: 'CUENTA', value: 'CUENTA' },
  { id: 'CHEQUE', value: 'CHEQUE' },
];

interface GenerateOrderServiceProps {
  message: MessageType;
  onSave?: () => void;
}
const serviceOrderInitValues: ServiceOrderData = {
  firstName: '',
  lastName: '',
  dni: '',
  phone: '',
  degree: '',
  description: '',
  concept: '',
  amount: '',
  payType: '',
  acountNumber: '',
  acountCheck: '',
  ruc: '',
  address: '',
  companyName: '',
  companyRuc: '',
  title: '',
};
const GenerateOrderService = ({
  message,
  onSave,
}: GenerateOrderServiceProps) => {
  const [companies, setCompanies] = useState<null | Companies[]>(null);
  const [dataServiceOrder, setDataServiceOrder] = useState<ServiceOrderData>(
    serviceOrderInitValues
  );
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
    const data = handleFocus();
    axiosInstance
      .patch(`/paymail/done/${message.id}`, {
        paymentPdfData: JSON.stringify(data),
      })
      .then(onSave);
  };
  const handleFocus = () => {
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
    };
    setDataServiceOrder(dataServiceOrder);
    return dataServiceOrder;
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
        {companies && (
          <Select
            {...register('companyId', {
              validate: { validateWhiteSpace },
            })}
            name="companyId"
            data={companies}
            itemKey="id"
            textField="name"
            errors={errors}
            placeholder="Seleccionar la empresa"
            className="messagePage-input"
          />
        )}
        <TextArea
          label="Concepto:"
          {...register('concept', {
            validate: { validateWhiteSpace },
          })}
          rows={3}
          isRelative
          name="concept"
          placeholder="Concepto"
          errors={errors}
          className="messagePage-input"
          defaultValue={message.header}
        />
        <div className="messagePage-input-contain">
          <Input
            label="Monto (S/.):"
            {...register('amount', { validate: { validateWhiteSpace } })}
            errors={errors}
            className="messagePage-input"
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
            data={payTypeOptions}
            itemKey="id"
            textField="value"
            errors={errors}
            placeholder="Seleccione"
            className="messagePage-input"
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

        <div
          className="generateOrderService-previews-btns"
          onMouseOver={handleFocus}
        >
          <PDFDownloadLink
            document={<ServiceOrderPdf data={dataServiceOrder} />}
            fileName={`asdasdS.pdf`}
            className="generateOrderService-preview-pdf"
          >
            <figure className="cardRegisteVoucher-figure">
              <img src={`/svg/preview-pdf.svg`} />
            </figure>
            Orden de Servicio
          </PDFDownloadLink>
          <PDFDownloadLink
            document={<ReceiptOfPaymentPdf data={dataServiceOrder} />}
            fileName={`asdasdS.pdf`}
            className="generateOrderService-preview-pdf"
          >
            <figure className="cardRegisteVoucher-figure">
              <img src={`/svg/preview-pdf.svg`} />
            </figure>
            Recibo de Pago
          </PDFDownloadLink>
        </div>
      </form>
    </div>
  );
};

export default GenerateOrderService;
