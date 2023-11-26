import {
    Box,
  } from '@mui/material';

import { styled } from '@mui/material/styles';

const AdditionalContentModal = styled(Box, {})(({theme}) => ({
  backgroundColor: theme.palette.secondary.light,
  width: '50%',
  height: '50%',
  top: '25%',
  left: '25%',
  position: 'relative',
  border: '2px solid #000'
}));

export default AdditionalContentModal;