import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../../../../../../services/axiosInstance';
import { Specialists } from '../../../../../../../types';
import { ContractSpecialties } from '../../../models/type.contracts';
import { SnackbarUtilities, sleep } from '../../../../../../../utils';

interface SpecialistsExtends extends Specialists {
  contractSpecialtiesId: number;
  contratcId: number;
}

const addSpecialists = async (data: SpecialistsExtends) => {
  const { contractSpecialtiesId, id } = data;
  const body = {
    contractSpecialtiesId,
    specialistsId: id,
  };
  const res = await axiosInstance.put('/contract/specialties', body, {
    headers: {
      noLoader: true,
    },
  });
  return res.data;
};

const useAddSpecialistsMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addSpecialists,
    onMutate: data => {
      console.log('DSatada', data);
      const { contratcId, contractSpecialtiesId, ...resData } = data;

      queryClient.setQueryData<ContractSpecialties[]>(
        ['listProfessional', contratcId],
        oldData => {
          if (oldData) {
            const newData = oldData.map(el =>
              el.id === contractSpecialtiesId
                ? { ...el, specialists: resData }
                : el
            );

            console.log('newData', newData);
            return newData;
          }
        }
      );
      return data;
    },

    // onSuccess: (product, variables, context) => {
    //   console.log({ product, variables, context });

    //   const { contratcId, contractSpecialtiesId, ...resData } = context;

    //   // queryClient.invalidateQueries(
    //   //   ['products',{ filterKey: data.category }]
    //   // );
    //   // queryClient.removeQueries(['product', context?.optimisticProduct.id]);

    //   queryClient.setQueryData<ContractSpecialties[]>(
    //     ['listProfessional', contratcId],
    //     old => {
    //       if (!old) return [product];

    //       return old.map(cacheProduct => {
    //         return cacheProduct.id === context?.optimisticProduct.id
    //           ? product
    //           : cacheProduct;
    //       });
    //     }
    //   );
    // },

    onError: (_error, variables, _context) => {
      const { contratcId, contractSpecialtiesId } = variables;
      queryClient.setQueryData(
        ['listProfessional', contratcId],
        (oldData: ContractSpecialties[]) => {
          if (oldData) {
            const newData = oldData.map(el =>
              el.id === contractSpecialtiesId
                ? { ...el, specialists: null }
                : el
            );
            return newData;
          }
        }
      );
      SnackbarUtilities.error('Error al agregar especialista');
    },
  });
  return mutation;
};

export default useAddSpecialistsMutation;
