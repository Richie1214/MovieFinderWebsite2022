import {
  Box
} from '@mui/material';

import { styled } from '@mui/material/styles'

const Background = styled(Box, {
  shouldForwardProp: () => true
})(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  height: '100vh',
  overflowY: 'auto'
}))

export default Background;