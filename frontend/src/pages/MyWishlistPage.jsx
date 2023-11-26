import React from 'react';
import axios from 'axios';

import { Box, Button, Grid, Typography, IconButton, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import BACKEND_PORT from '../BACKEND_PORT';

const MyWishlistPage = () => {
  const [wishlist, setWishlist] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [disablePrev, setDisablePrev] = React.useState(true);
  const [disableNext, setDisableNext] = React.useState(true);
  
  const ViewBox = styled(Paper, {})(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    width: '80%',
    padding: '10px',
    marginBottom: '20px',
    marginTop: '20px'
  }));

  const ReviewBox = styled(Paper, {})(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    width: '80%',
    padding: '10px',
    marginBottom: '20px',
    marginTop: '20px'
  }));

  const removeWishlistItem = async (id) => {
    try {
      const config = {
        data: {
          movie_id: id
        },
        headers: {
          'token': localStorage['token']
        }
      }
      await axios.delete(`http://localhost:${BACKEND_PORT}/wishlist/remove`, config);
      setWishlist([...wishlist.filter(movie => movie.id !== id)]);
    } catch (errData) {
      console.log(errData)
    }
  }

  const prevPage = () => {
    if (page - 1 === 0) {
      setDisablePrev(true);
    }
    setDisableNext(false);
    setPage(page - 1);
  }

  const nextPage = () => {
    if (4 * (page + 2) >= wishlist.length ) {
      setDisableNext(true);
    }
    setDisablePrev(false);
    setPage(page + 1);
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const payload = {
        uid: localStorage['uid']
      };
      const config = {
        headers: {
          token: localStorage['token']
        }
      };
      try {
        const res = await axios.post(`http://localhost:${BACKEND_PORT}/wishlist/all`, payload, config);
        const data = res.data.wishlist;
        for (let movie of data) {
          let url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          let data = await fetch(url);
          const imageBlob = await data.blob();
          movie.img = URL.createObjectURL(imageBlob);
        }
        setWishlist([...data]);
        if (data.length > 4) setDisableNext(false);
      } catch (errData) {
        console.log(errData);
      }
    }
    fetchData();
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <ViewBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Grid container direction="column" >
          {wishlist.slice(page * 4, Math.min(4 * (page + 1), wishlist.length)).map((movie, key) => (
            <Grid Item key={key} sx={{ display: "flex", justifyContent: "center" }}>
              <ReviewBox sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img src={movie.img} width='100px' />
                  <Typography variant="h5" sx={{ p: 2 }}>{movie.title}</Typography>
                </Box>
                <Button color="secondary" onClick={e => removeWishlistItem(movie.id)} variant="contained">Remove</Button>
              </ReviewBox>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton disabled={disablePrev} onClick={prevPage}>
            <NavigateBeforeIcon color="secondary" />
          </IconButton>
          <IconButton disabled={disableNext} onClick={nextPage}>
            <NavigateNextIcon color="secondary" />
          </IconButton>
        </Box>
      </ViewBox>
    </Box>
  );
}

export default MyWishlistPage;
