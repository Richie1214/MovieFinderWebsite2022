import React from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router';

import {
  Button,
  Grid,
  Modal,
  Box,
  Typography,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import GridListItem from '../GridListItem';

import { styled } from '@mui/material/styles';

import { closeModal, closeToast } from '../helper';

import BACKEND_PORT from '../../BACKEND_PORT';

const SettingsBox = styled(Box, {})(({theme}) => ({
  backgroundColor: theme.palette.secondary.light,
  position: 'relative',
  top: '25%',
  left: '25%',
  height: '50%',
  width: '50%',
}))

const SettingsModal = ({openModal, setOpenModal, setLoggedIn, userType}) => {
  
  const [openToast, setOpenToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  
  const nav = useNavigate();

  const handleDeactivate = async () => {
    try {
      const config = {
        headers: {
          token: localStorage['token']
        },
        data: {
          uid: localStorage['uid']
        }
      };
      await axios.delete(`http://localhost:${BACKEND_PORT}/profile/delete`, config);
      localStorage['token'] = '';
      localStorage['uid'] = '';
      setLoggedIn(false);
      nav('/');
    } catch (errData) {
      console.log(errData);
    }
  }
  
  const handleGoToForms = () => {
    if (userType === 'normal') {
      nav('/forms');
    } else {
      setToastMessage('Your account is already upgraded.');
      setOpenToast(true);
    }
  }

  return (
    <Modal
      open={openModal}
      onClose={(e, r) => closeModal(e, r, setOpenModal)}
    >
      <>
        <SettingsBox>
          <Grid container>
            <GridListItem item xs={11} />
            <GridListItem item xs={1}>
              <IconButton onClick={(e, r) => closeModal(e, r, setOpenModal)}>
                <CloseIcon />
              </IconButton>
            </GridListItem>
            <GridListItem item xs={12}>
              <Typography variant="h5">
                Profile settings
              </Typography>
            </GridListItem>
            <GridListItem item xs={12}>
              <Button variant="contained" onClick={() => {handleGoToForms()}}>
                Account upgrade
              </Button>
            </GridListItem>
            <GridListItem item xs={12}>
              <Button variant="contained" onClick={() => {nav('/forms/submitted')}}>
                Submitted Forms
              </Button>
            </GridListItem>
            <GridListItem item xs={12}>
              <Button variant="contained" color="error" onClick={handleDeactivate}>
                Deactivate account
              </Button>
            </GridListItem>
          </Grid>
        </SettingsBox>
        <Snackbar open={openToast} autoHideDuration={6000} onClose={(e, r) => {closeToast(e, r, setOpenToast)}}>
          <Alert onClose={(e, r) => closeToast(e, r, setOpenToast)} severity="error" >
            {toastMessage}
          </Alert>
        </Snackbar>
      </>
    </Modal>
  )
}

export default SettingsModal;