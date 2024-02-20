import { useEffect, useRef, useState } from 'react';
import { IconAction, Modal } from '..';
import './viewHtmlToPdf.css';
import { Subscription } from 'rxjs';
import { isOpenViewHtmlToPdf$ } from '../../services/sharingSubject';
import html2pdf from 'html2pdf.js';

let fileName = 'documento';

const ViewHtmlToPdf = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const [pdfComponent, setPdfComponent] = useState<JSX.Element | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleIsOpen = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleIsOpen.current = isOpenViewHtmlToPdf$.getSubject.subscribe(value => {
      const { isOpen, htmlString, fileNamePdf } = value;
      setIsOpen(isOpen);
      const options = {
        margin: [14, 22, 14, 22],
        filename: 'time_sheet_report.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        useCORS: true,
        jsPDF: { format: 'a4', orientation: 'p' },
      };

      html2pdf()
        .set(options)
        .from(htmlString)
        .toPdf()
        .get('pdf')
        .then((pdf: any) => {
          setPdfUrl(pdf.output('datauristring'));
        });
      fileName = fileNamePdf;
    });
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);

  const handleClose = () => setIsOpen(false);

  const handleDownloadPdf = async () => {
    // if (!pdfComponent) return;
    // const pdfDownload = await pdf(pdfComponent).toBlob();
    // downloadBlob(pdfDownload, `${fileName}.pdf`);
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
