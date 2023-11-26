
import {
  Accordion
} from '@mui/material'

import { styled } from '@mui/material/styles'

const CollapsibleAccordionAbsolute = styled(Accordion, {
  shouldForwardProp: () => true
})(({theme}) => ({
  backgroundColor: theme.palette.secondary.light,
  width: '20%',
  marginBottom: '20px',
  padding: '5px',
  position: 'absolute',
  right: '2%',
  bottom: '0%',
}))

export default CollapsibleAccordionAbsolute;