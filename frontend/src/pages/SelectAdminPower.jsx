
import {
  CardActionArea,
  CardContent,
  Grid,
  Typography
} from '@mui/material';

import { useNavigate } from 'react-router';

import FormSelectBox from '../components/form/FormSelectBox';
import FormSelectCard from '../components/form/FormSelectCard';
import GridListItem from '../components/GridListItem';
import GridItem from '../components/GridItem';

const SelectAdminPower = () => {

  const nav = useNavigate();

  return (
    <FormSelectBox container>
      <GridItem item xs={6}>
        <FormSelectCard>
          <CardActionArea onClick={() => {nav('/site_admin/manage')}}>
            <CardContent>
              <Grid container>
                <GridListItem item xs={12}>
                  <Typography variant="h5">
                    Manage Accounts
                  </Typography>
                </GridListItem>
                <GridListItem item xs={12}>
                  <Typography>
                    Directly promote users or revoke their privileges
                  </Typography>
                </GridListItem>
              </Grid>
            </CardContent>
          </CardActionArea>
        </FormSelectCard>
      </GridItem>
      <GridItem item xs={6}>
        <FormSelectCard>
          <CardActionArea onClick={() => {nav('/site_admin/forms')}}>
            <CardContent>
              <Grid container>
                <GridListItem item xs={12}>
                  <Typography variant="h5">
                    Verification forms
                  </Typography>
                </GridListItem>
                <GridListItem item xs={12}>
                  <Typography>
                    View the verification forms that users have sent in.
                  </Typography>
                </GridListItem>
              </Grid>
            </CardContent>
          </CardActionArea>
        </FormSelectCard>
      </GridItem>
    </FormSelectBox>
  )

}

export default SelectAdminPower;