
import React from 'react';

import {
  Paper,
  Typography,
  Grid,
  IconButton,
  Alert,
  Snackbar,
  Button,
  Chip
} from '@mui/material';

import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';


import axios from 'axios';

import GridItem from '../GridItem';
import GridListItem from '../GridListItem';
import ContentBox from './ContentBox';
import ClickableStars from './ClickableStars';
import AddHyperlinkModal from '../AddHyperlinkModal';

import ReviewBox from './ReviewBox';
import HyperlinkEditBox from '../HyperlinkEditBox';

import BACKEND_PORT from '../../BACKEND_PORT';
import { getDateString, closeToast } from '../helper';

const WriteReviewBox = ({ movieId, loggedIn, setOwnReview, limit, verifReviewer, userType }) => {
  const [rating, setRating] = React.useState(0);
  const [ratingArr, setRatingArr] = React.useState([]);
  const [openToast, setOpenToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [content, setContent] = React.useState('');
  
  const [hyperlinkModal, setHyperlinkModal] = React.useState(false);
  const [hyperlinks, setHyperlinks] = React.useState([]);

  React.useEffect(() => {
    const newRatingArr = []
    for (let i = 0; i < rating; i++) {
      newRatingArr.push(1);
    }
    for (let i = newRatingArr.length; i < 5; i++) {
      newRatingArr.push(0);
    }
    setRatingArr(newRatingArr);
  }, [rating])

  const submitReview = async () => {
    // First, check that a rating has been left.
    if (rating === 0) {
      // Toast an error.
      setToastMessage('Please give a star rating.');
      setOpenToast(true);
      return;
    } else if (limit) {
      setToastMessage('Daily review limit reached.');
      setOpenToast(true);
      return;
    }
    const dateString = getDateString();
    // Send the review to the backend.
    try{
      const res = await axios.post(`http://localhost:${BACKEND_PORT}/review/add`, 
        {
          'uid': localStorage['uid'],
          'content': content,
          'movie_id': movieId,
          'rating': rating,
          'date': dateString,
          'verified': false,
          'hyperlinks': hyperlinks
        },
        {
          headers: {
          'token': localStorage['token']
          }
        }
      )
      let data = res.data;
      let ownReview = {
        'content': content,
        'date': dateString,
        'movieId': movieId,
        'rating': rating,
        'email': localStorage['email'],
        'username': localStorage['username'],
        'uid': localStorage['uid'],
        'review_id': data['review_id'],
        'hyperlinks': hyperlinks,
        'verified': (userType === 'reviewer') ? true : false
      }
      setOwnReview(ownReview);
    } catch (errData) {
      setToastMessage(errData.response.data.message);
      setOpenToast(true);
    }
  }
  
  const closeToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  }

  return (
    <ReviewBox>
      <Grid container>
        <GridItem item xs={12}>
          <Typography variant="h5">
            Write your review
          </Typography>
        </GridItem>
        <GridItem item xs={6}>
          <Typography variant="h6">
            Leave a rating:
          </Typography>
        </GridItem>
        <ClickableStars setRating={setRating} ratingArr={ratingArr} />
        <GridListItem item xs={12}>
          <ContentBox
            multiline
            color="info"
            label="Written review (optional)"
            onChange={e => setContent(e.target.value)}
          />
        </GridListItem>
        {
          (userType === 'reviewer') && (
            <GridItem item xs={12}>
              <Grid container>
                <HyperlinkEditBox
                  hyperlinks={hyperlinks}
                  setHyperlinks={setHyperlinks}
                />
                <GridItem item xs={4}>
                  <Button
                    onClick={() => {setHyperlinkModal(true)}}
                    variant="contained"
                  >
                    Add Hyperlinks
                  </Button>
                </GridItem>
              </Grid>
            </GridItem>
          )
        }
        <GridItem item xs={10} />
        <GridItem item xs={2}>
          <IconButton onClick={() => {submitReview()}}>
            <ArrowCircleUpIcon fontSize="large"/>
          </IconButton>
        </GridItem>
      </Grid>
      <Snackbar open={openToast} autoHideDuration={6000} onClose={(e, r) => {closeToast(e, r, setOpenToast)}}>
        <Alert onClose={(e, r) => {closeToast(e, r, setOpenToast)}} severity="error" >
          {toastMessage}
        </Alert>
      </Snackbar>
      <AddHyperlinkModal
        hyperlinkModal={hyperlinkModal}
        setHyperlinkModal={setHyperlinkModal}
        hyperlinks={hyperlinks}
        setHyperlinks={setHyperlinks}
        isOwnProfile={false}
      />
    </ReviewBox>
  )
}

export default WriteReviewBox;