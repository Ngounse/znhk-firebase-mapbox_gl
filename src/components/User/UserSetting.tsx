import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import {useAuth} from 'src/context/AuthContext';
import {Divider, List, ListItem, ListItemText} from '@mui/material';
import {blue} from '@mui/material/colors';

interface IProps {
  handleClose: () => void;
}

const UserSetting = React.memo((props: IProps) => {
  const {logout, currentUser} = useAuth();
  const router = useRouter();

  const {handleClose} = props;
  const handleLogout = () => {
    logout();
    handleClose();
  };

  const handleLogin = () => {
    router.push('/auth/login');
    handleClose();
  };

  if (currentUser === null) {
    return (
      <List>
        <ListItem>
          <ListItemText secondary="Login to view your profile" />
        </ListItem>
        <Divider />
        <ListItem
          onClick={handleLogin}
          button
          sx={{
            '& :hover': {
              pl: 1,
              transition: 'all 0.3s ease-in-out',
              color: '#1976d2',
            },
          }}>
          <ListItemText primary="Login" />
        </ListItem>
      </List>
    );
  }

  return (
    <List>
      <ListItem>
        <ListItemText primary="Email" secondary={currentUser?.email} />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText
          primary="Joined"
          secondary={currentUser?.metadata.creationTime}
        />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText
          primary="Last Login"
          secondary={currentUser?.metadata.lastSignInTime}
        />
      </ListItem>
      <Divider />
      <ListItem
        onClick={handleLogout}
        button
        sx={{
          '& :hover': {
            pl: 1,
            transition: 'all 0.3s ease-in-out',
            color: 'red',
          },
        }}>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  );
});

export default UserSetting;
