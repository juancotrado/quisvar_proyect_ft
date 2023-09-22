import { Profile } from '../../types/types';

export const InitialValueEditor = ({
  firstName,
  lastName,
}: Profile) => `<p style="text-align: justify;" >
Por medio del presente documento me dirijo a usted con la finalidad de hacerle llegar un cordial saludo,y al mismo tiempo comunicarle lo siguiente:
 </p><p>&nbsp;</p><p>&nbsp;</p>
 <p style="text-align: center;">Atentamente, ${lastName.toUpperCase()} ${firstName.toUpperCase()} </p>`;
