
import React from 'react';

import {
  Grid,
  Typography,
  IconButton
} from '@mui/material';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import GridItem from '../GridItem';
import FormListPaper from './FormListPaper';
import FormListCard from './FormListCard';

const FormViewGrid = ({ title, forms, setOpenModal, setForm, setIndex, setFormType, formType }) => {
  const [formPage, setFormPage] = React.useState(0);
  
  return (
    <Grid container>
      <GridItem item xs={12}>
        <Typography variant="h5">
          {title}
        </Typography>
      </GridItem>
      <GridItem item xs={12}>
        <FormListPaper>
          <Grid container>
            <GridItem item xs={4}>
              <Typography variant="h6">
                Username
              </Typography>
            </GridItem>
            <GridItem item xs={4}>
              <Typography variant="h6">
                Date submitted
              </Typography>
            </GridItem>
            <GridItem item xs={4}>
              <Typography variant="h6">
                Status
              </Typography>
            </GridItem>
          </Grid>
        </FormListPaper>
      </GridItem>
      <GridItem item xs={12}>
        <Grid container>
          {
            forms.slice(formPage*10, formPage*10 + 10).map((form, idx) => {
              return (
                <GridItem item xs={12} key={`reviewer-form-${idx}`}>
                  <FormListCard
                    form={form}
                    setForm={setForm}
                    setIndex={setIndex}
                    setOpenModal={setOpenModal}
                    setFormType={setFormType}
                    formType={formType}
                    idx={formPage*10 + idx}
                  />
                </GridItem>
              )
            })
          }
        </Grid>
      </GridItem>
      <GridItem item xs={12}>
        <IconButton onClick={() => {setFormPage(Math.max(0, formPage-1))}}>
          <NavigateBeforeIcon />
        </IconButton>
        <IconButton onClick={() => {setFormPage(Math.min(formPage+1, Math.floor(forms.length/10)))}}>
          <NavigateNextIcon />
        </IconButton>
      </GridItem>
    </Grid>
  )
}

export default FormViewGrid;