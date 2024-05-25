import { useSearchParams } from 'react-router-dom';
import { axiosInstance } from '../../../../../services/axiosInstance';
import { MailGeneralNumeration, PaginationTable } from '../../../../../types';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent } from 'react';

const getComunicationMail = async (searchParams: URLSearchParams) => {
  const { data } = await axiosInstance.get<MailGeneralNumeration>('mail', {
    params: searchParams,
    headers: {
      noLoader: true,
    },
  });
  const { mailList, total } = data;
  const transformMail = mailList.map(({ message }) => message);
  return { total, listMessage: transformMail };
};

const useComunication = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    limit: '20',
    page: '0',
    category: 'GLOBAL',
  });
  const typeMessage = searchParams.get('typeMessage') ?? '';

  const comunicationQuery = useQuery({
    queryKey: ['comunication', searchParams.toString()],
    queryFn: () => getComunicationMail(searchParams),
  });

  const handleFilter = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = target;
    value ? searchParams.set(name, value) : searchParams.delete(name);
    setSearchParams(searchParams);
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
    comunicationQuery,
    getMessagesPagination,
    handleFilter,
    typeMessage,
  };
};

export default useComunication;
