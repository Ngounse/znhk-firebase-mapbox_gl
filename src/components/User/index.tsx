import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UserSetting from './UserSetting';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserInfo = React.memo(() => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton
        onClick={handleClickOpen}
        sx={{
          '&:hover svg': {
            color: 'cyan',
            transition: 'all 0.3s ease-in-out',
          },
        }}>
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
              Okay
            </Button>
          </Toolbar>
        </AppBar>
        <UserSetting handleClose={handleClose} />
      </Dialog>
    </div>
  );
});

export default UserInfo;
