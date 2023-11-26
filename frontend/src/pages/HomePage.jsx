import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

import { Autocomplete, Box, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import MovieDetailBox from '../components/movie_detail/MovieDetailBox';
import MovieList from '../components/homepage/MovieList';

import BACKEND_PORT from '../BACKEND_PORT';

const HomePage = () => {
  const [keywords, setKeywords] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [popular, setPopular] = React.useState(null);
  const [top, setTop] = React.useState(null);
  const [promoted, setPromoted] = React.useState(null);
  const nav = useNavigate();
  
  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  const handleSearch = () => {
    console.log(keywords);
    nav(`/search?query=${keywords.split(' ').join('+')}`);
  }
  
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
    const fetchData = async () => {
      try {
        const payload = {
          keywords: keywords
        };
        const res = await axios.post(`http://localhost:${BACKEND_PORT}/search/suggestions`, payload);
        setSuggestions([...res.data]);
      } catch (errData) {
        console.log(errData);
      }
    }
    if (keywords === '') {
      setSuggestions([]);
      return;
    }
    fetchData();
  }, [keywords]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await axios.get(`http://localhost:${BACKEND_PORT}/movies/popular`);
        setPopular([...await pathToImg(res.data.results)]);
        res = await axios.get(`http://localhost:${BACKEND_PORT}/movies/top`);
        setTop([...await pathToImg(res.data.results)]);
      } catch (errData) {
        console.log(errData);
      }
    };
    fetchData();
  }, []);

  return (
    <MovieDetailBox>
      <Grid container justifyContent="center" sx={{ paddingTop: "30px" }}>
        <Grid item xs="9" lg="6">
          <Autocomplete
            sx={{ width: "100%" }}
            freeSolo
            disableClearable
            onChange={(e, data) => setKeywords(data)}
            options={suggestions.map((option) => option.name)}
            filterOptions={(options, state) => options}
            renderInput={(params) => 
              <TextField 
                {...params}
                placeholder="Search for a movie or genre"
                onChange={e => setKeywords(e.target.value)}
                onKeyDown={e => handleEnter(e)}
                color="secondary"
              />
            }
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box width="80%">
          <Typography variant="h3" sx={{ margin: 3 }}>Popular Movies</Typography>
          <MovieList movies={popular}/>
          <Typography variant="h3" sx={{ margin: 3 }}>Top Rated Movies</Typography>
          <MovieList movies={top}/>
          <Typography variant="h3" sx={{ margin: 3 }}>Promoted Movies</Typography>
          <MovieList movies={promoted}/>
        </Box>
      </Box>
    </MovieDetailBox>
  )
}

export default HomePage;