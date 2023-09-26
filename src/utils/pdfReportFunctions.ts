import { ObjectBoard } from '../types/types';
import formatDate from './formatDate';

type Boards = ObjectBoard[];
export const convertToObject = (htmlString: string): Boards => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlString;

  const board: Boards = [];
  const tablasHTML = tempElement.querySelectorAll('table');

  tablasHTML.forEach(boardHTML => {
    const rowsHTML = boardHTML.querySelectorAll('tr');
    const headersHTML = rowsHTML[0].querySelectorAll('td');

    for (let i = 1; i < rowsHTML.length; i++) {
      const cellHTML = rowsHTML[i].querySelectorAll('td');
      const object: ObjectBoard = {};

      cellHTML.forEach((celda, index) => {
        const header = headersHTML[index];
        if (
          header &&
          typeof header.textContent === 'string' &&
          celda &&
          typeof celda.textContent === 'string'
        ) {
          const clave = header.textContent.trim();
          const value = celda.textContent.trim();
          if (clave && value) {
            object[clave] = value;
          }
        }
      });

      board.push(object);
    }
  });

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
