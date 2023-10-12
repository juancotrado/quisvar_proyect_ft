import { PDFDownloadLink } from '@react-pdf/renderer';
import { generatePDF } from './template/pdfTemplates';
import { PdfDataProps } from '../../../types/types';
import Button from '../button/Button';

interface GenerateDownloadPdfProps {
  data: PdfDataProps;
  size: 'A4' | 'A5';
}

const GenerateDownloadPdf = ({ data, size }: GenerateDownloadPdfProps) => {
  return (
    <div className="pdf-btn-area-view">
      <PDFDownloadLink
        document={generatePDF(data, size)}
        fileName={`${data.title}.pdf`}
        className="pdf-btn-view-white"
      >
        {/* {({ loading }) => } */}
        <Button text={size} type="button" icon="/svg/file-download.svg" />
      </PDFDownloadLink>
    </div>
  );
};

export default GenerateDownloadPdf;

{
  /* <>
              <img
                className="chip-file-icon-doc normal"
                src={`/svg/file-download.svg`}
              />
              <img
                className="chip-file-icon-doc hover"
                src={`/svg/file-download-white.svg`}
              />
            </>

            <span className="download-text">{loading ? 'A5' : 'A5'}</span>
          </> */
}
