import { useEffect, useRef, useState } from 'react';
import { IconAction, Modal } from '..';
import './viewPdf.css';
import { Subscription } from 'rxjs';
import { isOpenViewPdf$ } from '../../services/sharingSubject';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { downloadBlob } from '../../utils';

let fileName = 'documento';

const ViewPdf = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pdfComponent, setPdfComponent] = useState<JSX.Element | null>(null);
  const handleIsOpen = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleIsOpen.current = isOpenViewPdf$.getSubject.subscribe(value => {
      const { isOpen, pdfComponentFunction, fileNamePdf } = value;
      setIsOpen(isOpen);
      setPdfComponent(pdfComponentFunction);
      fileName = fileNamePdf;
    });
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);

  const handleClose = () => setIsOpen(false);

  const handleDownloadPdf = async () => {
    if (!pdfComponent) return;
    const pdfDownload = await pdf(pdfComponent).toBlob();
    downloadBlob(pdfDownload, `${fileName}.pdf`);
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

        <div className="viewPdf-download">
          <IconAction
            icon="download-white"
            onClick={handleDownloadPdf}
            size={1.5}
            position="none"
          />
        </div>
        {pdfComponent && (
          <PDFViewer width="100%" height="100%">
            {pdfComponent}
          </PDFViewer>
        )}
      </div>
    </Modal>
  );
};

export default ViewPdf;
