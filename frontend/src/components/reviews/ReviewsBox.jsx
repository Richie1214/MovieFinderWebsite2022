import React from 'react';
import axios from 'axios';

import {
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid
} from '@mui/material'

import CollapsibleAccordion from "../CollapsibleAccordion";
import GridItem from '../GridItem';
import WriteReviewBox from './WriteReviewBox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ViewReviewBox from './ViewReviewBox';
import ReviewCard from './ReviewCard';
import ReviewBox from './ReviewBox'
import EditBox from './EditBox';

import BACKEND_PORT from '../../BACKEND_PORT';

const ReviewsBox = ({ loggedIn, reviews, setReviews, ownReview, setOwnReview, movieId, userType, similarMovies }) => {
  // const [reviews, setReviews] = React.useState([]);
  // const [ownReview, setOwnReview] = React.useState(null);
  const [edit, setEdit] = React.useState(false);

  // const [companyRep, setCompanyRep] = React.useState(false);
  // const [verifReviewer, setVerifReviewer] = React.useState(false);
  const [limit, setLimit] = React.useState(false);
  
  // Obtain whether the user has reached their limit, are a verified reviewer, or are 
  // a company representative.
  React.useEffect(() => {
    if (similarMovies !== null) {
      (async () => {
        //Obtain information about the user: verif reviewer or company rep
        if (loggedIn) {
          const res = await axios.get(`http://localhost:${BACKEND_PORT}/review/userdetails`, {
            headers: {
              'token': localStorage['token'],
              'uid': localStorage['uid'],
              'username': localStorage['username']
            }
          });
          const userDetail = res.data;
          setLimit(userDetail['limit_reached']);
          // setVerifReviewer(userDetail['verified']);
          // setCompanyRep(userDetail['company']);
        }
      })();
    }
    return () => {
    };
  }, [similarMovies]);

  return (
    <CollapsibleAccordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography>
          Reviews
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <GridItem item xs={12}>
            {
              (reviews.length > 0) ? (
                <ViewReviewBox reviews={reviews} setReviews={setReviews} ownProfile={false}/>
              ) : (
                <ReviewBox sx={{marginBottom: '20px'}}>
                  <Typography>
                    No reviews yet
                  </Typography>
                </ReviewBox>
              )
            }
          </GridItem>
            <GridItem item xs={12}>
              {
                (!loggedIn) ? (
                  <ReviewBox>
                    <Typography>
                      Log in to write a review!
                    </Typography>
                  </ReviewBox>
                ) : (ownReview === null && !(userType === 'company')) ? (
                  <WriteReviewBox
                    movieId={movieId}
                    loggedIn={loggedIn}
                    setOwnReview={setOwnReview}
                    limit={limit}
                    verifReviewer={(userType === 'reviewer') ? true : false}
                    userType={userType}
                  />
                ) : (ownReview !== null && !edit) ? (
                    <ReviewCard
                      review={ownReview}
                      edit={edit}
                      setEdit={setEdit}
                      isOwnReview={true}
                      setOwnReview={setOwnReview}
                    />  
                ) : (ownReview !== null && edit) ? (
                  <EditBox
                    ownReview={ownReview}
                    setOwnReview={setOwnReview}
                    setEdit={setEdit}
                    userType={userType}
                  />
                ) : <></>
              }
            </GridItem>
          

          {/*
            Below is the declaration for the box for writing your review
          */}


        </Grid>
      </AccordionDetails>
    </CollapsibleAccordion>
  )
}

export default ReviewsBox;