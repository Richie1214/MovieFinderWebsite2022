
import {
  Paper
} from '@mui/material';

import { styled } from '@mui/material/styles';

const ReviewBox = styled(Paper, {})(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  width: '100%',
  padding: '10px',
  marginBottom: '20px'
}));

export default ReviewBox;