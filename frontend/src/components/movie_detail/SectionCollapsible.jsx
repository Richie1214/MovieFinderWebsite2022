
import {
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import CollapsibleAccordion from '../CollapsibleAccordion';

const SectionCollapsible = ({ section, desc }) => {
  // if (Array.isArray(desc)) {
  //   desc = desc.join(', ');
  // }
  if (Array.isArray(desc)) {
    desc = desc.map((val) => {
      return val.name;
    });
    desc = desc.join(', ');
  }

  return (
    <CollapsibleAccordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography>
          {section}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          {desc}
          {/* {
            (!Array.isArray(desc)) ? desc : (
              desc.map((d, idx) => {
                return (
                  <Typography>
                    {d.name}
                  </Typography>
                )
              })
            )
          } */}
        </Typography>
      </AccordionDetails>
    </CollapsibleAccordion>
  )
}

export default SectionCollapsible;