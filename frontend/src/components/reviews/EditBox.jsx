
import React from 'react';

import {
  Grid,
  Typography,
  Button,
  Snackbar,
  Alert,
  Paper,
  Chip
} from '@mui/material';

import axios from 'axios';

import BACKEND_PORT from '../../BACKEND_PORT';

import GridItem from '../GridItem';
import ClickableStars from './ClickableStars';
import ContentBox from './ContentBox';
import ReviewBox from './ReviewBox';
import AddHyperlinkModal from '../AddHyperlinkModal';
import GridListItem from '../GridListItem';

import HyperlinkEditBox from '../HyperlinkEditBox';

import { closeToast } from '../helper';

const EditBox = ({ownReview, setOwnReview, setEdit, userType}) => {
  
  const [rating, setRating] = React.useState(ownReview.rating);
  const [ratingArr, setRatingArr] = React.useState([]);
  const [content, setContent] = React.useState(ownReview.content);
  const [openToast, setOpenToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  
  const [hyperlinkModal, setHyperlinkModal] = React.useState(false);
  const [hyperlinks, setHyperlinks] = React.useState([]);

  React.useEffect(() => {
    // Update hyperlinks.
    const newHyperlinks = [...(ownReview.hyperlinks)];
    setHyperlinks(newHyperlinks);
  }, [])
  
  const edit_confirm = async () => {
    let newReview = {...ownReview};
    newReview.rating = rating;
    newReview.content = content;
    newReview.hyperlinks = hyperlinks;
    newReview.edited = true;
    // Send axios request to backend.
    // Then setOwnReview.
    try {
      const res = await axios.put(`http://localhost:${BACKEND_PORT}/review/edit`,
        {
          'uid': newReview.uid,
          'review_id': newReview.review_id,
          'content': newReview.content,
          'rating': newReview.rating,
          'hyperlinks': newReview.hyperlinks
        }, {
          headers: {
            'token': localStorage['token']
          }
        } 
      )
      setOwnReview(newReview);
      setEdit(false);
    } catch (errData) {
      setToastMessage(errData.response.data.message);
      setOpenToast(true);
    }
  }
  
  React.useEffect(() => {
    const newRatingArr = [];
    for (let i = 0; i < rating; i++) {
      newRatingArr.push(1);
    }
    for (let i = newRatingArr.length; i < 5; i++) {
      newRatingArr.push(0);
    }
    setRatingArr(newRatingArr);
  }, [rating])
  
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
            Edit your review
          </Typography>
        </GridItem>
        <GridItem item xs={12}>
          <Typography variant="h6">
            Original post date: {ownReview.date}
          </Typography>
        </GridItem>
        <GridItem item xs={6}>
          <Typography variant="h6">
            Leave a rating:
          </Typography>
        </GridItem>
        <ClickableStars setRating={setRating} ratingArr={ratingArr} />
        <GridItem item xs={12}>
          <ContentBox 
            multiline
            color="info"
            label="Written review (optional)"
            onChange={e => setContent(e.target.value)}
            defaultValue={content}
          />
        </GridItem>
        {
          (userType === 'reviewer') && (
            <GridListItem item xs={12}>
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
            </GridListItem>
          )
        }
        <GridItem item xs={12}>
          <Grid container>
            <GridItem item xs={6}>
              <Button
                variant="contained"
                color="error"
                onClick={() => {setEdit(false)}}
              >
                Cancel
              </Button>
            </GridItem>
            <GridItem item xs={6}>
              <Button
                variant="contained"
                color="success"
                onClick={() => {edit_confirm()}}
              >
                Confirm
              </Button>
            </GridItem>
          </Grid>
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

export default EditBox;