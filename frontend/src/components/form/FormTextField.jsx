
import {
  TextField
} from '@mui/material';

import { styled } from '@mui/material/styles';

const FormTextFieldComp = styled(TextField, {
  shouldForwardProp: () => true
})(({theme}) => ({
  width: '50%'
}));

const FormTextField = ({label, setVal, helperText, defaultValue}) => {
  return (
    <FormTextFieldComp
      label={label}
      multiline
      color="secondary"
      onChange={(e) => setVal(e.target.value)}
      helperText={helperText}
      defaultValue={defaultValue}
    />
  )
}

export default FormTextField;