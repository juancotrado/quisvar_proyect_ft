import { useEffect, useRef, useState } from 'react';
import { IconAction, Modal } from '..';
import './viewHtmlToPdf.css';
import { Subscription } from 'rxjs';
import { isOpenViewHtmlToPdf$ } from '../../services/sharingSubject';
import { useHtmlToPdf } from '../../hooks';
import { downloadHref } from '../../utils';

let fileName = 'documento';

const ViewHtmlToPdf = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getPdfToEmbed, pdfUrl } = useHtmlToPdf();
  const handleIsOpen = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleIsOpen.current = isOpenViewHtmlToPdf$.getSubject.subscribe(value => {
      const { isOpen, htmlString, fileNamePdf, size } = value;
      setIsOpen(isOpen);
      getPdfToEmbed(htmlString, size, fileNamePdf);
      fileName = fileNamePdf;
    });
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);

  const handleClose = () => setIsOpen(false);

  const handleDownloadPdf = async () => {
    if (!pdfUrl) return;
    downloadHref(pdfUrl, fileName);
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

export default ViewHtmlToPdf;
