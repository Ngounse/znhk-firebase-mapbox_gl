import React from 'react';
import {Box, Container} from '@mui/material';
import {Header} from './Header';
import {Footer} from './Footer';
import {useAuth} from 'src/context/AuthContext';
import {useRouter} from 'next/router';

export const SIDE_NAV_WIDTH = 280;
export const TOP_NAV_HEIGHT = 64;
export const FOOT_NAV_HEIGHT = 34;

interface ILayoutProps {
  children: React.ReactNode;
  branch?: string;
  sx?: any;
}
export const Layout: React.FC<ILayoutProps> = ({children}) => {
  const {currentUser} = useAuth();
  const router = useRouter();

  if (!currentUser) {
    router.push('/auth/login');
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box display={'flex'} flexDirection={'column'}>
        <Header />
        <Box
          sx={{
            width: '100%',
            height: `calc(100vh - ${TOP_NAV_HEIGHT}px - ${FOOT_NAV_HEIGHT}px)`,
            '--nav-height': `${TOP_NAV_HEIGHT}px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Container>
  );
};
