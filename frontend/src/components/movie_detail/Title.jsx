import {
  Typography,
  Box
} from '@mui/material';

import { styled } from '@mui/material/styles'

const Section = styled(Box, {
  shouldForwardProp: () => true
})(({theme}) => ({
  marginTop: '20px',
  backgroundColor: theme.palette.primary.light,
  marginBottom: '20px'
}));

const Title = ({ section }) => {
  return (
    <Section >
      <Typography variant="h3">
        {section} 
      </Typography>
    </Section>
  )
}

export default Title;