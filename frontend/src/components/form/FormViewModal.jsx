import React from 'react';
import axios from 'axios';

import {
  Modal,
  Box,
  Grid,
  Typography,
  Button
} from '@mui/material';

import { closeModal } from '../helper';

import { styled } from '@mui/material/styles';
import GridListItem from '../GridListItem';

import BACKEND_PORT from '../../BACKEND_PORT';

const FormBox = styled(Box, {})(({theme}) => ({
  width: '60%',
  height: '60%',
  top: '20%',
  left: '20%',
  position: 'relative',
  backgroundColor: theme.palette.primary.dark
}))

const FormViewModal = ({ openModal, setOpenModal, form, formType, change }) => {
  
  const [data, setData] = React.useState({});
  
  React.useEffect(() => {
    if (form !== null) {
      setData({
        'form_id': form.form_id,
        'type': formType.includes('company') ? 'company' : 'reviewer',
        'uid': form.uid,
        'username': form.username,
        'company_id': form.company_id,
        'company_name': form.company_name
      })
    }
  }, [form]);
  
  const handleAccept = async () => {
    try {
      const res = await axios.post(`http://localhost:${BACKEND_PORT}/verification_form/confirm`,
        data , {
        headers: {
          'token': localStorage['token']
        }
      }
      )
      // Now, update the reviewed and reviewing forms
      change(true);
      setOpenModal(false);
    } catch (errData) {
      console.log(errData);
    }
  }
  
  const handleDeny = async () => {
    try {
      const res = await axios.post(`http://localhost:${BACKEND_PORT}/verification_form/deny`,
        data, {
        headers: {
          'token': localStorage['token']
        }
      }
      )
      change(false);
      setOpenModal(false);
    } catch (errData) {
      console.log(errData);
    }
  }
  
  return (
    <Modal
      open={openModal}
      onClose={(e, r) => closeModal(e, r, setOpenModal)}
    >
      <FormBox>
        {
          (form !== null) && (
          <Grid container>
            {
              (formType.includes('reviewer')) ? (
                <GridListItem item xs={12}>
                    <Typography>
                      Reviewer form
                    </Typography>
                  </GridListItem>
              ) : (
                <GridListItem item xs={12}>
                  <Typography>
                    Company form
                  </Typography>
                </GridListItem>
              )
            }
            
            <GridListItem item xs={12}>
              <Typography>
                Form id: {form.form_id}
              </Typography>
            </GridListItem>
            <GridListItem item xs={12}>
              <Typography>
                Date submitted: {form.date}
              </Typography>
            </GridListItem>
            <GridListItem item xs={12}>
              <Typography>
                Status: {form.status}
              </Typography>
            </GridListItem>
            <GridListItem item xs={12}>
              <Typography>
                Username: {form.username}, User ID: {form.uid}
              </Typography>
            </GridListItem>
            {
              (form.company_name !== '') && (
                <GridListItem item xs={12}>
                  <Typography>
                    Associated company: {form.company_name}
                  </Typography>
                </GridListItem>
              )

            }

            <GridListItem item xs={12}>
              <Typography>
                Link: {((form.link) !== '') ? form.link : 'None'}
              </Typography>
            </GridListItem>
            <GridListItem item xs={12}>
              <Typography>
                Message: {((form.message) !== '') ? form.message : 'None'}
              </Typography>
            </GridListItem>
            {
              (formType.includes('company')) && (
                <>
                  <GridListItem item xs={12}>
                    <Typography>
                      Phone: {((form.phone) !== '') ? form.phone : 'None'}
                    </Typography>
                  </GridListItem>
                  <GridListItem item xs={12}>
                    <Typography>
                      Company Website: {((form.company_website) !== '') ? form.company_website : 'None'}
                    </Typography>
                  </GridListItem>
                </>
              )
            }
            {
              ((formType === 'reviewing_company' || formType === 'reviewing_reviewer')) && (
                <GridListItem item xs={12}>
                  <Button
                    variant="contained"
                    onClick={() => handleAccept()}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleDeny()}
                  >
                    Deny
                  </Button>  
                </GridListItem>
              )
            }
          </Grid>
          )
        }
      </FormBox>
    </Modal>
  )
}

export default FormViewModal;