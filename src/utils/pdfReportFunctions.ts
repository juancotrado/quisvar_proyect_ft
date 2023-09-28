import formatDate from './formatDate';

// type Boards = ObjectBoard[];
type Boards = (string | undefined)[][];

export const convertToObject = (htmlString: string): Boards => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlString;

  const tablasHTML = tempElement.querySelectorAll('table');
  const board: Boards = [];

  tablasHTML.forEach(boardHTML => {
    const rowsHTML = boardHTML.querySelectorAll('tr');
    const headersHTML = rowsHTML[0].querySelectorAll('td');
    const headers = Array.from(headersHTML).map(headerHTML =>
      headerHTML.textContent?.trim()
    );

    const rowData: (string | undefined)[] = [];
    rowsHTML.forEach((rowHTML, rowIndex) => {
      if (rowIndex === 0) {
        return;
      }

      const cellsHTML = rowHTML.querySelectorAll('td');
      const rowValues = Array.from(cellsHTML).map(cellHTML =>
        cellHTML.textContent?.trim()
      );

      rowData.push(...rowValues);
    });

    board.push(headers, rowData);
  });

  // console.log(board);

  return board;
};

export const getTextParagraph = (htmlString: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const parrafos = doc.querySelectorAll('p');

  if (parrafos.length > 0) {
    const textosDeParrafos = Array.from(parrafos).map(
      parrafo => parrafo.textContent
    );
    const contenidoConcatenado = textosDeParrafos.join('\n');
    return contenidoConcatenado;
  } else {
    return '';
  }
};
export const dataInitialPdf = {
  from: '',
  to: '',
  header: '',
  body: '',
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
