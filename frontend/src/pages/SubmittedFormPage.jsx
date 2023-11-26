import React from 'react';
import axios from 'axios';

import {
  Grid,
  Box
} from '@mui/material';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import GridItem from '../components/GridItem';
import FormListPaper from '../components/form/FormListPaper';
import FormViewGrid from '../components/form/FormViewGrid';
import FormViewModal from '../components/form/FormViewModal';

import BACKEND_PORT from '../BACKEND_PORT';

const SubmittedFormPage = ({ isOwnForms, userType }) => {

  const [reviewForms, setReviewForms] = React.useState([]);
  const [companyForms, setCompanyForms] = React.useState([]);
  
  console.log(companyForms);
  
  // Below are only set if isOwnForms === false
  // reviewing* means these are the forms that need to be accepted. 
  // reviewed* means that these forms have already been reviewed.
  const [reviewingReviewForms, setReviewingReviewForms] = React.useState([]);
  const [reviewingCompanyForms, setReviewingCompanyForms] = React.useState([]);
  const [reviewedReviewForms, setReviewedReviewForms] = React.useState([]);
  const [reviewedCompanyForms, setReviewedCompanyForms] = React.useState([]);
  
  // Below is to keep state of the modals.
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedForm, setSelectedForm] = React.useState(null);
  const [index, setIndex] = React.useState(0);
  const [formType, setFormType] = React.useState('reviewing_company');
  
  React.useEffect(() => {
    //Do axios call
    if (userType !== '') {
      (async () => {
        if (isOwnForms) {
          try {
            const res = await axios.get(`http://localhost:${BACKEND_PORT}/verification_form/user`, {
              headers: {
                'token': localStorage['token'],
                'uid': localStorage['uid']
              }
            });
            const data = res.data;
            setReviewForms(data['reviewer_forms']);
            setCompanyForms(data['company_forms']);
          } catch (errData) {
            console.log(errData);
          }
        } else {
          try {
            const res = await axios.get(`http://localhost:${BACKEND_PORT}/verification_form/all`, {
              headers: {
                'token': localStorage['token'],
                'uid': localStorage['uid']
              }
            });
            const data = res.data;
            console.log(data)
            setReviewingReviewForms(data['reviewing_reviewer_forms']);
            setReviewingCompanyForms(data['reviewing_company_forms']);
            setReviewedReviewForms(data['reviewed_reviewer_forms']);
            setReviewedCompanyForms(data['reviewed_company_forms']);
          } catch (errData) {
            console.log(errData);
          }
        }
      })();
    }
    return () => {
    };
  }, [userType])
  
  const moveReviewingCompanyToReviewed = (accepted) => {
    let form = reviewingCompanyForms.splice(index, 1)[0];
    if (accepted) {
      form['status'] = 'accepted'
    } else {
      form['status'] = 'rejected'
    }
    setReviewingCompanyForms([...reviewingCompanyForms])
    setReviewedCompanyForms([form, ...reviewedCompanyForms]);
  }
  
  const moveReviewingReviewerToReviewed = (accepted) => {
    let form = reviewingReviewForms.splice(index, 1)[0];
    if (accepted) {
      form['status'] = 'accepted'
    } else {
      form['status'] = 'rejected'
    }
    setReviewingReviewForms([...reviewingReviewForms]);
    setReviewedReviewForms([form, ...reviewedReviewForms]);
  }
  
  return (
    <Box>
      {
        (isOwnForms) ? (
          <Grid container>
            <GridItem item xs={12}>
              <FormViewGrid
                title={'Approved reviewer form submissions'}
                forms={reviewForms}
                setOpenModal={setOpenModal}
                setForm={setSelectedForm}
                setIndex={setIndex}
                setFormType={setFormType}
                formType={'self_reviewer'}
              />
            </GridItem>
            <GridItem item xs={12}>
              <FormViewGrid
                title={'Movie company representative form submissions'}
                forms={companyForms}
                setOpenModal={setOpenModal}
                setForm={setSelectedForm}
                setIndex={setIndex}
                setFormType={setFormType}
                formType={'self_company'}
              />
            </GridItem>
          </Grid>
        ) : (
          <Grid container>
            <GridItem item xs={12}>
              <FormViewGrid
                title={'Approved reviewer form under review'}
                forms={reviewingReviewForms}
                setOpenModal={setOpenModal}
                setForm={setSelectedForm}
                setIndex={setIndex}
                setFormType={setFormType}
                formType={'reviewing_reviewer'}
              />
            </GridItem>
            <GridItem item xs={12}>
              <FormViewGrid
                title={'Movie company representative forms under review'}
                forms={reviewingCompanyForms}
                setOpenModal={setOpenModal}
                setForm={setSelectedForm}
                setIndex={setIndex}
                setFormType={setFormType}
                formType={'reviewing_company'}
              />
            </GridItem>
            <GridItem item xs={12}>
              <FormViewGrid
                title={'Reviewed reviewer forms'}
                forms={reviewedReviewForms}
                setOpenModal={setOpenModal}
                setForm={setSelectedForm}
                setIndex={setIndex}
                setFormType={setFormType}
                formType={'reviewed_reviewer'}
              />
            </GridItem>
            <GridItem item xs={12}>
              <FormViewGrid
                title={'Reviewed company forms'}
                forms={reviewedCompanyForms}
                setOpenModal={setOpenModal}
                setForm={setSelectedForm}
                setIndex={setIndex}
                setFormType={setFormType}
                formType={'reviewed_company'}
              />
            </GridItem>
          </Grid>
        )
      }
      {
        (formType === 'reviewing_company') ? (
          <FormViewModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            form={selectedForm}
            formType={formType}
            change={moveReviewingCompanyToReviewed}
          />) : (formType === 'reviewing_reviewer') ? (
            <FormViewModal
              openModal={openModal}
              setOpenModal={setOpenModal}
              form={selectedForm}
              formType={formType}
              change={moveReviewingReviewerToReviewed}
            />
          ) : (
            <FormViewModal
              openModal={openModal}
              setOpenModal={setOpenModal}
              form={selectedForm}
              formType={formType}
              change={() => {}}
            />
          )
      }
    </Box>

  )  
}

export default SubmittedFormPage;