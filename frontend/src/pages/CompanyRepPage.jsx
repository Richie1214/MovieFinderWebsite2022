import React from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router';

import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  Chip,
  Button,
  Snackbar,
  Alert
} from '@mui/material';

import UploadFileIcon from "@mui/icons-material/UploadFile";

import { handleFileUpload, deleteFile } from '../components/form/form_helper';

import GridListItem from "../components/GridListItem";
import FormTextField from "../components/form/FormTextField";
import InputBox from '../components/form/InputBox';
import SelectCompany from '../components/form/SelectCompany';

import BACKEND_PORT from '../BACKEND_PORT';

import { closeToast, getDateString } from '../components/helper';

const CompanyRepPage = ({userType}) => {
  const nav = useNavigate();

  const [companies, setCompanies] = React.useState([]);

  const [radioVal, setRadioVal] = React.useState('existing');
  const [newCompany, setNewCompany] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [linkedIn, setLinkedIn] = React.useState('');
  const [companyWebsite, setCompanyWebsite] = React.useState('');
  const [contactNumber, setContactNumber] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [files, setFiles] = React.useState([]);
  const [fileNames, setFileNames] = React.useState([]);
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

  const handleCompany = (e) => {
    setCompany(e.target.value);
  }

  const handleRadioChange = (e) => {
    setRadioVal(e.target.value);
  }
  
  const submitForm = async () => {
    // Error checking.
    if (radioVal === 'existing' && company === '') {
      setToastMessage('No existing company selected');
      setOpenToast(true);
      return;
    } else if (radioVal === 'new' && newCompany === '') {
      setToastMessage('New company name cannot be empty');
      setOpenToast(true);
      return;
    } else if (isNaN(contactNumber)) {
      setToastMessage('Invalid contact number');
      setOpenToast(true);
      return;
    }
    try {
      console.log(typeof(files[0]))
      console.log({
        'uid': localStorage['uid'],
        'company_id': (radioVal === 'existing') ? company['id'] : -1,
        'company_name': (radioVal === 'new') ? newCompany : company['name'],
        'link': linkedIn,
        'company_website': companyWebsite,
        'phone': contactNumber,
        'message': message,
        'files': files,
        'date': getDateString()
      });
      const res = await axios.post(`http://localhost:${BACKEND_PORT}/verification_form/company/submit`,
        {
          'uid': localStorage['uid'],
          'company_id': (radioVal === 'existing') ? company['id'] : -1,
          'company_name': (radioVal === 'new') ? newCompany : company['name'],
          'link': linkedIn,
          'company_website': companyWebsite,
          'phone': contactNumber,
          'message': message,
          'files': files,
          'date': getDateString()
        }, {
          headers: {
            'token': localStorage['token'],
          }
        }
      )
      nav("/forms/submitted");
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
          {
            (radioVal === 'existing') ? (
              <SelectCompany
                company={company}
                handleCompany={handleCompany}
                companies={companies}
              />
            ) : (
              <FormTextField
                label="New Company Name"
                setVal={setNewCompany}
                helperText={(newCompany === '') && 'Cannot be empty'}
                defaultValue={newCompany}
              />
            )
          }
        </GridListItem>
        <GridListItem item xs={12}>
          <FormControl>
            <RadioGroup
              value={radioVal}
              onChange={handleRadioChange}
              row
            >
              <FormControlLabel value="existing" control={<Radio />} label="Existing Company" />
              <FormControlLabel value="new" control={<Radio />} label="New Company" />
            </RadioGroup>
          </FormControl>
        </GridListItem>
        <GridListItem item xs={12}>
          <FormTextField
            label="Link to LinkedIn profile"
            setVal={setLinkedIn}
          />
        </GridListItem>
        <GridListItem item xs={12}>
          <FormTextField
            label="Company Website (Optional)"
            setVal={setCompanyWebsite}
          />
        </GridListItem>
        <GridListItem item xs={12}>
          <FormTextField
            label="Contact Number (Optional)"
            setVal={setContactNumber}
            helperText={(isNaN(contactNumber)) && 'Please enter only digits'}
          />
        </GridListItem>
        <GridListItem item xs={12}>
          <FormTextField
            label="Message (Optional)"
            setVal={setMessage}
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
                  onChange={(e) => handleFileUpload(e, files, setFiles, fileNames, setFileNames)}
                />
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
          <Button
            variant="contained"
            onClick={() => {submitForm()}}
          >
            Submit
          </Button>
        </GridListItem>
      </Grid>
      <Snackbar open={openToast} autoHideDuration={6000} onClose={(e, r) => {closeToast(e, r, setOpenToast)}}>
        <Alert onClose={(e, r) => {closeToast(e, r, setOpenToast)}} severity="error" >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Grid>
  )
}

export default CompanyRepPage;