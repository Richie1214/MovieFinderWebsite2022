import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

import { Button, Modal, Typography, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import BACKEND_PORT from '../BACKEND_PORT';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'secondary.light',
  boxShadow: 24,
  p: 4
};

const EditModal = (props) => {
  const [input, setInput] = React.useState('');
  const [gender, setGender] = React.useState(props.gender);
  const nav = useNavigate();

  const typeMatch = (modalType) => {
    return props.modalType.localeCompare(modalType) === 0;
  }
  
  const handleClose = () => {
    props.setOpen(false);
    setGender(props.gender);
  }
  
  const handleGender = (e) => {
    setGender(e.target.value);
    setInput(e.target.value);
  }
  
  const handleEdit = async () => {
    const config = { headers: { token: localStorage['token'] } };
    if (typeMatch("Username")) {
      const data = { username: input };
      try {
        await axios.put(`http://localhost:${BACKEND_PORT}/profile/edit/username`, data, config);
      } catch (errData) {
        console.log(errData);
      }
      localStorage['username'] = input;
      props.setUsername(input);
    } else if (typeMatch("Email")) {
      console.log(props.modalType);
      const info = { email: input };
      try {
        const res = await axios.put(`http://localhost:${BACKEND_PORT}/profile/edit/email`, info, config);
        const data = res.data;
        localStorage['token'] = data['token'];
      } catch (errData) {
        console.log(errData);
      }
      localStorage['email'] = input;
      props.setEmail(input);
    } else if (typeMatch("Name")) {
      const data = { name: input };
      try {
        await axios.put(`http://localhost:${BACKEND_PORT}/profile/edit/name`, data, config);
      } catch (errData) {
        console.log(errData);
      }
      props.setFullname(input);
    } else if (typeMatch("Bio")) {
      const data = { bio: input };
      try {
        await axios.put(`http://localhost:${BACKEND_PORT}/profile/edit/bio`, data, config);
      } catch (errData) {
        console.log(errData);
      }
      props.setBio(input);
    } else if (typeMatch("Gender")) {
      const data = { gender: input };
      try {
        await axios.put(`http://localhost:${BACKEND_PORT}/profile/edit/gender`, data, config);
      } catch (errData) {
        console.log(errData);
      }
      props.setGender(input);
    } else {
      const data = { info: input, id: localStorage['cid'] };
      try {
        await axios.put(`http://localhost:${BACKEND_PORT}/company/details/edit`, data, config)
      } catch (errData) {
        console.log(errData);
      }
      props.setInfo(input);
    }
    props.setOpen(false);
  }

  return (
    <div>
      <Modal
        open={props.open}
        onClose={handleClose}
      >
        <Grid 
          container 
          direction='column'
          justifyContent='center'
          sx={style}
        >
          <Grid item sx={{ p: 1 }}>
            <Typography variant="h5">
              Enter new {props.modalType}
            </Typography>
          </Grid>
          <Grid item sx={{ p: 1 }}>
            {props.modalType.localeCompare("Bio") === 0 || props.modalType.localeCompare("Info") === 0 ?
              <TextField 
                multiline
                rows={20}
                sx={{ width: '100%' }}
                color="secondary"
                label={props.modalType}
                onChange={(e) => setInput(e.target.value)}
              />
            : props.modalType.localeCompare("Gender") === 0 ?
              <FormControl color="secondary" sx= {{ width: '100%' }}>
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
            :
              <TextField 
                sx={{ width: '100%' }}
                color="secondary"
                label={props.modalType}
                onChange={(e) => setInput(e.target.value)}
              />
            }
          </Grid>
          <Grid item sx={{ display: 'flex', justifyContent: 'space-evenly', p: 1 }}>
            <Button
              onClick={handleClose}
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              size="large"
              variant="contained"
              onClick={handleEdit}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Modal>
    </div>
  );
}

export default EditModal;
