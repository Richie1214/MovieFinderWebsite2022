import {
  Grid
} from '@mui/material'

import { styled } from '@mui/material/styles'

const MovieDetailBox = styled(Grid, {
  shouldForwardProp: () => true
})({
  justifyContent: 'center',
  textAlign: 'center'
});

export default MovieDetailBox;
