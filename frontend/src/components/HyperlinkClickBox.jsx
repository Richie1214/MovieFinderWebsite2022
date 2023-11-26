import {
  Grid,
  Paper,
  Chip,
} from '@mui/material';

import GridItem from "./GridItem";
import { handleHyp } from './helper';

const HyperlinkClickBox = ({ review }) => {
  return (
    <GridItem item xs={12}>
      <Grid container>
        <GridItem item xs={3}>
          Hyperlinks:
        </GridItem>
        <GridItem item xs={9}>
          <Paper>
            {/* <Chip label={'Hi'} onClick={() => handleHyp('google.com')} /> */}
            {
              review.hyperlinks.map((link, idx) => {
                return (
                  <Chip label={link} onClick={() => handleHyp(link)} key={`link-${review.uid}-${idx}`} />
                )
              })
            }
          </Paper>
        </GridItem>
      </Grid>
    </GridItem>
    
  )
}

export default HyperlinkClickBox;