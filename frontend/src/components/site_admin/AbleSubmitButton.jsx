
import {
  Typography,
  Button
} from '@mui/material';

import GridListItem from '../GridListItem';

const AbleSubmitButton = ({subFunction}) => {
  return (
    <GridListItem item xs={12}>
      <Typography variant="h5">
        Able to submit: 
      </Typography>
      <Button
        variant="contained"
        onClick={() => {subFunction()}}
      >
        Submit
      </Button>
    </GridListItem>
  )
}

export default AbleSubmitButton;