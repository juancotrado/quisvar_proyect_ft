import { useEffect, useRef, useState } from 'react';
import { IconAction, Modal } from '..';
import './viewPdf.css';
import { Subscription } from 'rxjs';
import { isOpenViewPdf$ } from '../../services/sharingSubject';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { downloadBlob, downloadHref } from '../../utils';

let fileName = 'documento';

const ViewPdf = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pdfComponent, setPdfComponent] = useState<JSX.Element | null>(null);
  const handleIsOpen = useRef<Subscription>(new Subscription());
  const [pdfUrlBlob, setPdfUrlBlob] = useState<null | string>(null);
  const [pdfUrl, setPdfUrl] = useState<null | string>(null);

  useEffect(() => {
    handleIsOpen.current = isOpenViewPdf$.getSubject.subscribe(value => {
      const { isOpen, pdfComponentFunction, fileNamePdf, pdfBlob, pdfUrl } =
        value;
      setIsOpen(isOpen);
      if (pdfComponentFunction) {
        setPdfComponent(pdfComponentFunction);
        setPdfUrlBlob(null);
        setPdfUrl(null);
      }
      if (pdfBlob) {
        const editedUrl = URL.createObjectURL(pdfBlob);
        setPdfUrlBlob(editedUrl);
        setPdfComponent(null);
        setPdfUrl;
        setTimeout(() => {
          URL.revokeObjectURL(editedUrl);
        }, 60000);
      }
      if (pdfUrl) {
        setPdfUrl(pdfUrl);
        setPdfComponent(null);
        setPdfUrlBlob(null);
      }
      fileName = fileNamePdf;
    });
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);

  const handleClose = () => setIsOpen(false);

  const handleDownloadPdf = async () => {
    if (pdfComponent) {
      const pdfDownload = await pdf(pdfComponent).toBlob();
      downloadBlob(pdfDownload, `${fileName}.pdf`);
    }
    if (pdfUrlBlob) downloadHref(pdfUrlBlob, fileName);
    if (pdfUrl) {
      fetch(pdfUrl)
        .then(response => response.blob())
        .then(blob => {
          const blobURL = URL.createObjectURL(blob);
          downloadHref(blobURL, fileName);
        });
    }
  };
  return (
    <Modal isOpenProp={isOpen} size={60}>
      <div className="viewPdf">
        <IconAction
          icon="close-white"
          top={0.188}
          right={0.3}
          onClick={handleClose}
          size={0.8}
        />
        <div className="viewPdf-download-link" onClick={handleDownloadPdf}>
          Descargar documento
        </div>
        {pdfComponent && (
          <PDFViewer width="100%" height="100%">
            {pdfComponent}
          </PDFViewer>
        )}
        {pdfUrlBlob && (
          <embed
            src={pdfUrlBlob}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        )}
        {pdfUrl && (
          <object
            data={pdfUrl}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        )}
      </div>
    </Modal>
  );
};

export default ViewPdf;
