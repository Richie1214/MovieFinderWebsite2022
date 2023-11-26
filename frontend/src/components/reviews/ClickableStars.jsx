
import {
  IconButton,
} from '@mui/material';

import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

import GridItem from "../GridItem"

const ClickableStars = ({ setRating, ratingArr }) => {
  return (
    <GridItem item xs={6}>
      {
        ratingArr.map((number, index) => {
          if (number === 1) {
            return (
              <IconButton onClick={() => {setRating(index+1)}} key={`write-review-${index}`}>
                <StarIcon />
              </IconButton>
            )
            //Set a black star that is clickable,
            // and corresponds to that value. E.g. clicking
            // on 4th stars sets the rating to 4.
          } else {
            return (
              <IconButton onClick={() => {setRating(index+1)}} key={`write-review-${index}`}>
                <StarOutlineIcon />
              </IconButton>
            )
            // Set outline star that is clickable
          }
        })
      }
    </GridItem>
  )
}

export default ClickableStars