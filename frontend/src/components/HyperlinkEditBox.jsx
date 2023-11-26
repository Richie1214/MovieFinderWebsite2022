
import {
  Grid,
  Paper,
  Chip,
  Typography
} from '@mui/material';

import GridListItem from './GridListItem';

import { deleteLink } from './reviews/helper';

const HyperlinkBox = ({ hyperlinks, setHyperlinks }) => {
  return (
    <GridListItem item xs={12}>
      <Grid container>
        <GridListItem item xs={3}>
          <Typography>
            Hyperlinks:
          </Typography>
        </GridListItem>
        <GridListItem item xs={8}>
          <Paper>
            {
              hyperlinks.map((link, idx) => {
                return (
                  <Chip
                    label={link}
                    onDelete={() => {deleteLink(idx, hyperlinks, setHyperlinks)}}
                    key={`self-{idx}`}
                  />
                )
              })
            }
          </Paper>
        </GridListItem>  
      </Grid>
    </GridListItem>
  )
}

export default HyperlinkBox;