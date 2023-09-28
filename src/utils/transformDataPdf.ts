import { ListUser, PdfDataProps, PdfGeneratorPick } from '../types/types';
import formatDate from './formatDate';
import { convertToObject, getTextParagraph } from './pdfReportFunctions';

interface transformDataPdfProps {
  listUsers?: ListUser[];
  data: PdfGeneratorPick;
}
export const transformDataPdf = ({
  listUsers,
  //   userTo,
  data,
}: transformDataPdfProps) => {
  const userTo = data.users?.find(
    user => user.type === 'RECEIVER' && user.role === 'MAIN'
  );
  const userFrom = data.users?.find(
    user => user.type === 'SENDER' && user.role === 'MAIN'
  );
  const secondaryReceiver = data.users?.find(user => user.role === 'SECONDARY');
  const cc =
    (listUsers &&
      listUsers.filter(user => user.id === secondaryReceiver?.user.id)) ||
    undefined;
  const result: PdfDataProps = {
    from:
      userFrom?.user.profile.firstName + ' ' + userFrom?.user.profile.lastName,
    header: data.header,
    body: getTextParagraph(data.description ?? ''),
    tables: convertToObject(data.description ?? ''),
    title: data.title,
    cc,
    to: userTo?.user.profile.firstName + ' ' + userTo?.user.profile.lastName,
    date: formatDate(new Date(data.createdAt), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour12: true,
    }),
    toDegree: userTo?.user.profile.degree,
    toPosition: userTo?.user.profile.description,
    dni: userFrom?.user.profile.dni,
    fromDegree: userFrom?.user.profile.degree,
    fromPosition: userFrom?.user.profile.description,
  };
  return result;
};
