
import React from 'react';

import axios from 'axios';

import { useNavigate } from 'react-router';

import {
  Grid,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import GridListItem from '../components/GridListItem';
import FormTextField from '../components/form/FormTextField';
import AbleSubmitButton from '../components/site_admin/AbleSubmitButton';
import SelectCompany from '../components/form/SelectCompany';

import BACKEND_PORT from '../BACKEND_PORT';

import { closeToast } from '../components/helper';

const AdminDirectPromoteReject = ({userType}) => {

  const nav = useNavigate();

  const [email, setEmail] = React.useState('');
  const [manageVal, setManageVal] = React.useState('promote');
  const [accType, setAccType] = React.useState('reviewer');

  const [companies, setCompanies] = React.useState([]);
  const [company, setcompany] = React.useState('');
  
  const [openToast, setOpenToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');

  React.useEffect(() => {
    if (userType !== '') {
      (async () => {
        try {
          const res = await axios.get(`http://localhost:${BACKEND_PORT}/companies/all`);
          const data = res.data;
          setCompanies(data['companies']);
        } catch (errData) {
          console.log(errData);
        }
      })();
    }
  }, [userType])

  const handleManageChange = (e) => {
    setManageVal(e.target.value);
  }
  
  const handleAccChange = (e) => {
    setAccType(e.target.value);
  }
  
  const handleCompany = (e) => {
    setcompany(e.target.value);
  }

  const demote = async () => {
    if (!email.includes('@')) {
      setToastMessage('Enter a valid email');
      setOpenToast(true);
    } else if (email === localStorage['email']) {
      setToastMessage('Do not demote yourself');
      setOpenToast(true);
      return;
    }
    try {
      const res = await axios.post(`http://localhost:${BACKEND_PORT}/demote`, {
        email: email
      }, {
        headers: {
          'token': localStorage['token']
        }
      })
      nav('/site_admin/select');
    } catch (errData) {
      setToastMessage(errData.response.data.message);
      setOpenToast(true);
    }
  }
  
  const promote = async () => {
    console.log(company)
    if (!email.includes('@')) {
      setToastMessage('Enter a valid email');
      setOpenToast(true);
      return;
    } else if (accType === 'company' && company === '') {
      setToastMessage('Please select a company to assign this user');
      setOpenToast(true);
      return;
    } else if (email === localStorage['email']) {
      setToastMessage('Do not promote yourself');
      setOpenToast(true);
      return;
    }
    const data = {
      'userType': accType,
      'email': email,
      'company_id': (accType === 'reviewer') ? -1 : company['id']
    }
    try {
      const res = await axios.post(`http://localhost:${BACKEND_PORT}/promote`, data,
        {
          headers: {
            'token': localStorage['token']
          }
        }
      )
      nav('/site_admin/select');
    } catch (errData) {
      setToastMessage(errData.response.data.message);
      setOpenToast(true);
    }
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      spacing={3}
      justifyContent="center"
      flex={1}
    >
      <Grid container>
        <GridListItem item xs={12}>
          <FormTextField
            label="Email"
            setVal={setEmail}
            helperText={(!email.includes('@')) && 'Enter valid email'}
          />
        </GridListItem>
        <GridListItem item xs={12}>
          <FormControl>
            <RadioGroup
              value={manageVal}
              onChange={handleManageChange}
              row
            >
              <FormControlLabel value="promote" control={<Radio />} label="Promote" />
              <FormControlLabel value="demote" control={<Radio />} label="Demote" />
            </RadioGroup>
          </FormControl>
        </GridListItem>
        <GridListItem item xs={12}>
          <ArrowDownwardIcon />
        </GridListItem>
        {
          (manageVal === 'demote') && (
            <AbleSubmitButton subFunction={demote}/>
          )
        }
        {
          (manageVal === 'promote') && (
            <GridListItem item xs={12}>
              <Grid container>
                <GridListItem item xs={12}>
                  <Typography variant="h5">
                    Choose account type:
                  </Typography>
                </GridListItem>
                <GridListItem item xs={12}>
                  <FormControl>
                    <RadioGroup
                      value={accType}
                      onChange={handleAccChange}
                      row
                    >
                      <FormControlLabel value="reviewer" control={<Radio />} label="Verified Reviewer" />
                      <FormControlLabel value="company" control={<Radio />} label="Company Account" />
                    </RadioGroup>
                  </FormControl>
                </GridListItem>
                <GridListItem item xs={12}>
                  <ArrowDownwardIcon />
                </GridListItem>
              </Grid>
            </GridListItem>
          )
        }
        {
          (manageVal === 'promote' && accType === 'reviewer') && (
            <AbleSubmitButton subFunction={promote} />
          )
        }
        {
          (manageVal === 'promote' && accType === 'company') && (
            <GridListItem item xs={12}>
              <Grid container>
                <GridListItem item xs={12}>
                  <Typography variant="h5">
                    Choose company:
                  </Typography>
                </GridListItem>
                <GridListItem item xs={12}>
                  <SelectCompany
                    company={company}
                    handleCompany={handleCompany}
                    companies={companies}
                  />
                </GridListItem>
              </Grid>
            </GridListItem>
          )
        }
        {
          (manageVal === 'promote' && accType === 'company' && company !== '') && (
            <GridListItem item xs={12}>
              <Grid container>
                <GridListItem item xs={12}>
                  <ArrowDownwardIcon />
                </GridListItem>
                <GridListItem item xs={12}>
                  <AbleSubmitButton subFunction={promote} />
                </GridListItem>
              </Grid>
            </GridListItem>
          )
        }
      </Grid>
      <Snackbar open={openToast} autoHideDuration={6000} onClose={(e, r) => {closeToast(e, r, setOpenToast)}}>
        <Alert onClose={(e, r) => {closeToast(e, r, setOpenToast)}} severity="error" >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Grid>
  )
}

export default AdminDirectPromoteReject;