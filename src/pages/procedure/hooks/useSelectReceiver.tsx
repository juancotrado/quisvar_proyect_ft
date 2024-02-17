import { useState } from 'react';
import { MailTypeProcedure } from '../models';

const useSelectReceiver = () => {
  const [typeMail, setTypeMail] = useState<MailTypeProcedure>('RECEIVER');
  const handleSelectReceiver = (type: MailTypeProcedure) => setTypeMail(type);
  const optionsMailHeader = [
    {
      id: 1,
      iconOn: 'inbox',
      iconOff: 'inbox-black',
      text: 'RECIBIDOS',
      isActive: typeMail === 'RECEIVER',
      funcion: () => handleSelectReceiver('RECEIVER'),
    },
    {
      id: 2,
      iconOn: 'tabler',
      iconOff: 'tabler-black',
      text: 'ENVIADOS',
      isActive: typeMail === 'SENDER',
      funcion: () => handleSelectReceiver('SENDER'),
    },
    {
      id: 3,
      iconOn: 'archiver-box',
      iconOff: 'archiver-box-black',
      text: 'ARCHIVADOS',
      isActive: typeMail === 'ARCHIVER',
      funcion: () => handleSelectReceiver('ARCHIVER'),
    },
  ];

  return { typeMail, optionsMailHeader };
};

export default useSelectReceiver;
