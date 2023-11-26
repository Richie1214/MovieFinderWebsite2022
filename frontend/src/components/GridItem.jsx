import {
  Grid,
} from '@mui/material';

import { styled } from '@mui/material/styles';

const GridItem = styled(Grid, {
  shouldForwardProp: () => true
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}))

export default GridItem;
