import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../../services/axiosInstance';
import { Companies, CompaniesSelect } from '../../../types';

const getCompanies = async () => {
  const res = await axiosInstance.get<Companies[]>(`/companies`, {
    headers: {
      noLoader: true,
    },
  });

  const companiesSelect: CompaniesSelect[] = res.data.map(company => ({
    ...company,
    value: String(company.id),
    label: company.name,
  }));
  return companiesSelect;
};

const useCompanySelect = () => {
  const companySelectQuery = useQuery({
    queryKey: ['companySelect'],
    queryFn: getCompanies,
  });
  return companySelectQuery;
};

export default useCompanySelect;
