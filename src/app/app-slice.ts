import { createSlice } from '@reduxjs/toolkit';

export type ThemeMode = 'dark' | 'light';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        themeMode: 'dark' as ThemeMode,
    },
    reducers: (create) => ({
        changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>(
            (state, action) => {
                state.themeMode = action.payload.themeMode;
            },
        ),
    }),
    selectors: {
        selectThemeMode: (state) => state.themeMode,
    },
});
// action creator достается из appSlice.actions
export const { changeThemeModeAC } = appSlice.actions;
// reducer достается из appSlice.reducer
export const appReducer = appSlice.reducer;

export const { selectThemeMode } = appSlice.selectors;
