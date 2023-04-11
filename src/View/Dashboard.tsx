import {Box, Grid, Typography} from '@mui/material';
import router from 'next/router';
import {useAuth} from 'src/context/AuthContext';

export default function Dashboard() {
  const {currentUser} = useAuth();

  if (!currentUser) {
    router.push('/auth/login');
    return null;
  }

  const handelPage = (route: string) => {
    router.push(route);
  };

  return (
    <Grid
      container
      spacing={2}
      justifyContent={'center'}
      alignItems={'center'}
      flex={1}>
      {menuItems?.map((item, index) => (
        <Grid key={index} item lg={2} md={3} sm={4} xs={6}>
          <Box
            onClick={() => handelPage(item.href)}
            sx={{
              border: '1px solid #e2e2e1',
              borderRadius: 1,
              backgroundColor: '#cacaca',
              overflow: 'auto',
              minHeight: 100,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#000',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#000',
                borderColor: 'cyan',
                color: '#fff',
              },
            }}>
            <Typography variant="h3">{item.name}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

const menuItems = [
  {
    name: 'Todo',
    href: '/todos',
  },
  {
    name: 'Map',
    href: '/map',
  },
];
