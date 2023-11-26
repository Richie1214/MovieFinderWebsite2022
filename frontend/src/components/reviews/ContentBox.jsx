
import {
  TextField
} from '@mui/material';

import { styled } from '@mui/material/styles';

const ContentBox = styled(TextField, {
  shouldForwardProp: () => true
})(({ theme }) => ({
  width: '100%'
}))

export default ContentBox;