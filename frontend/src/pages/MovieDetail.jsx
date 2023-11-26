import React from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import {
  Grid,
  Button,
  Paper,
  Typography,
  Box
} from '@mui/material'

import axios from 'axios';

import GridItem from '../components/GridItem';
import GridListItem from '../components/GridListItem';

import MovieDetailBox from '../components/movie_detail/MovieDetailBox';
import MovieImageBox from '../components/movie_detail/MovieImageBox';
import ChatBotBox from '../components/movie_detail/ChatBotBox';

import Title from '../components/movie_detail/Title';

import SectionCollapsible from '../components/movie_detail/SectionCollapsible';
import SectionNonCollapsible from '../components/movie_detail/SectionNonCollapsible';

import ReviewsBox from '../components/reviews/ReviewsBox';
import MovieList from '../components/homepage/MovieList';

import BACKEND_PORT from '../BACKEND_PORT';

const MovieDetail = ({ loggedIn, userType }) => {
  const nav = useNavigate();
  
  const location = useLocation();
  const movieId = new URLSearchParams(location.search).get('id');
  
  const [movieDet, setMovieDet] = React.useState(null);
  const [reviews, setReviews] = React.useState([]);
  const [ownReview, setOwnReview] = React.useState(null);
  const [overallRating, setOverallRating] = React.useState(0);
  const [movieImg, setMovieImg] = React.useState(null);
  const [onWishList, setOnWishList] = React.useState(null);
  const [similarMovies, setSimilarMovies] = React.useState(null);
  const [chatBotAnswered, setChatBotAnswered] = React.useState(true);

  const pathToImg = async (movies) => {
    for (const m of movies) {
      if (m.poster_path === null) {
        m.img = "";
        continue;
      }
      const url = `https://image.tmdb.org/t/p/w500${m.poster_path}`
      const data2 = await fetch(url, {
        method: "GET"
      });
      const imageBlob = await data2.blob();
      m.img = URL.createObjectURL(imageBlob);
    }
    return movies;
  }

  React.useEffect(() => {
    if (userType !== '') {
      const fetchData = async () => {
        try {
          const res = await axios.get(`http://localhost:${BACKEND_PORT}/moviedetails`, {
            headers: {
              'Movieid': movieId,
              'uid': localStorage['uid']
            }
          });
          let data = res.data;
          // Change the release date to DD/MM/YYYY format.
          let releaseDate = data.release_date; 
          // let releaseDate = movies.results[0].release_date;
          releaseDate = ((releaseDate.split('-')).reverse()).join('/');
          data.release_date = releaseDate;
          // Find the vote average.
          const summation = data.reviews.reduce((accumulator, review) => {
            return accumulator + review.rating;
          }, 0)
          // movies.results[0].vote_average /= 2
          data.vote_average = (data.reviews.length !== 0) ? (summation/data.reviews.length).toFixed(1):
                                                            "No reviews yet";
          setOverallRating(data.vote_average);
          // Extract all of the reviews into reviews and ownReview
          if (loggedIn) {
            // Find your own review.
            for (let i = 0; i < data.reviews.length; i++) {
              // Find matching email.
              if (localStorage['email'] === data.reviews[i]['email']) {
                // Extract this review out.
                setOwnReview(data.reviews[i]);
                // Remove this review from reviews...
                data.reviews.splice(i, 1);
                break;
              }
            }
          }
          setReviews([...(data.reviews)]);
          
          // Next, we must obtain the images from the movie.
          // https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg
          let url = `https://image.tmdb.org/t/p/w500${data.poster_path}`
          let data2 = await fetch(url, {
            method: "GET"
          });
          const imageBlob = await data2.blob();
          const imageObjectURL = URL.createObjectURL(imageBlob)
          setMovieImg(imageObjectURL);
          setMovieDet(data);
          
          // Here, check if the user has already answered the chat bot.
          const res3 = await axios.get(`http://localhost:${BACKEND_PORT}/chatbot_answered`,{
            headers: {
              'movie_id': movieId,
              'uid': localStorage['uid']
            }
          });
          setChatBotAnswered(res3.data['chatbot']);
          
          // Here, we also need to obtain information about the wishlist.
          if (loggedIn) {
            const payload = {
              uid: localStorage['uid']
            };
            const config = {
              headers: {
                token: localStorage['token']
              }
            };
            const res2 = await axios.post(`http://localhost:${BACKEND_PORT}/wishlist/all`, payload, config);
            const wishlist = res2.data.wishlist;
            // Check if the current movieId is in the wishlist.
            if (wishlist.some(mov => mov.id === movieId)) {
              setOnWishList(true);
            } else {
              setOnWishList(false);
            }
            
          }
        } catch (errData) {
          console.log(errData)
        }
  
        try {
          const res = await axios.get(`http://localhost:${BACKEND_PORT}/movies/suggested`, {
            headers: {
              movie_id: movieId,
              user_id: localStorage['uid'],
              genre: false,
              director: false
            }
          });
          setSimilarMovies([... await pathToImg(res.data.movies)]);
        } catch (errData) {
          console.log(errData);
        }
      }
      fetchData();
    }
  }, [userType]);
 
  React.useEffect(() => {
    // Need to set overall rating...
    // Extract ratings from reviews, and ownReview
    let totalRev = reviews;
    if (ownReview !== null) {
      totalRev = totalRev.concat(ownReview);
    }
    const summation = totalRev.reduce((accumulator, review) => {
      return accumulator + review.rating;
    }, 0);
    (totalRev.length) ? setOverallRating(summation/totalRev.length) : setOverallRating("No reviews yet");
  }, [ownReview])
  
  const add_to_wishlist = async () => {
    try {
      const val = await axios.post(`http://localhost:${BACKEND_PORT}/wishlist/add`, {
          'movie_id': movieId,
          'date_added': new Date()
        },{
        headers: {
          'token': localStorage['token']
        }
      })
      setOnWishList(true);
    } catch (errData) {
      console.log(errData);
    }
  }
  
  const remove_from_wishlist = async () => {
    try {
      const val = await axios.delete(`http://localhost:${BACKEND_PORT}/wishlist/remove`, {
        data: {
          'movie_id': movieId
        },
        headers: {
          'token': localStorage['token']
        }
      })
      setOnWishList(false);
    } catch (errData) {
      console.log(errData);
    }
  }

  return (
    <MovieDetailBox container>
      <Grid item xs={12}>
        {
          (movieDet) &&
          <Grid container>
            <GridItem item xs={12}>
              <Title section={movieDet.title}/>
            </GridItem>
            {/*
              I will consider the state of whether the user has added or not added to a wishlist.
              I still need to check if the movie is on the user's wishlist
            */}
            <GridItem item xs={1} />
            <GridItem item xs={5}>
              <Grid container>
                <GridListItem item xs={12}>
                  {/**
                    Note: I have to do onWishList === true, since onWishList === null
                    and doing !onWishList, where onWishList is null gives true, which will
                    show add to wishlist temporarily, even if the user has already added
                    the movie to their wishlist.
                  */}
                  {
                    (loggedIn) && (onWishList === true) ? (
                      <Button variant="contained" color="error" onClick={() => {remove_from_wishlist()}}>
                        Remove from wishlist
                      </Button>
                    ) : (onWishList === false) && (
                      <Button variant="contained" color="success" onClick={() => {add_to_wishlist()}}>
                        Add to wishlist
                      </Button>
                    )
                  }
                </GridListItem>
                {
                  (userType === 'company') && (
                    <GridListItem item xs={12}>
                      <Button
                        variant="contained"
                        onClick={() => {nav(`/moviedetail/analytics?id=${movieId}`, {state: {reviews: reviews}})}}
                      >
                        Movie Analytics
                      </Button>
                    </GridListItem>
                  )
                }
                <GridItem item xs={12}>
                  <SectionNonCollapsible left="Date released:" right={movieDet.release_date} />
                </GridItem>
                <GridItem item xs={12}>
                  {
                    (ownReview !== null) ? (
                      <SectionNonCollapsible left="Rating:" right={overallRating} length={movieDet.reviews.length + 1} />
                    ) : (
                      <SectionNonCollapsible left="Rating:" right={overallRating} length={movieDet.reviews.length} />
                    )
                  }
                  
                </GridItem>
                <GridItem item xs={12}>
                  <SectionCollapsible section='Synopsis' desc={movieDet.overview}/>
                </GridItem>
              </Grid> 
            </GridItem>
            <Grid item xs={5}>
              <MovieImageBox src={movieImg}/>
            </Grid>
            <GridItem item xs={2}/>
            <GridItem item xs={8}>
              <SectionCollapsible section='Producers' desc={movieDet.production_companies}/>
            </GridItem>
            <GridItem item xs={2} />
            <GridItem item xs={2} />
            <GridItem item xs={8}>
              <SectionCollapsible section='Cast' desc={movieDet.cast} />
            </GridItem>
            <GridItem item xs={2}/>
            <GridItem item xs={2} />
            <GridItem item xs={8}>
              <ReviewsBox
                loggedIn={loggedIn}
                reviews={reviews}
                setReviews={setReviews}
                ownReview={ownReview}
                setOwnReview={setOwnReview}
                movieId={movieId}
                userType={userType}
                similarMovies={similarMovies}
              />
            </GridItem>
            <GridItem item xs={12}>
              <Typography variant="h4">Similar Movies</Typography>
            </GridItem>
            <GridItem item xs={12}>
              {
                (similarMovies !== null) && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box width="80%">
                      <MovieList movies={similarMovies} />
                    </Box>
                  </Box>
                )
              }
            </GridItem>
            {
              (!chatBotAnswered && userType !== 'company') && (
                <ChatBotBox
                  movieName={movieDet.title}
                  movieId={movieId}
                  releaseDate={movieDet.release_date}
                  setChatBotAnswered={setChatBotAnswered}
                />
              )
            }
          </Grid>
        }
      </Grid>
    </MovieDetailBox>
  );
}

// Clickable element, on click, passes query into URL (will be a movie id). Then call backend with movie id to get it's
// details. 

export default MovieDetail;