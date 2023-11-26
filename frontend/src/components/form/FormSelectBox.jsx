import {
  Grid
} from '@mui/material';

import { styled } from '@mui/material/styles'

const FormSelectBox  = styled(Grid, {
  shouldForwardProp: () => true
})(({theme}) => ({
  backgroundColor: theme.palette.primary.light,
  position: 'relative',
  top: '20%'
}))

export default FormSelectBox;