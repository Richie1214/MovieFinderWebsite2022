
import React from 'react';

import { useNavigate } from 'react-router';

import {
  Paper,
  Grid,
  Link,
  Typography,
  IconButton,
  Modal,
  Snackbar,
  Alert,
  Box,
  Chip
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

import axios from 'axios';

import ReviewBox from './ReviewBox';
import GridItem from '../GridItem';
import ContentBox from './ContentBox';
import ConfirmModal from '../ConfirmModal';
import HyperlinkClickBox from '../HyperlinkClickBox';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { styled } from '@mui/material/styles';
import BACKEND_PORT from '../../BACKEND_PORT';

import { closeToast, handleHyp } from '../helper';

const Username = styled(Link, {
  shouldForwardProp: () => true
})(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textDecoration: 'underline'
}))

const generateStars = (number) => {
  const ratingArr = []
  
  for (let i = 0; i < number; i++) {
    ratingArr.push(1);
  }
  for (let i = ratingArr.length; i < 5; i++) {
    ratingArr.push(0);
  }
  
  return (
    <Grid>
      {
        ratingArr.map((number, index) => {
          if (number === 1) {
            return (
              <StarIcon key={`single-rating-${index}`}/>
            )
          } else {
            return (
              <StarOutlineIcon key={`single-rating-${index}`}/>
            )
          }
        })
      }
    </Grid>
  )
}

const ReviewCard = ({review, edit, setEdit, isOwnReview, setOwnReview, userType, ownProfile}) => {
  const nav = useNavigate();
  
  const [openModal, setOpenModal] = React.useState(false);
  const [openToast, setOpenToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');

  const closeModal = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenModal(false);
  }
  
  const delete_confirm = async () => {
    try {
      const config = {
        headers: {
          token: localStorage['token']
        },
        data: {
          review_id: review.review_id
        }
      }
      const res = await axios.delete(`http://localhost:${BACKEND_PORT}/review/delete`, config);
      // Successful, set own review to null
      setOwnReview(null);
      setToastMessage('Deleted your review.');
      setOpenToast(true);
    } catch (errData) {
      setToastMessage(errData.response.data.message);
      setOpenToast(true);
    }    
  }
  
  console.log(review.movie_name)
  
  return (
    <ReviewBox>
      <Grid container>
        <GridItem item xs={12}>
          {/*
            Will replace below once I have access to the backend. This will be an image.
          */}
          <Username href={`/profile/?id=${review.uid}`}>
            <AccountCircleIcon />
            <Typography>
              {review.username}
              {
                (review.verified) &&
                <CheckBoxIcon fontSize="small" />
              }
            </Typography>
          </Username>
        </GridItem>
        <GridItem item xs={6}>
          {/*
            Here, we will show the star reviews
          */}
          {generateStars(review.rating)}
        </GridItem>
        <GridItem item xs={6}>
          {/*
            Here, we will show the date
            Commented out code will be for when edited is considered
          */}
          Posted {review.date}
        </GridItem>
        <GridItem item xs={12}>
          {/*
            Here, we will show the content.
          */}
          {
            (review.content !== '') &&
            <ReviewBox elevation={7}>
              {review.content}
            </ReviewBox>
          }
        </GridItem>
        <GridItem item xs={9}/>
        <GridItem item xs={3}>
          {/**
            Here, we are checking if the review was edited. This will be done in a later
            sprint.
          */}
          {
            (review.edited) &&
            "(edited)"
          }
        </GridItem>

        {
          (review.verified) && (
            <HyperlinkClickBox
              review={review}
            />
          )
        }
        {
          (ownProfile) && (
            <GridItem item xs={12}>
              <Typography>
                Originally reviewed for: <Username href={`/moviedetail?id=${review.movieId}`}>{review.movie_name}</Username>
              </Typography>
            </GridItem>
          )
        }
        {
          (isOwnReview && !edit) &&
          <GridItem item xs={12}>
            <Grid container>
              <GridItem item xs={6}>
                <IconButton
                  color="secondary"
                  onClick={() => setEdit(true)}
                >
                  <EditIcon fontSize="medium"/>
                </IconButton>
              </GridItem>
              <GridItem item xs={6}>
                <IconButton
                  color="error"
                  onClick={() => setOpenModal(true)}
                >
                  <DeleteIcon/>
                </IconButton>
              </GridItem>
            </Grid>
          </GridItem>
        }
      </Grid>
      <Modal
        open={openModal}
        onClose={closeModal}
      >
        <Box>
          <ConfirmModal question={"Delete review?"} cancelOp={() => {setOpenModal(false)}} confirmOp={() => {delete_confirm()}}/>
        </Box>
      </Modal>
      <Snackbar open={openToast} autoHideDuration={6000} onClose={(e, r) => {closeToast(e, r, setOpenToast)}}>
        <Alert onClose={(e, r) => closeToast(e, r, setOpenToast)} severity="error" >
          {toastMessage}
        </Alert>
      </Snackbar>
    </ReviewBox>
  )
}

export default ReviewCard;