
import React from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router';

import {
  Grid,
  Button,
  Chip,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

import UploadFileIcon from "@mui/icons-material/UploadFile";

import GridListItem from '../components/GridListItem';
import FormTextField from '../components/form/FormTextField';
import InputBox from '../components/form/InputBox';

import { handleFileUpload, deleteFile } from '../components/form/form_helper';
import { closeToast } from '../components/helper';

import BACKEND_PORT from '../BACKEND_PORT';
import { getDateString } from '../components/helper';

const ApprovedReviewerPage = ({userType}) => {
  const nav = useNavigate();

  const [companies, setCompanies] = React.useState([]);

  const [name, setName] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [links, setLinks] = React.useState('');
  const [files, setFiles] = React.useState([]);
  const [fileNames, setFileNames] = React.useState([]);
  const [reason, setReason] = React.useState('');
  
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
    return () => {
    };
  }, [userType])

  const submitForm = async () => {
    // Check if name and reason is not empty string.
    if (name === '') {
      setToastMessage('No name given');
      setOpenToast(true);
      return;
    } else if (reason === '') {
      setToastMessage('Need to give a reason');
      setOpenToast(true);
      return;
    }
    try {
      const res = await axios.post(`http://localhost:${BACKEND_PORT}/verification_form/reviewer/submit`,
      {
        'uid': localStorage['uid'],
        'name': name,
        'company_id': (company !== '') ? company['id'] : -1,
        'link': links,
        'message': reason,
        'files': files,
        'date': getDateString()
      }, {
        headers: {
          'token': localStorage['token']
        }
      })
      nav("/forms/submitted");
    } catch (errData) {
      setToastMessage(errData.response.data.message);
      setOpenToast(true);
    }
  }
  
  const handleCompany = (e) => {
    setCompany(e.target.value);
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
            label="Name"
            setVal={setName}
            helperText={(name === '') && 'Name cannot be empty'}
          />
        </GridListItem>
        {/* <GridListItem item xs={12}>
          <FormControl color="secondary" sx={{width: '50%'}}>
            <InputLabel id="gender-select">Company Affiliation (Optional)</InputLabel>
            <Select
              labelId="gender-select"
              defaultValue=""
              value={company['name']}
              label="Gender"
              onChange={handleCompany}
            >
              {
                companies.map((obj, idx) => {
                  return (
                    <MenuItem value={obj} key={idx}>{obj['name']}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        </GridListItem> */}
        <GridListItem item xs={12}>
          <FormTextField 
            label="Social Media and Website profile links (Optional)"
            setVal={setLinks}
          />
        </GridListItem>
        {/* <GridListItem item xs={12}>
          <InputBox
            container
          >
            <GridListItem item xs={12}>
              <Button
                component="label"
                variant="contained"
                startIcon={<UploadFileIcon />}
              >
                Upload additional documents (Optional)
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={(e) => handleFileUpload(e, files, setFiles, fileNames, setFileNames)}/>
              </Button>
            </GridListItem>
            {
              fileNames.map((name, idx) => {
                return (
                  <GridListItem item xs={12} key={`file-${idx}`}>
                    <Chip
                      label={name}
                      onDelete={() => deleteFile(idx, files, setFiles, fileNames, setFileNames)}/>
                  </GridListItem>
                )
              })
            }
          </InputBox>
        </GridListItem> */}
        <GridListItem item xs={12}>
          <FormTextField
            label="Why do you believe you should be verified?"
            setVal={setReason}
            helperText={(reason === '') && 'Cannot leave this textfield empty'}
          />
        </GridListItem>
        <GridListItem item xs={12}>
          <Button
            variant="contained"
            onClick={() => {submitForm()}}
          >
            Submit
          </Button>
        </GridListItem>
      </Grid>
      <Snackbar open={openToast} autoHideDuration={6000} onClose={(e, r) => {closeToast(e, r, setOpenToast)}}>
        <Alert onClose={(e, r) => closeToast(e, r, setOpenToast)} severity="error" >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Grid>
  )
}

export default ApprovedReviewerPage;