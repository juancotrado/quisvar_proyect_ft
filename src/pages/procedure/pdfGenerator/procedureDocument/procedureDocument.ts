import './procedureDocument.css';

interface ProcedureDocumentProps {
  title: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  body: string;
}

const procedureDocument = ({
  date,
  from,
  subject,
  title,
  to,
  body,
}: ProcedureDocumentProps) => {
  const data = [
    { textOne: 'Para', textTwo: to },
    { textOne: 'De', textTwo: from },
    { textOne: 'Asunto', textTwo: subject },
    { textOne: 'Fecha', textTwo: date },
  ];

  return `
  <div class="procedureDocument-main" >
    <p class="procedureDocument-title">${title}</p>
    ${data
      .map(
        ({ textOne, textTwo }) => `
            <div style="display: flex;margin-bottom: 10px"> 
              <span style=" width: 20%; font-weight: bold;">
                <strong>${textOne}</strong>
              </span>
              <span>
                <strong>:</strong> 
                ${textTwo}
              </span>
            </div>`
      )
      .join('')}    
    <hr />
    ${body}
    <div class="procedureDocument-sign">
      <div class="procedureDocument-sign-line"></div>
      <span>BAC. ADMIN 422 ADMIN</span>
      <span>DNI: 00000001</span>
    </div>
  </div>`;
};

export default procedureDocument;
