import React from 'react';
import {Box, Typography} from '@mui/material';
import {TOP_NAV_HEIGHT} from './Layout';
import UserInfo from '../User';

export const Header: React.FC = () => {
  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      sx={{
        height: TOP_NAV_HEIGHT,
      }}>
      <Typography variant="h6">ZNHK</Typography>
      <UserInfo />
    </Box>
  );
};
