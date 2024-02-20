import { Profile } from '../../../../types';
import { degreeAbrv, formatDateShortSpanish } from '../../../../utils';
import { ToData } from '../../models';
import './procedureDocument.css';

interface ProcedureDocumentProps {
  title: string;
  ccProfiles: ToData[];
  subject: string;
  body: string;
  fromProfile: Profile;
  toProfile: ToData;
  size: 'a4' | 'a5';
}

const procedureDocument = ({
  subject,
  title,
  body,
  fromProfile,
  toProfile,
  size,
  ccProfiles,
}: ProcedureDocumentProps) => {
  const from = `${degreeAbrv(fromProfile.degree)}. ${
    fromProfile.firstName + ' ' + fromProfile.lastName
  }`;
  const to = `${degreeAbrv(toProfile.degree)}. ${toProfile.name}`;
  const data = [
    { textOne: 'Para', textTwo: to },
    { textOne: 'De', textTwo: from },
    { textOne: 'Asunto', textTwo: subject },
    { textOne: 'Fecha', textTwo: formatDateShortSpanish() },
  ];

  return `
  <div class="procedureDocument-main procedureDocument-${size}" >
    <p class="procedureDocument-title">${title}</p>
    <div class="procedureDocument-title-header-main">
      ${data
        .map(
          ({ textOne, textTwo }) => `
          <div class="procedureDocument-title-header-content"> 
            <span class="procedureDocument-header-text-title">
              ${textOne}
            </span>
            <span class="procedureDocument-font-normal">
              <strong>:</strong> 
              ${textTwo}
            </span>
          </div>
          ${
            textOne === 'De' && ccProfiles.length > 0
              ? `
            <div class="procedureDocument-title-header-content"> 
              <span class="procedureDocument-header-text-title">
              CC
              </span>
              <div class="procedureDocument-cc-container">
                ${ccProfiles
                  .map(
                    ({ degree, name, position }) =>
                      `
                  <span class="procedureDocument-cc-text">
                    <strong>:</strong> 
                    <div class="procedureDocument-cc-container">
                      <span>${`${degreeAbrv(degree)}. ${name}`}</span>
                      <span>${position}</span>
                    </div>
                    
                  </span>
                  `
                  )
                  .join('')}
                </div>
            </div> `
              : ''
          }
          
          `
        )
        .join('')}    
    </div>
    <div class="line"></div>
    <div class="procedureDocument-font-normal">${body}</div>      
    <div class="procedureDocument-sign">
      <div class="procedureDocument-sign-line"></div>
      <span>${from}</span>
      <span>DNI: ${fromProfile.dni}</span>
    </div>
  </div>`;
};

export default procedureDocument;
