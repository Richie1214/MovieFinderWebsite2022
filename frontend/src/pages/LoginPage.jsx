import React from 'react';
import axios from 'axios';

import { Alert, Box, Snackbar, TextField, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router';

import BACKEND_PORT from '../BACKEND_PORT';

import { getUserType, closeToast } from '../components/helper';

const LoginPage = (props) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [openToast, setOpenToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const nav = useNavigate();

  const closeToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  }

  const getErrMsg = (err) => {
     const msg = err.response.data.message;
     return msg.slice(3, msg.length - 5);
  }

  const handleLogin = async () => {
    try {
      const payload = {
        email: email,
        password: password
      }
      const res = await axios.post(`http://localhost:${BACKEND_PORT}/auth/login`, payload);
      const data = res.data;
      if (data['is_company']) {
        localStorage['cid'] = data['cid'];
      }
      localStorage['uid'] = data['uid'];
      localStorage['username'] = data['username'];
      localStorage['email'] = email;
      localStorage['token'] = data['token'];
      props.setLoggedIn(true);
      getUserType(true, props.setUserType)
      nav('/');
    } catch (errData) {
      setToastMessage(getErrMsg(errData));
      setOpenToast(true);
    }
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <Grid
      container direction="column"
      alignItems="center"
      spacing={3}
      flex={1}
      >
        <Grid item>
          <TextField 
            color="secondary"
            label="Email"
            onChange={e => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item>
          <TextField
            color="secondary"
            type="password"
            label="Password"
            onChange={e => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button
            onClick={handleLogin}
            color="secondary"
            variant="contained"
          >
            Log In
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={openToast} autoHideDuration={6000} onClose={(e, r) => {closeToast(e, r, setOpenToast)}}>
        <Alert onClose={(e, r) => {closeToast(e, r, setOpenToast)}} severity="error" >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default LoginPage;