import {
  Grid
} from '@mui/material';

import { styled } from '@mui/material/styles';

const InputBox = styled(Grid, {
  shouldForwardProp: () => true
})(({theme}) => ({
  width: '50%'
}))

export default InputBox;