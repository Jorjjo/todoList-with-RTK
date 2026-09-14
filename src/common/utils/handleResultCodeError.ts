import { setErrorAC, setStatusAC } from '@/app/app-slice';
import { Dispatch } from '@reduxjs/toolkit';
import { BaseResponse } from '../types';

export function handleResultCodeError<T>(
    dispatch: Dispatch,
    data: BaseResponse<T>,
) {
    dispatch(
        setErrorAC({
            error: data.messages.length
                ? data.messages[0]
                : 'Error has occurred',
        }),
    );
    dispatch(setStatusAC({ status: 'failed' }));
}
