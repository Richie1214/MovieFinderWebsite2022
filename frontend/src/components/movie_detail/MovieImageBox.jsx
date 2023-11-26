import {
  Paper
} from '@mui/material';

import { styled } from '@mui/material/styles';

const ImageBackground = styled(Paper, {})(({theme}) => ({
  backgroundColor: theme.palette.primary.light,
  marginBottom: '20px',
  objectFit: 'contain',
}))

const MovieImageBox = ({ src }) => {
  return (
    <ImageBackground elevation={0}>
      <img src={src} width='75%' height='75%'/>
    </ImageBackground>
  )
}

export default MovieImageBox;