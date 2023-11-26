import {
  Grid,
  Typography,
  Card
} from '@mui/material';

import GridListItem from '../GridListItem';

import {
  Doughnut,
  Bar
} from 'react-chartjs-2';

// title == title of graph
// data == the data to be presented
// reviewBased == if the data is based on reviews or if not, chatbot
const DataPresentation = ({title, data, reviewBased, type}) => {
  
  return (
    <Grid container sx={{}}>
      <GridListItem item xs={12}>
        <Typography variant="h5" align="center">
          {title}
        </Typography>
      </GridListItem>
      <GridListItem item xs={2} />
      {
        (Object.keys(data).length > 0) ? (
          <GridListItem item xs={8}>
            {
              (type === 'doughnut') ? (
                <Doughnut data={data} />
              ) : (
                <Bar data={data} />
              )
            }
          </GridListItem>
        ) : (
          <GridListItem item xs={8}>
            {
              (reviewBased) ? (
                <Typography>
                  No reviews yet
                </Typography>
              ) : (
                <Typography align="center">
                  No chatbot answers for this section yet
                </Typography>
              )
            }

          </GridListItem>
        )
      }
    </Grid>
  )
}

export default DataPresentation;