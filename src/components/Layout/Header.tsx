import React from 'react';
import {Box, Typography} from '@mui/material';
import {TOP_NAV_HEIGHT} from './Layout';
import {useAuth} from 'src/context/AuthContext';
import UserInfo from '../User';

export const Header: React.FC = () => {
  const {currentUser} = useAuth();
  const isCurrentUser = currentUser ? true : false;
  const UID = currentUser?.uid || '';

  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      sx={{
        height: TOP_NAV_HEIGHT,
      }}>
      {isCurrentUser ? (
        <>
          <Typography noWrap>UID : {UID}</Typography>
          <UserInfo />
        </>
      ) : (
        <Typography noWrap>Not logged in</Typography>
      )}
    </Box>
  );
};
