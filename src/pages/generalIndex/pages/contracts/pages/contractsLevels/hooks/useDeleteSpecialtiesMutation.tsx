// import React from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../../../../../../services/axiosInstance';
import { ContractSpecialties } from '../../../models/type.contracts';
import { SnackbarUtilities } from '../../../../../../../utils';

const deleteSpecialties = async (data: {
  contractSpecialtiesId: number;
  contratcId: number;
}) => {
  const res = await axiosInstance.delete(
    `/contract/specialties/${data.contractSpecialtiesId}`,
    {
      headers: {
        noLoader: true,
      },
    }
  );
  return res.data;
};

const useDeleteSpecialtiesMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteSpecialties,
    onMutate: data => {
      const { contractSpecialtiesId, contratcId } = data;
      queryClient.setQueryData<ContractSpecialties[]>(
        ['listProfessional', contratcId],
        oldData => {
          if (oldData) {
            const newData = oldData.filter(
              el => el.id !== contractSpecialtiesId
            );
            return newData;
          }
        }
      );
      const prevData = queryClient.getQueryData<ContractSpecialties[]>([
        'listProfessional',
        contratcId,
      ]);
      return { prevData };
    },

    onError: (_error, variables, context) => {
      const { contratcId } = variables;
      queryClient.setQueryData(
        ['listProfessional', contratcId],
        context?.prevData
      );
      SnackbarUtilities.error('Error al agregar especialidad');
    },
    // onSettled: (_data, _error, variables) => {
    //   queryClient.invalidateQueries({
    //     queryKey: ['listProfessional', variables.contratcId],
    //   });
    // },
  });
  return mutation;
};

export default useDeleteSpecialtiesMutation;
