import { Paper } from '@mui/material';

import { styled } from '@mui/material/styles';

const FormListPaper = styled(Paper, {
  shouldForwardProp: () => true
})(({theme}) => ({
  width: '90%',
  marginBottom: '20px'
}))

export default FormListPaper;