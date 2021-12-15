import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CounterState {
  loggingIn: boolean;
  token: string | null;
}

const initialState: CounterState = {
  loggingIn: false,
  token: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggingIn: (state) => {
      state.loggingIn = true;
    },
    userLoggedIn: (state, action: PayloadAction<{ token: string }>) => {
      state.loggingIn = false;
      state.token = action.payload.token;
    },
  },
});

export const { userLoggingIn, userLoggedIn } = userSlice.actions;

export default userSlice.reducer;
