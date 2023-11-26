import {
  Grid,
} from '@mui/material';

import { styled } from '@mui/material/styles';

const GridListItem = styled(Grid, {
  shouldForwardProp: () => true
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: '20px'
}))

export default GridListItem;
  