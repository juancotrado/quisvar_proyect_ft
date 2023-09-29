import formatDate from './formatDate';

type ParagraphElement = {
  type: 'paragraph';
  content: string;
};

type TableElement = {
  type: 'table';
  data: string[][];
};

type DynamicHTMLElement = ParagraphElement | TableElement;
export const convertToDynamicObject = (
  htmlString: string
): DynamicHTMLElement[] => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlString;

  const elements: DynamicHTMLElement[] = [];

  const childNodes = tempElement.childNodes;

  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.nodeName === 'P') {
        const content = (node.textContent || '').trim();
        if (content) {
          elements.push({ type: 'paragraph', content });
        }
      } else if (node.nodeName === 'TABLE') {
        const tableData: string[][] = [];
        const rows = (node as Element).querySelectorAll('tr');
        rows.forEach(row => {
          const rowData: string[] = [];
          row.querySelectorAll('td').forEach(cell => {
            rowData.push((cell.textContent || '').trim());
          });
          tableData.push(rowData);
        });
        elements.push({ type: 'table', data: tableData });
      }
    }
  }

  return elements;
};
export const dataInitialPdf = {
  from: '',
  to: '',
  header: '',
  body: [],
  date: formatDate(new Date(), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour12: true,
  }),
  dni: '',
  title: '',
  fromDegree: '',
  fromPosition: '',
  toDegree: '',
  toPosition: '',
};
