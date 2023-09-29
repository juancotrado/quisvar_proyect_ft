import { ListUserExtend, PdfDataProps, PdfGeneratorPick } from '../types/types';
import formatDate from './formatDate';
import { convertToDynamicObject } from './pdfReportFunctions';

interface transformDataPdfProps {
  listUsers?: ListUserExtend[];
  data: PdfGeneratorPick;
}
export const transformDataPdf = ({
  listUsers,
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
    (Array.isArray(listUsers) &&
      listUsers.filter(user => user.id === secondaryReceiver?.user.id)) ||
    undefined;
  const result: PdfDataProps = {
    from:
      userFrom?.user.profile.firstName + ' ' + userFrom?.user.profile.lastName,
    header: data.header,
    body: convertToDynamicObject(data.description ?? ''),
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
