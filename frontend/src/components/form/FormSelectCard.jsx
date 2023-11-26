import {
  Card
} from '@mui/material';

import { styled } from '@mui/material/styles';

const FormSelectCard = styled(Card, {})(({theme}) => ({
  backgroundColor: theme.palette.secondary.light,
  width: '70%',
  textAlign: 'center'
}));

export default FormSelectCard;