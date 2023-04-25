import React from 'react';
import {Box, Stack, Typography} from '@mui/material';
import {TOP_NAV_HEIGHT} from './Layout';
import UserInfo from '../User';
import HomeIcon from '@mui/icons-material/Home';
import {useRouter} from 'next/router';

export const Header: React.FC = () => {
  const router = useRouter();
  const handleHome = () => {
    router.replace('/dashboard');
  };
  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      sx={{
        height: TOP_NAV_HEIGHT,
      }}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        onClick={handleHome}
        sx={{
          padding: '0 16px 0 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'primary.main',
          },
        }}>
        <HomeIcon />
        <Typography variant="h6">ZNHK</Typography>
      </Stack>
      <UserInfo />
    </Box>
  );
};
