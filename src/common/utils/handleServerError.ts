import { setErrorAC, setStatusAC } from '@/app/app-slice';
import { Dispatch } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import z from 'zod';

export function handleServerError(dispatch: Dispatch, error: unknown) {
    let errorMessage;
    switch (true) {
        case isAxiosError(error):
            errorMessage = error.response?.data?.message || error.message;
            break;
        case error instanceof Error:
            errorMessage = `Native error: ${error.message}`;
            break;
        case error instanceof z.ZodError:
            console.log(error.issues);
            errorMessage = 'Zod error';
            break;

        default:
            errorMessage = JSON.stringify(error);
            break;
    }

    dispatch(setErrorAC({ error: errorMessage }));
    dispatch(setStatusAC({ status: 'failed' }));
}
