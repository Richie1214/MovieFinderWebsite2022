import React from 'react';
import axios from 'axios';

import { useLocation } from 'react-router-dom';

import {
  Grid,
  Typography,
  Box
} from '@mui/material';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

import GridListItem from '../components/GridListItem';
import DataPresentation from '../components/analytics/DataPresentation';

import BACKEND_PORT from '../BACKEND_PORT';

import {form_data_from_arr, form_data_from_obj, form_data_from_arr_days} from '../components/analytics/helper';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, 
                 LinearScale, BarElement, Title);

const AnalyticsPage = ({userType}) => {

  const location = useLocation();
  const movieId = new URLSearchParams(location.search).get('id');
  const reviews = location.state.reviews;
  
  const [analytics, setAnalytics] = React.useState('');
  const [words, setWords] = React.useState({});
  const [ratings, setRatings] = React.useState({});
  const [enjoyment, setEnjoyment] = React.useState({});
  const [recommended, setRecommended] = React.useState({});
  const [discover, setDiscover] = React.useState({});
  const [platform, setPlatform] = React.useState({});
  const [reason, setReason] = React.useState({});
  const [days, setDays] = React.useState({});

  React.useEffect(() => {
    (async () => {
      if (userType !== '') {
        const res = await axios.get(`http://localhost:${BACKEND_PORT}/analytics`, {
          headers: {
            movie_id: movieId
          }
        })
        setAnalytics(res.data);
      }
    })();
  }, [userType])
  
  React.useEffect(() => {
    if (analytics !== '') {
      if (Object.keys(analytics.review_words).length !== 0) {
        // Create the array with the list of words
        const newData = form_data_from_obj(analytics.review_words, 'Key words');
        setWords(newData);
      }
      if (analytics.chatbot.length !== 0) {
        const newData = form_data_from_arr(analytics.chatbot, 'enjoyment',
                                           'Proportion of people who enjoyed the movie',);
        setEnjoyment(newData);
      }
      if (reviews.length !== 0) {
        const newData = form_data_from_arr(reviews, 'rating', '');
        setRatings(newData);
      }
      if (reviews.length !== 0) {
        const newData = form_data_from_arr(analytics.chatbot, 'recommended', 'Recommended');
        setRecommended(newData);
      }
      if (reviews.length !== 0) {
        const newData = form_data_from_arr(analytics.chatbot, 'discover',
                                           'Where people initially heard about the film');
        setDiscover(newData);
      }
      if (reviews.length !== 0) {
        const newData = form_data_from_arr(analytics.chatbot, 'platform',
                                           'Which platform did the user watch the movie on');
        setPlatform(newData);
      }
      if (reviews.length !== 0) {
        const newData = form_data_from_arr(analytics.chatbot, 'reason',
                                           'Which platform did the user watch the movie on');
        setReason(newData);
        console.log(newData);
      }
      if (reviews.length !== 0) {
        const newData = form_data_from_arr_days(analytics.chatbot,
                                           'When did the user watch the movie');
        setDays(newData);
      }
    }
  }, [analytics])

  return (
    (analytics !== '' && Object.keys(analytics.review_words).length === 0 &&
     analytics.chatbot.length === 0) ? (
      <Grid container>
        <GridListItem item xs={3} />
        <GridListItem item xs={6}>
          <Typography>
            No one has used the chat bot or posted a review yet.
          </Typography>
        </GridListItem>
      </Grid>
    ) : (analytics !== '') && (
      <Grid container>
        <GridListItem item xs={12} sm={6} lg={4}>
          <DataPresentation
            title="Top words used in reviews"
            data={words}
            reviewBased={true}
            type='doughnut'
          />
        </GridListItem>
        <GridListItem item xs={12} sm={6} lg={4}>
          <DataPresentation
            title="People who enjoyed the movie"
            data={enjoyment}
            reviewBased={false}
            type='doughnut'
          />
        </GridListItem>
        <GridListItem item xs={12} sm={6} lg={4}>
          <DataPresentation
            title="Rating distribution"
            data={ratings}
            reviewBased={true}
            type='doughnut'
          />
        </GridListItem>
        <GridListItem item xs={12} sm={6} lg={4}>
          <DataPresentation
            title="Number of recommendations"
            data={recommended}
            reviewBased={false}
            type='doughnut'
          />
        </GridListItem>
        <GridListItem item xs={12} sm={6} lg={4}>
          <DataPresentation
            title="Where people first heard about this film"
            data={discover}
            reviewBased={false}
            type='doughnut'
          />
        </GridListItem>
        <GridListItem item xs={12} sm={6} lg={4}>
          <DataPresentation
            title="Where people watched this movie"
            data={platform}
            reviewBased={false}
            type='doughnut'
          />
        </GridListItem>
        <GridListItem item xs={12} sm={6} lg={4}>
          <DataPresentation
            title="Why people watched this movie"
            data={reason}
            reviewBased={false}
            type='doughnut'
          />
        </GridListItem>
        <GridListItem item xs={12} sm={6} lg={4}>
          <DataPresentation
            title="When users watched the movie after it's release"
            data={days}
            reviewBased={false}
            type='doughnut'
          />
        </GridListItem>
      </Grid>
    )
  )
}

export default AnalyticsPage;