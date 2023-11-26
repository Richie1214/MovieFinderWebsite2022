import {
  Box,
  Button,
  Grid,
  Typography
} from '@mui/material';

import { styled } from '@mui/material/styles';

import GridItem from './GridItem';

import { string, func } from 'prop-types';

const ConfirmBox = styled(Box, {
})(({theme}) => ({
  position: 'absolute',
  left: '35%',
  top: '35%',
  width: '30%',
  height: '30%',
  backgroundColor: theme.palette.secondary.main
}))

const questionStyle = {
  marginBottom: '20px'
}

const ConfirmModal = ({ question, cancelOp, confirmOp }) => {
  return (
    <ConfirmBox>
      <Grid container>
        <GridItem item xs={12} sx={questionStyle}>
          <Typography variant="h5">
            {question}
          </Typography>
        </GridItem>
        <GridItem item xs={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={cancelOp}
          >
            Cancel
          </Button>
        </GridItem>
        <GridItem item xs={6}>
          <Button
            color="error"
            variant="contained"
            onClick={confirmOp}
          >
            Confirm
          </Button>
        </GridItem>
      </Grid>
    </ConfirmBox>
  )
}

export default ConfirmModal;
