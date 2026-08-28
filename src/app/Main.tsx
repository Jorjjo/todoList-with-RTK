import { useAppDispatch } from '@/common/hooks';
import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm';
import { Todolists } from '@/features/todolists/ui/Todolists/Todolists';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import { Stack, SxProps, Typography } from '@mui/material';
import { createTodolistAC } from '@/features/todolists/model/todolists-slice';

export const Main = () => {
    const dispatch = useAppDispatch();

    const createTodolist = (title: string) => {
        dispatch(createTodolistAC(title));
    };

    return (
        <Container maxWidth={'lg'}>
            <Stack spacing={3} sx={stackSx}>
                <Typography color='primary' variant='h4' component='h2'>
                    Create new To-do List
                </Typography>
                <CreateItemForm onCreateItem={createTodolist} />
            </Stack>
            <Grid
                container
                spacing={4}
                sx={{
                    justifyContent: 'space-evenly',
                }}
            >
                <Todolists />
            </Grid>
        </Container>
    );
};

export const stackSx: SxProps = {
    mb: '40px',
    border: '1px, solid #3f51b5',
    borderRadius: '6px',
    p: '24px',
};
