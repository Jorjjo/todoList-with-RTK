import { GlobalError, RequestStatus } from '@/common/types';
import { createSlice } from '@reduxjs/toolkit';

export type ThemeMode = 'dark' | 'light';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        themeMode: 'dark' as ThemeMode,
        status: 'idle' as RequestStatus,
        error: null as GlobalError,
    },
    reducers: (create) => ({
        changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>(
            (state, action) => {
                state.themeMode = action.payload.themeMode;
            },
        ),
        setStatusAC: create.reducer<{ status: RequestStatus }>(
            (state, action) => {
                state.status = action.payload.status;
            },
        ),
        setErrorAC: create.reducer<{ error: GlobalError }>(
            (state, action) => {
                state.error = action.payload.error;
            },
        ),
    }),
    selectors: {
        selectThemeMode: (state) => state.themeMode,
        selectStatus: (state) => state.status,
        selectError: (state) => state.error,
    },
});
// action creator достается из appSlice.actions
export const { changeThemeModeAC, setStatusAC, setErrorAC } = appSlice.actions;
// reducer достается из appSlice.reducer
export const appReducer = appSlice.reducer;

export const { selectThemeMode, selectStatus, selectError } = appSlice.selectors;
