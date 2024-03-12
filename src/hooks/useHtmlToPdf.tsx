import { useState } from 'react';
import html2pdf from 'html2pdf.js';
import docImg from '/img/plantillaDocs.png';

const useHtmlToPdf = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const getPdfToEmbed = (
    htmlString: string,
    size: 'a4' | 'a5',
    name: string = 'document'
  ) => {
    const options = {
      margin: [20, 22, 14, 22],
      filename: name,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      useCORS: true,
      pagebreak: { mode: 'avoid-all' },
      jsPDF: { format: size, orientation: 'p', putTotalPages: true },
    };

    html2pdf()
      .set(options)
      .from(htmlString)
      .toPdf()
      .get('pdf')
      .then(async (pdf: any) => {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          // pdf.setPage(i);
          // pdf.setFontSize(10);
          // pdf.setTextColor(150);
          // pdf.text(
          //   'Page ' + i + ' of ' + totalPages,
          //   pdf.internal.pageSize.getWidth() / 2,
          //   pdf.internal.pageSize.getHeight() / 2
          // );
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          pdf.addImage(docImg, 'PNG', 0, 0, pageWidth, pageHeight, '', 'FAST');
        }
        const blob = await pdf.output('blob');
        const pdfUrl = URL.createObjectURL(blob);
        setPdfUrl(pdfUrl);

        setTimeout(() => {
          URL.revokeObjectURL(pdfUrl);
        }, 60000);
      });
  };

  return { getPdfToEmbed, pdfUrl };
};

export default useHtmlToPdf;
