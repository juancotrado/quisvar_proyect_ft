import { ChangeEvent, useState } from 'react';
import xml2js from 'xml2js';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { CustomizableInvoicePdf } from '../../components/shared/CustomizableInvoicePdf/CustomizableInvoicePdf';
import { InvoiceXML } from '../../types/typeFactura';

const CustomizableInvoice = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [invoiceXml, setInvoiceXml] = useState<InvoiceXML | null>(null);
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    reader.onload = e => {
      const xmlText = e?.target?.result;
      console.log(xmlText);
      if (xmlText) parseXML(xmlText);
    };
    if (!file) return;
    reader.readAsText(file);
  };

  const parseXML = (xmlText: string | ArrayBuffer) => {
    const parser = new xml2js.Parser({ explicitArray: false });
    parser.parseString(xmlText, (error, result) => {
      if (error) return console.error('Error al analizar XML:', error);
      console.log(result.Invoice);
      setInvoiceXml(result.Invoice);
    });
  };
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
  return (
    <div>
      <input type="file" accept=".xml" onChange={handleFileUpload} />
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {backgroundImage && invoiceXml && (
        <PDFDownloadLink
          document={
            <CustomizableInvoicePdf
              templateImg={backgroundImage}
              dataXml={invoiceXml}
            />
          }
          fileName={`template.pdf`}
          className="budgetsPage-filter-icon"
        >
          <figure className="budgetsPage-figure-icon">
            <img src={`/svg/index-icon.svg`} />
          </figure>
          Descargar
        </PDFDownloadLink>
      )}
      {backgroundImage && invoiceXml && (
        <PDFViewer width="100%" height={600}>
          <CustomizableInvoicePdf
            templateImg={backgroundImage}
            dataXml={invoiceXml}
          />
        </PDFViewer>
      )}
    </div>
  );
};

export default CustomizableInvoice;
