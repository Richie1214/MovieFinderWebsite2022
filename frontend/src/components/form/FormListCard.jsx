import {
  Card,
  CardActionArea,
  Grid,
  Typography,
  CardContent
} from '@mui/material';

import GridItem from '../GridItem';

import { styled } from '@mui/material/styles';

const FormListCardStyle = styled(Card, {
  shouldForwardProp: () => true
})(({theme}) => ({
  width: '90%',
  marginBottom: '20px'
}))

const FormListCard = ({ form, setForm, setIndex, setOpenModal, setFormType, formType, idx }) => {
  
  const setSelected = () => {
    setForm(form);
    setIndex(idx);
    setOpenModal(true);
    setFormType(formType);
  }
  
  return (
    <FormListCardStyle>
      <CardActionArea value={form} onClick={() => {setSelected()}}>
        <CardContent>
          <Grid container>
            <GridItem item xs={4}>
              <Typography>
                {form['username']}
              </Typography>
            </GridItem>
            <GridItem item xs={4}>
              <Typography>
                {form['date']}
              </Typography>
            </GridItem>
            <GridItem item xs={4}>
              <Typography>
                {form['status']}
              </Typography>
            </GridItem>
          </Grid>
        </CardContent>
      </CardActionArea>
    </FormListCardStyle>
  )
}

export default FormListCard;