import { useState } from 'react';
import html2pdf from 'html2pdf.js';

const useHtmlToPdf = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const getPdfToEmbed = (
    htmlString: string,
    size: 'a4' | 'a5',
    name: string = 'document'
  ) => {
    const options = {
      margin: [14, 22, 14, 22],
      filename: name,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      useCORS: true,
      jsPDF: { format: size, orientation: 'p' },
    };

    html2pdf()
      .set(options)
      .from(htmlString)
      .toPdf()
      .get('pdf')
      .then((pdf: any) => {
        setPdfUrl(pdf.output('datauristring'));
      });
  };

  return { getPdfToEmbed, pdfUrl };
};

export default useHtmlToPdf;
