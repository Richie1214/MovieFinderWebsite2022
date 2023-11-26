
import {
  Accordion
} from '@mui/material'

import { styled } from '@mui/material/styles'

const CollapsibleAccordion = styled(Accordion, {
  shouldForwardProp: () => true
})(({theme}) => ({
  backgroundColor: theme.palette.secondary.light,
  width: '100%',
  marginBottom: '20px'
}))

export default CollapsibleAccordion;