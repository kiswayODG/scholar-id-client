import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Copyright(props: any) {
    return (
        <>
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Tout droit reservé - Propriété intellectuelle ©  '}
        <Link color="inherit" href="https://mui.com/">
          +226 64058021/51852064
        </Link>{' '}
       
        {'.'}
      </Typography>
      </>
    );
  }