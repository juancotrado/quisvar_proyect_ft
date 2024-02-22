import { useEffect, useRef, useState } from 'react';
import { IconAction, Modal } from '..';
import './viewHtmlToPdf.css';
import { Subscription } from 'rxjs';
import { isOpenViewHtmlToPdf$ } from '../../services/sharingSubject';
import { useHtmlToPdf } from '../../hooks';

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

  // const handleDownloadPdf = async () => {
  //   // if (!pdfComponent) return;
  //   // const pdfDownload = await pdf(pdfComponent).toBlob();
  //   // downloadBlob(pdfDownload, `${fileName}.pdf`);
  // };
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

        {/* <div className="viewPdf-download">
          <IconAction
            icon="download-white"
            onClick={handleDownloadPdf}
            size={1.5}
            position="none"
          />
        </div> */}
        {pdfUrl && (
          <embed
            src={pdfUrl}
            type="application/pdf"
            width="100%"
            height="100%"
            // download="nombre_que_quieras.pdf"
          />
        )}
      </div>
    </Modal>
  );
};

export default ViewHtmlToPdf;
