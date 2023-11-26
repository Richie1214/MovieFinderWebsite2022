import React from 'react';

import {
  Typography,
  Paper,
  Grid,
  Box
} from '@mui/material';

import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

import GridItem from '../GridItem';

import { styled } from '@mui/material/styles'

const Section = styled(Paper, {
  shouldForwardProp: () => true
})(({theme}) => ({
  backgroundColor: theme.palette.primary.light,
  marginBottom: '20px',
  padding: '10px',
  width: '100%'
}));

const SectionNonCollapsible = ({ left, right, length }) => {
  // Check if right is alphanumeric
  const [rightVal, setRightVal] = React.useState(null);
  const [rightIsNumber, setRightIsNumber] = React.useState(false);
  
  const isNumber = (val) => {
    if (!Number.isNaN(+val)) {
      setRightIsNumber(true);
    } else {
      setRightIsNumber(false);
    }
  }
  
  React.useEffect(() => {
    // take decimal part of rightVal, and if this is 0-0.49, round to 0.
    // else, if this is 0.5-0.99, round to 0.5.
    setRightVal(right);
    const dec = rightVal - Math.floor(rightVal);
    if (dec < 0.5) {
      setRightVal(Math.round(rightVal));
    } else {
      setRightVal(Math.floor(rightVal) + 0.5)
    }
    isNumber(right);
  }, [right])
  
  const obtainRatingStars = () => {
    const ratingArr = []
    const dec = right - Math.floor(right);
    const rightVal = (dec < 0.5) ? Math.floor(right) : Math.floor(right) + 0.5;
    for (let i = 0; i < Math.floor(rightVal); i++) {
      ratingArr.push(1);
    }
    // Add on a 0.5 if the rating included a .5
    if (rightVal - ratingArr.length === 0.5) {
      ratingArr.push(0.5);
    }
    // Then append empty stars until the end of the array.
    for (let i = ratingArr.length; i < 5; i++) {
      ratingArr.push(0);
    }
    
    return (
      <GridItem item xs={6}>
        <Grid container>
          <GridItem item xs={6}>
            <Typography variant="h6">
              {Math.round(right * 10) / 10}/5
            </Typography>
          </GridItem>
          <GridItem item xs={6}>
            <Grid container>
              <GridItem item xs={12}>
                {
                  ratingArr.map((number, index) => {
                    if (number === 1) {
                      return (
                        <StarIcon fontSize="small" key={`overall-rating-${index}`}/>
                      )
                    } else if (number == 0.5) {
                      return (
                        <StarHalfIcon fontSize="small" key={`overall-rating-${index}`}/>
                      )
                    } else {
                      return (
                        <StarOutlineIcon fontSize="small" key={`overall-rating-${index}`}/>
                      )
                    }
        
                  })
                }
              </GridItem>
              <GridItem item xs={12}>
                ({length} {(length === 1) ? 'review' : 'reviews'})
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      </GridItem>
    )
  }
  
  return (
    <Section>
      <Grid container>
        <GridItem item xs={6}>
          <Typography variant="h5">
            {left}      
          </Typography>
        </GridItem>
        {
          (!rightIsNumber) ? (
            <GridItem item xs={6}>
              <Typography variant="h5">
               {right}     
              </Typography>
            </GridItem>
          ) : (
            obtainRatingStars()
          )
        }

      </Grid>
    </Section>
  )
}

export default SectionNonCollapsible;