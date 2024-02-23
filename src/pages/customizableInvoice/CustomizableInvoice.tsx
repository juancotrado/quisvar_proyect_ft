import { ChangeEvent, useState } from 'react';
import xml2js from 'xml2js';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoiceXML } from '../../types';
import './customizableInvoice.css';
import { CustomizableInvoicePdf } from './pdfGenerator';
import { FileNameContainer, UploadFileInput } from '../../components';

export const CustomizableInvoice = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState({ xmlName: '', jpgName: '' });
  const [invoiceXml, setInvoiceXml] = useState<InvoiceXML | null>(null);
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    reader.onload = e => {
      const xmlText = e?.target?.result;
      if (xmlText) parseXML(xmlText);
    };
    if (!file) return;
    setFileName({ ...fileName, xmlName: file.name });
    reader.readAsText(file);
  };

  const parseXML = (xmlText: string | ArrayBuffer) => {
    const parser = new xml2js.Parser({ explicitArray: false });
    parser.parseString(xmlText, (error, result) => {
      if (error) return console.error('Error al analizar XML:', error);
      setInvoiceXml(result.Invoice);
    });
  };
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName({ ...fileName, jpgName: file.name });
      const reader = new FileReader();
      reader.onload = e => {
        const imgRead = e?.target?.result as string;
        if (imgRead) {
          setBackgroundImage(imgRead);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDeleteFile = (type: 'xmlName' | 'jpgName') => {
    if (type === 'xmlName') setInvoiceXml(null);
    if (type === 'jpgName') setBackgroundImage(null);
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
        <p className="customizableInvoice-text">
          Suba la plantilla generada por publisher en formato .jpg
        </p>
        {!fileName.jpgName ? (
          <UploadFileInput
            name="Cargar Archivo JPG"
            subName="O arrastre el archivo JPG aquí"
            onChange={handleImageUpload}
            accept="image/*"
            multiple
          />
        ) : (
          <FileNameContainer
            fileName={fileName.jpgName}
            icon="icon-xml"
            onDelete={() => handleDeleteFile('jpgName')}
          />
        )}
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
      {backgroundImage && invoiceXml && (
        <PDFDownloadLink
          document={
            <CustomizableInvoicePdf
              templateImg={backgroundImage}
              dataXml={invoiceXml}
            />
          }
          fileName={`template.pdf`}
          className="customizableInvoice-btn-send"
        >
          Crear PDF
        </PDFDownloadLink>
      )}
    </div>
  );
};
