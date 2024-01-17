import { formatDate } from '.';
import { JOB_DATA } from '../pages/UserList/models';
import { PdfDataProps, PdfGeneratorPick } from '../types';
import { convertToDynamicObject } from './pdfReportFunctions';

interface transformDataPdfProps {
  data: PdfGeneratorPick;
}
export const transformDataPdf = ({ data }: transformDataPdfProps) => {
  const userTo = data.users?.find(
    user => user.type === 'RECEIVER' && user.role === 'MAIN'
  );
  console.log(userTo);
  const userFrom = data.users?.find(
    user => user.type === 'SENDER' && user.role === 'MAIN'
  );
  const filterJob = (value?: string, job?: string) => {
    console.log(value, job);
    if (value !== 'Titulado') return value;
    return JOB_DATA.filter(item => item.value === job)[0]?.abrv;
  };
  const cc = data.users
    ?.filter(user => user.role === 'SECONDARY')
    .map(item => {
      return {
        name: `${item.user.profile.firstName} ${item.user.profile.lastName}`,
        degree: filterJob(
          item.user.profile.degree,
          item.user.profile.job
        ) as string,
        position: item.user.profile.description || '',
      };
    });
  // console.log({data: secondaryReceiver});
  // const cc =
  //   (Array.isArray(listUsers) &&
  //     listUsers.filter(user => user.id === secondaryReceiver?.)) ||
  //   undefined;
  // console.log(cc)

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
    toDegree: filterJob(userTo?.user.profile.degree, userTo?.user.profile.job),
    toPosition: userTo?.user.profile.description,
    dni: userFrom?.user.profile.dni,
    fromDegree: filterJob(
      userFrom?.user.profile.degree,
      userFrom?.user.profile.job
    ),
    fromPosition: userFrom?.user.profile.description,
  };
  return result;
};
