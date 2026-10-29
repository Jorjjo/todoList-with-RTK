import { handleServerError } from '@/common/utils/handleServerError';
import { authApi } from '../api/authApi';
import { LoginInputs } from './login.shema';
import { createAppSlice } from '@/common/utils';
import { handleResultCodeError } from '@/common/utils/handleResultCodeError';
import { ResultCode } from '@/common/enums/enums';
import { setStatusAC } from '@/app/app-slice';
import { AUTH_TOKEN } from '@/common/constants';

export const authSlice = createAppSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    reducers: (create) => ({
        loginTC: create.asyncThunk(
            async (args: LoginInputs, { rejectWithValue, dispatch }) => {
                try {
                    dispatch(setStatusAC({ status: 'loading' }));
                    const res = await authApi.login(args);

                    if (res.data.resultCode !== ResultCode.Success) {
                        handleResultCodeError(dispatch, res.data);
                        return rejectWithValue(null);
                    }
                    dispatch(setStatusAC({ status: 'succeeded' }));
                    const token = res.data.data.token;
                    localStorage.setItem(AUTH_TOKEN, token);
                    return { isLoggedIn: true };
                } catch (error) {
                    handleServerError(dispatch, error);
                    return rejectWithValue(null);
                }
            },
            {
                fulfilled: (state, action) => {
                    state.isLoggedIn = action.payload.isLoggedIn;
                },
            },
        ),
        logoutTC: create.asyncThunk(
            async (_args, { rejectWithValue, dispatch }) => {
                try {
                    dispatch(setStatusAC({ status: 'loading' }));
                    const res = await authApi.logout();

                    if (res.data.resultCode !== ResultCode.Success) {
                        handleResultCodeError(dispatch, res.data);
                        return rejectWithValue(null);
                    }
                    dispatch(setStatusAC({ status: 'succeeded' }));

                    localStorage.removeItem(AUTH_TOKEN);
                    return { isLoggedIn: false };
                } catch (error) {
                    handleServerError(dispatch, error);
                    return rejectWithValue(null);
                }
            },
            {
                fulfilled: (state, action) => {
                    state.isLoggedIn = action.payload.isLoggedIn;
                },
            },
        ),
    }),
    selectors: {
        selectAuth: (state) => state.isLoggedIn,
    },
});

export const { loginTC, logoutTC } = authSlice.actions;
export const { selectAuth } = authSlice.selectors;
export const authReducer = authSlice.reducer;
