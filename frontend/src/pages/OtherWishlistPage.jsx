import React from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';

import { Box, Grid, Typography, IconButton, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import BACKEND_PORT from '../BACKEND_PORT';

const OtherWishlistPage = () => {
  const [wishlist, setWishlist] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [disablePrev, setDisablePrev] = React.useState(true);
  const [disableNext, setDisableNext] = React.useState(true);
  const [username, setUsername] = React.useState('');
  const location = useLocation();
  const pageOwner = parseInt(new URLSearchParams(location.search).get('id'));
  
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
      const config = {
        headers: {
          uid: pageOwner
        }
      }
      try {
        const res = await axios.get(`http://localhost:${BACKEND_PORT}/wishlist/other`, config);
        const data = res.data;
        setUsername(data.username);
        for (const movie of data.wishlist) {
          const url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
          const x = await fetch(url);
          const imageBlob = await x.blob();
          movie.img = URL.createObjectURL(imageBlob);
        }
        setWishlist([...data.wishlist]);
        if (data.length > 4) setDisableNext(false);
      } catch (errData) {
        console.log(errData);
      }
    }
    fetchData();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 3 }}>
      <Typography variant="h4">
        {username}'s wishlist
      </Typography>
      <ViewBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Grid container direction="column" >
          {wishlist.slice(page * 4, Math.min(4 * (page + 1), wishlist.length)).map((movie, key) => (
            <Grid Item key={key} sx={{ display: "flex", justifyContent: "center" }}>
              <ReviewBox sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img src={movie.img} width='100px' />
                  <Typography variant="h5" sx={{ p: 2 }}>{movie.title}</Typography>
                </Box>
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

export default OtherWishlistPage;
