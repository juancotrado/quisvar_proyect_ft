import { axiosInstance } from '../../../../../services/axiosInstance';
import { downloadBlob } from '../../../../../utils';
import { TypeArchiver, TypeLevel } from './types';

export const handleMergePdf = async (
  type: TypeLevel,
  id: number,
  name: string
) => {
  const url = type == 'stage' ? '/merge-pdf-stage/' : '/merge-pdf-levels/';
  const res = await axiosInstance.get('/download' + url + id, {
    responseType: 'blob',
  });
  const filename = name + '.pdf';
  downloadBlob(res.data, filename);
};
export const handleCompressPdf = async (
  type_d: TypeArchiver,
  type: TypeLevel,
  id: number,
  name: string
) => {
  const url = type == 'stage' ? '/stage-compress-pdfs/' : '/compress-pdfs/';
  const res = await axiosInstance.get(
    '/download' + url + id + '?type=' + type_d,
    {
      responseType: 'blob',
    }
  );
  const filename = name + '.rar';
  downloadBlob(res.data, filename);
};

export const handleArchiver = async (
  type: TypeArchiver,
  id: number,
  name: string,
  typeLevel: TypeLevel
) => {
  const query = {
    includeFiles: 'true',
    createFiles: 'true',
    endsWith: '',
    equal: '',
  };

  if (type !== 'all') query['endsWith'] = '.pdf';
  if (type === 'pdf') query['equal'] = 'true';
  if (type === 'nopdf') query['equal'] = 'false';

  const params = new URLSearchParams(query);
  const res = await axiosInstance.get(`/download/basic-${typeLevel}/${id}`, {
    params,
    responseType: 'blob',
  });
  const filename = name + '.zip';
  downloadBlob(res.data, filename);
};

export const handleMergePdfs = async (
  typeLevel: TypeLevel,
  id: number,
  name: string
) => {
  const query = {
    createFiles: 'true',
    type: 'UPLOADS',
    createCover: 'false',
  };
  const params = new URLSearchParams(query);
  const res = await axiosInstance.get(
    `/download/merge-basic-${typeLevel}/${id}`,
    {
      params,
      responseType: 'blob',
    }
  );
  const filename = name + '.pdf';
  downloadBlob(res.data, filename);
};
