import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = false;

const listModAuthSlice = createSlice({
  name: 'isAuthorizedMod',
  initialState,
  reducers: {
    setModAuth: (_state, action: PayloadAction<boolean>) => action.payload,
  },
});

export const { setModAuth } = listModAuthSlice.actions;
export default listModAuthSlice.reducer;
