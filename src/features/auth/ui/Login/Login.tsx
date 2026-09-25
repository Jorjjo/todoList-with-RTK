import { selectThemeMode } from '@/app/app-slice';
import { useAppSelector } from '@/common/hooks';
import { getTheme } from '@/common/theme';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    TextField,
} from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginInputs, loginSchema } from '../../model/login.shema';

export function Login() {
    const themeMode = useAppSelector(selectThemeMode);
    const theme = getTheme(themeMode);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<LoginInputs>({
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        resolver: zodResolver(loginSchema),
    });
    const fetchFormData: SubmitHandler<LoginInputs> = (data) => {
        console.log(data);
        reset();
    };
    return (
        <Grid container justifyContent={'center'}>
            <FormControl>
                <FormLabel>
                    <p>
                        To login get registered
                        <a
                            style={{
                                color: theme.palette.primary.main,
                                marginLeft: '5px',
                            }}
                            href='https://social-network.samuraijs.com'
                            target='_blank'
                            rel='noreferrer'
                        >
                            here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>
                        <b>Email:</b> free@samuraijs.com
                    </p>
                    <p>
                        <b>Password:</b> free
                    </p>
                </FormLabel>
                <form onSubmit={handleSubmit(fetchFormData)}>
                    <FormGroup>
                        <TextField
                            label='Email'
                            margin='normal'
                            helperText={errors?.email?.message}
                            error={!!errors.email}
                            {...register('email')}
                        />
                        <TextField
                            type='password'
                            label='Password'
                            margin='normal'
                            {...register('password')}
                        />

                        <FormControlLabel
                            label='Remember me'
                            control={
                                <Controller
                                    name={'rememberMe'}
                                    control={control}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <Checkbox
                                            onChange={(e) =>
                                                onChange(e.target.checked)
                                            }
                                            checked={value}
                                        />
                                    )}
                                />
                            }
                        />
                        <Button
                            type='submit'
                            variant='contained'
                            color='primary'
                        >
                            Login
                        </Button>
                    </FormGroup>
                </form>
            </FormControl>
        </Grid>
    );
}
