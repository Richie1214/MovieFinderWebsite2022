
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const SelectCompany = ({company, handleCompany, companies}) => {
  console.log(company)
  return (
    <FormControl color="secondary" sx={{width: '50%'}}>
      <InputLabel id="company-select">Company Affiliation</InputLabel>
      <Select
        labelId="company-select"
        defaultValue=""
        value={company}
        label="Company"
        onChange={handleCompany}
      >
        {
          companies.map((obj, idx) => {
            console.log(obj);
            return (
              <MenuItem value={obj} key={`company-${idx}`}>{obj['name']}</MenuItem>
            )
          })
        }
      </Select>
    </FormControl>
  )
}

export default SelectCompany;