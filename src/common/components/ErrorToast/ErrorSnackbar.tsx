import { selectError, setErrorAC } from '@/app/app-slice';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import Alert from '@mui/material/Alert';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { type SyntheticEvent } from 'react';

export function ErrorSnackbar() {
    const error = useAppSelector(selectError);
    const dispatch = useAppDispatch();

    const handleClose = (
        _event?: SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setErrorAC({ error: null }));
    };

    return (
        <Snackbar
            open={error !== null}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <Alert
                onClose={handleClose}
                severity='error'
                variant='filled'
                sx={{ width: '100%' }}
            >
                {error}
            </Alert>
        </Snackbar>
    );
}
