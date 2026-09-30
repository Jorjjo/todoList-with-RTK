import { Box, Button } from '@mui/material';
import styles from './PageNotFound.module.css';
import { Link } from 'react-router';
import { PATH } from '../Routing/Routing';

export const PageNotFound = () => (
    <Box className = {styles.notFound}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>page not found</h2>
        <Button component={Link} to={PATH.Main} variant='contained' size='large'>
            Return to main page
        </Button>
    </Box>
);
