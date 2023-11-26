
import {
  AccordionSummary,
  AccordionDetails,
  Card,
  Typography
} from '@mui/material'

import { styled } from '@mui/material/styles';

const CardStyle = styled(Card, {
  shouldForwardProp: () => true
})(({theme}) => ({
  marginBottom: '10px',
  padding: '5px'
}))

const ChatBotText = ({text}) => {
  
  return (
    <CardStyle>
      {text}
    </CardStyle>
  )
}

export default ChatBotText;
