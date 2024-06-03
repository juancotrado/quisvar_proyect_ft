import { ChangeEvent, FocusEvent, useEffect, useRef, useState } from 'react';
import xml2js from 'xml2js';
import { CompaniesSelect, InvoiceXML } from '../../types';
import './customizableInvoice.css';
import { InvoicePdf } from './pdfGenerator';
import {
  AdvancedSelect,
  FileNameContainer,
  Input,
  UploadFileInput,
} from '../../components';
import { SnackbarUtilities } from '../../utils';
import { useCompanySelect, useInvoiceCompany } from './hooks';
import { SingleValue } from 'react-select';
import { isOpenViewPdf$ } from '../../services/sharingSubject';

export const CustomizableInvoice = () => {
  const companySelectQuery = useCompanySelect();
  const invoiceCompanyMutation = useInvoiceCompany();
  const timeout = useRef<null | NodeJS.Timeout>(null);
  const [company, setCompany] = useState<null | CompaniesSelect>(null);

  const [fileName, setFileName] = useState({ xmlName: '', jpgName: '' });
  const [invoiceXml, setInvoiceXml] = useState<InvoiceXML | null>(null);
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    reader.onload = e => {
      const xmlText = e?.target?.result;
      if (xmlText && file) parseXML(xmlText, file);
    };
    if (file) reader.readAsText(file);
  };

  const parseXML = (xmlText: string | ArrayBuffer, file: File) => {
    const parser = new xml2js.Parser({ explicitArray: false });
    parser.parseString(xmlText, (error, result) => {
      if (error || result.Invoice?.['cbc:UBLVersionID'] !== '2.1') {
        SnackbarUtilities.error('Error al analizar XML');
      } else {
        setFileName({ ...fileName, xmlName: file.name });
        setInvoiceXml(result.Invoice);
      }
    });
  };

  const handleChangeData = ({ target }: FocusEvent<HTMLInputElement>) => {
    if (!company) return;
    const { name, value } = target;
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      const { color, phone, email, id } = company;
      invoiceCompanyMutation.mutate({
        color,
        phone,
        email,
        idCompany: id,
        [name]: value,
      });
    }, 1000);
    setCompany({ ...company, [name]: value });
  };

  const handleSelectOption = async (option: SingleValue<CompaniesSelect>) => {
    if (option) setCompany(option);
  };

  const openPdf = () => {
    if (!company || !invoiceXml) return;
    isOpenViewPdf$.setSubject = {
      fileNamePdf: `factura-${company.name}.pdf`,
      pdfComponentFunction: InvoicePdf({ company, dataXml: invoiceXml }),
      isOpen: true,
    };
  };

  const handleDeleteFile = (type: 'xmlName' | 'jpgName') => {
    if (type === 'xmlName') setInvoiceXml(null);
    setFileName({ ...fileName, [type]: '' });
  };
  return (
    <div className="customizableInvoice">
      <div className="customizableInvoice-title-container">
        <h1 className="customizableInvoice-title">
          PERSONALIZAR FACTURA ELECTRÓNICA
        </h1>
        <h2 className="customizableInvoice-subtitle">
          Insertar logo de empresa a facturas electrónicas emitidas por clave
          SOL
        </h2>
      </div>
      <div className="customizableInvoice-file-container">
        <p className="customizableInvoice-text">Seleccione la empresa</p>
        <AdvancedSelect
          options={companySelectQuery.data}
          menuPosition="fixed"
          isLoading={companySelectQuery.isFetching}
          placeholder={'Seleccione...'}
          isDisabled={companySelectQuery.isFetching}
          onChange={handleSelectOption}
        />
        <div className="customizableInvoice-color-container">
          <span className="customizableInvoice-color-label">
            Color primario:
          </span>
          <input
            type="color"
            onChange={handleChangeData}
            name="color"
            disabled={!company || companySelectQuery.isFetching}
            value={company?.color || '#fff'}
          />
        </div>
        <div className="col-input">
          <Input
            label="Celular:"
            onChange={handleChangeData}
            value={company?.phone || ''}
            placeholder="celular"
            name="phone"
          />
          <Input
            onChange={handleChangeData}
            label="Correo:"
            value={company?.email || ''}
            placeholder="correo electronico"
            name="email"
          />
        </div>
      </div>
      <div className="customizableInvoice-file-container">
        <p className="customizableInvoice-text">
          Suba la factura generada por la SUNAT en formato .XML
        </p>
        {!fileName.xmlName ? (
          <UploadFileInput
            name=" Cargar Archivo XML"
            subName=" O arrastre el archivo XML aquí"
            onChange={handleFileUpload}
            accept=".xml"
            multiple
          />
        ) : (
          <FileNameContainer
            fileName={fileName.xmlName}
            icon="icon-xml"
            onDelete={() => handleDeleteFile('xmlName')}
          />
        )}
      </div>

      <button
        disabled={!invoiceXml || !company}
        className="customizableInvoice-btn-send"
        onClick={openPdf}
      >
        Crear PDF
      </button>
    </div>
  );
};
