import React from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router';

import {
  CardActionArea,
  CardContent,
  Typography,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';

import GridItem from '../components/GridItem';
import GridListItem from '../components/GridListItem';
import FormSelectBox from '../components/form/FormSelectBox';
import FormSelectCard from '../components/form/FormSelectCard';

import BACKEND_PORT from '../BACKEND_PORT';

import { closeToast } from '../components/helper';

const FormTypePage = ({ userType }) => {
  
  const nav = useNavigate();
  const [reviewNum, setReviewNum] = React.useState(0);
  const [alreadySubmittedReviewer, setAlreadySubmittedReviewer] = React.useState(false);
  const [alreadySubmittedCompany, setAlreadySubmittedCompany] = React.useState(false);
  
  const [openToast, setOpenToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  
  React.useEffect(() => {
    if (userType !== '') {
      (async () => {
        try {
          const res = await axios.get(`http://localhost:${BACKEND_PORT}/verification_form/valid_apply`,
            {
              headers: {
                'token': localStorage['token'],
                'uid': localStorage['uid']
              }
            }
          );
          const data = res.data;
          console.log(data);
          setReviewNum(data['num_reviews']);
          setAlreadySubmittedReviewer(data['reviewer_form_already_sent']);
          setAlreadySubmittedCompany(data['company_form_already_sent']);
        } catch (errData) {
          console.log(errData);
        }
      })();
    }
    return () => {}
  }, [userType])
  
  const handleApprovedReviewerForm = () => {
    if (reviewNum < 5) {
      setToastMessage('You need to make at least 5 reviews.');
      setOpenToast(true);
      return;
    } else if (alreadySubmittedReviewer || alreadySubmittedCompany) {
      setToastMessage('You have already submitted a form. Wait until the site admins have \
                      reviewed it');
      setOpenToast(true);
      return;
    }
    nav('/forms/reviewer');
  }
  
  const handleCompanyAccountForm = () => {
    if (alreadySubmittedCompany || alreadySubmittedReviewer) {
      setToastMessage('You have already submitted a form. Wait until the site admins have \
                      reviewed it');
      setOpenToast(true);
      return;
    }
    nav('/forms/company')
  }
  
  return (
    <FormSelectBox container>
      <GridItem item xs={6}>
        <FormSelectCard>
          <CardActionArea onClick={() => {handleApprovedReviewerForm()}}>
            <CardContent>
              <Grid container>
                <GridListItem item xs={12}>
                  <Typography variant="h5">
                    Verified reviewer form
                  </Typography>
                </GridListItem>
                <GridListItem item xs={12}>
                  <Typography>
                    Well-respected reviewer looking for greener pastures or just really passionate?
                  </Typography>
                </GridListItem>
                <GridListItem item xs={12}>
                  <Typography>
                    Apply for a verified reviewer account upgrade and post videos
                    and stand out from others! Make sure you have posted at least 5
                    written reviews before applying!
                  </Typography>
                </GridListItem>
              </Grid>
            </CardContent>
          </CardActionArea>
        </FormSelectCard>
      </GridItem>
      <GridItem item xs={6}>
        <FormSelectCard>
          <CardActionArea onClick={() => {handleCompanyAccountForm()}}>
            <CardContent>
              <Grid container>
                <GridListItem item xs={12}>
                  <Typography variant="h5">
                    Movie Company Representative
                  </Typography>
                </GridListItem>
                <GridListItem item xs={12}>
                  <Typography>
                    Social media admin for a movie company?
                  </Typography>
                </GridListItem>
                <GridListItem item xs={12}>
                  <Typography>
                    Apply for a movie company account upgrade and create an online presence
                    here to promote your company's movies!
                  </Typography>
                </GridListItem>
              </Grid>
            </CardContent>
          </CardActionArea>
        </FormSelectCard>
      </GridItem>
      <Snackbar open={openToast} autoHideDuration={6000} onClose={(e, r) => {closeToast(e, r, setOpenToast)}}>
        <Alert onClose={(e, r) => {closeToast(e, r, setOpenToast)}} severity="error" >
          {toastMessage}
        </Alert>
      </Snackbar>
    </FormSelectBox>
  )
}

export default FormTypePage;