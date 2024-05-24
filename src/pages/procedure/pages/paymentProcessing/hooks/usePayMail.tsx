import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../../../../services/axiosInstance';
import {
  MessageSender,
  PaginationTable,
  PayMailNumeration,
  ReceptionMailNumeration,
} from '../../../../../types';
import { useSearchParams } from 'react-router-dom';
import { ChangeEvent } from 'react';

const getPayMail = async (searchParams: URLSearchParams) => {
  const isReception = searchParams.get('type') === 'RECEPTION';
  if (isReception) {
    const { data } = await axiosInstance.get<ReceptionMailNumeration>(
      'paymail/holding',
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
    const { data } = await axiosInstance.get<PayMailNumeration>('payMail', {
      params: searchParams,
      headers: {
        noLoader: true,
      },
    });
    const { mailList, total } = data;
    const transformMail = mailList.map(({ paymessage }) => paymessage);
    return { total, listMessage: transformMail };
  }
};

const usePayMail = () => {
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

  const payMailQuery = useQuery({
    queryKey: ['payMail', searchParams.toString()],
    queryFn: () => getPayMail(searchParams),
  });

  const handleSelectOption = (option: MessageSender) => {
    const keyParam = option === 'ARCHIVER' ? 'status' : 'type';
    const value = option === 'ARCHIVER' ? 'ARCHIVADO' : option;
    const params = {
      limit: '20',
      page: '0',
      [keyParam]: value,
    };
    if (option === 'RECEPTION') params.onHolding = 'true';
    setSearchParams(params);
  };
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
    payMailQuery,
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

export default usePayMail;
