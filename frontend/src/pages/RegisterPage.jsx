import React from 'react';
import axios from 'axios';

import { Alert, Box, Grid, TextField, Button, Select, MenuItem, InputLabel, FormControl, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router';

import BACKEND_PORT from '../BACKEND_PORT';

const RegisterPage = (props) => {
  const [fullName, setFullName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [gender, setGender] = React.useState('');
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

  const handleRegister = async () => {
    try {
      const payload = {
        name: fullName,
        username: username,
        email: email,
        password: password,
        gender: gender
      }
      const res = await axios.post(`http://localhost:${BACKEND_PORT}/auth/register`, payload);
      const data = res.data;
      localStorage['token'] = data['token'];
      localStorage['uid'] = data['uid'];
      localStorage['email'] = email;
      localStorage['username'] = username;
      props.setLoggedIn(true);
      nav('/');
    } catch (errData) {
      setToastMessage(getErrMsg(errData));
      setOpenToast(true);
    }
  }

  const handleGender = (e) => {
    setGender(e.target.value);
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <Grid 
        container
        direction="column"
        alignItems="center"
        spacing={3}
        flex={1}
      >
        <Grid item>
          <TextField
            color="secondary"
            label="Full Name"
            onChange={e => setFullName(e.target.value)}
          />
        </Grid>
        <Grid item>
          <TextField
            color="secondary"
            label="Username"
            onChange={e => setUsername(e.target.value)}
          />
        </Grid>
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
          <FormControl color="secondary" sx= {{ minWidth: 120 }}>
            <InputLabel id="gender-select">Gender</InputLabel>
            <Select
              labelId="gender-select"
              value={gender}
              label="Gender"
              onChange={handleGender}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Button
            color="secondary"
            variant="contained"
            onClick={handleRegister}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={openToast} autoHideDuration={6000} onClose={closeToast}>
        <Alert onClose={closeToast} severity="error" >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default RegisterPage;
