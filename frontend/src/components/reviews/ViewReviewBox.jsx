
import React from 'react';

import {
  Paper,
  Grid,
  IconButton,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl
} from '@mui/material';

import { styled } from '@mui/material/styles';

import ReviewCard from './ReviewCard';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import ReviewBox from './ReviewBox';

import GridItem from '../GridItem';

import {filterFunction} from './helper';

const ViewBox = styled(Paper, {})(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: '100%',
  padding: '10px',
  marginBottom: '20px'
}));

const ViewReviewBox = ({reviews, setReviews, ownProfile}) => {
  // const [reviews, setReviews] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [filter, setFilter] = React.useState('new');
  
  React.useEffect(() => {
    const filteredRev = filterFunction(filter, reviews);
    setReviews([...filteredRev]);
  }, [filter]);
  
  React.useEffect(() => {
    const newReviews = filterFunction('new', reviews);
    setReviews([...newReviews]);
  }, [])

  return (
    <ViewBox>
      <Grid container>
        <GridItem item xs={12}>
          <ReviewBox>
            <Grid container>
              <GridItem item xs={4}>
                Sort by:
              </GridItem>
              <GridItem item xs={8}>
                <FormControl>
                  <RadioGroup
                    row
                  >
                    <FormControlLabel
                      value="new"
                      control={<Radio color="secondary" />}
                      label="Newer reviews"
                      onClick={() => setFilter("new")}
                      checked={filter==="new"}
                    />
                    <FormControlLabel
                      value="old"
                      control={<Radio color="secondary" />}
                      label="Older reviews"
                      onClick={() => setFilter("old")}
                      checked={filter==="old"}
                    />
                    <FormControlLabel
                      value="high"
                      control={<Radio color="secondary" />}
                      label="High ratings first"
                      onClick={() => setFilter("high")}
                      checked={filter==="high"}
                    />
                    <FormControlLabel
                      value="low"
                      control={<Radio color="secondary" />}
                      label="Low ratings first"
                      onClick={() => setFilter("low")}
                      checked={filter==="low"}
                    />
                  </RadioGroup>
                </FormControl>
              </GridItem>
            </Grid>  
          </ReviewBox>
        </GridItem>
        <GridItem item xs={12}>
          <Grid container>
            {
              (reviews.slice(page*5, page*5 + 5)).map((review, index) => {
                return (
                  <GridItem item xs={12} key={`review-box-${index}`}>
                    <ReviewCard review={review} isOwnReview={false} ownProfile={ownProfile} />
                  </GridItem>
                )
              })
            }
          </Grid>
        </GridItem>
        <GridItem item xs={12}>
        {/**
          Show 5 reviews per page.
          The page variable will be the offset to start looking at the reviews.
        */}
          <IconButton onClick={() => {setPage(Math.max(0, page-1))}}>
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton onClick={() => {setPage(Math.min(page+1, Math.floor(reviews.length/5)))}}>
            <NavigateNextIcon />
          </IconButton>
        </GridItem>
      </Grid>
    </ViewBox>
  )
}

export default ViewReviewBox;