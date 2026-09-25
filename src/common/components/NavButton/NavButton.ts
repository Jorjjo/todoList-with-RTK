import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

type Props = {
    background?: string;
};

export const NavButton = styled(Button)<Props>(() => ({
    fontWeight: 'bold',
    textTransform: 'capitalize',
    margin: '0 10px',
    padding: '6px 24px',
    minWidth: '100px',
    borderRadius: '4px',
}));
