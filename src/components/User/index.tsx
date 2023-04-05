import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useAuth} from 'src/context/AuthContext';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UserInfo() {
  const {logout, currentUser} = useAuth();
  console.log('currentUser::', currentUser);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <AccountCircleIcon
          sx={{
            width: 40,
            height: 40,
            color: 'white',
          }}
        />
      </IconButton>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}>
        <AppBar sx={{position: 'relative'}}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
              Setting
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem button>
            <ListItemText primary="Email" secondary={currentUser?.email} />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText
              primary="Joined"
              secondary={currentUser?.metadata.creationTime}
            />
          </ListItem>
          <Divider />
          <ListItem button>
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
              },
            }}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}