import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../../../../services/axiosInstance';
import {
  MailGeneralNumeration,
  MessageSender,
  PaginationTable,
  ReceptionMailNumeration,
} from '../../../../../types';
import { ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';

const getRegularMail = async (searchParams: URLSearchParams) => {
  const isReception = searchParams.get('type') === 'RECEPTION';
  if (isReception) {
    const { data } = await axiosInstance.get<ReceptionMailNumeration>(
      'mail/holding',
      {
        params: searchParams,
        headers: {
          noLoader: true,
        },
      }
    );
    const { mailList, total } = data;
    return { total, listMessage: mailList };
  } else {
    const { data } = await axiosInstance.get<MailGeneralNumeration>('mail', {
      params: searchParams,
      headers: {
        noLoader: true,
      },
    });
    const { mailList, total } = data;
    const transformMail = mailList.map(({ message }) => message);
    return { total, listMessage: transformMail };
  }
};

const useRegularMail = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    type: 'RECEIVER',
    limit: '20',
    page: '0',
  });

  const typeMail = searchParams.get('type') ?? '';
  const status = searchParams.get('status') ?? '';
  const typeMessage = searchParams.get('typeMessage') ?? '';
  const office = searchParams.get('office') ?? '';
  const onHolding = searchParams.get('onHolding') ?? '';

  const regularMailQuery = useQuery({
    queryKey: ['regularMail', searchParams.toString()],
    queryFn: () => getRegularMail(searchParams),
  });

  const handleSelectOption = (option: MessageSender) => {
    const keyParam = option === 'ARCHIVER' ? 'status' : 'type';
    const value = option === 'ARCHIVER' ? 'ARCHIVADO' : option;
    setSearchParams({
      limit: '20',
      page: '0',
      [keyParam]: value,
    });
  };
  const handleFilter = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = target;
    value ? searchParams.set(name, value) : searchParams.delete(name);
    setSearchParams(searchParams);
    if (typeMail === 'RECEPTION') return;
  };

  const getMessagesPagination = async ({
    pageIndex,
    pageSize,
  }: PaginationTable) => {
    searchParams.set('page', String(pageIndex));
    searchParams.set('limit', String(pageSize));
    setSearchParams(searchParams);
  };
  return {
    regularMailQuery,
    handleSelectOption,
    typeMail,
    getMessagesPagination,
    handleFilter,
    status,
    typeMessage,
    office,
    onHolding,
  };
};

export default useRegularMail;
