import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Contract, Stage } from '../../types/types';
import { AppDispatch } from '..';
import { axiosInstance } from '../../services/axiosInstance';

type ContractType = Contract | null;
const initialState = null as ContractType;

const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setContract: (_state, action: PayloadAction<ContractType>) =>
      action.payload,
  },
});

export const { setContract } = contractSlice.actions;
export default contractSlice.reducer;

export const getContractThunks =
  (contractId: string) => (dispatch: AppDispatch) => {
    axiosInstance
      .get(`/contract/${contractId}`)
      .then(res => dispatch(setContract(res.data)))
      .catch(() => dispatch(setContract(initialState)));
  };
