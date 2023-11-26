import React from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';

import { styled } from '@mui/material/styles';
import { Autocomplete, Box, Grid, IconButton, Paper, Skeleton, Stack, TextField, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import MovieList from '../components/homepage/MovieList';

import BACKEND_PORT from '../BACKEND_PORT';

const ViewBox = styled(Paper, {})(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: '80%',
  padding: '10px',
  marginBottom: '20px',
  marginTop: '20px'
}));

const SearchResults = () => {
  const [page, setPage] = React.useState(0);
  const [disablePrev, setDisablePrev] = React.useState(true);
  const [disableNext, setDisableNext] = React.useState(true);
  const [keywords, setKeywords] = React.useState('');
  const [results, setResults] = React.useState(null);
  const [numRes, setNumRes] = React.useState(null);
  const [maxPage, setMaxPage] = React.useState(0);
  const [suggestions, setSuggestions] = React.useState([]);
  const [searchWords, setSearchWords] = React.useState('');
  
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const queryString = query.split('+').join(' ');
  const nav = useNavigate();

  const prevPage = () => {
    console.log(page);
    setResults(null);
    if (page - 1 === 0) {
      setDisablePrev(true);
    }
    setDisableNext(false);
    setPage(page - 1);
  }

  const nextPage = () => {
    console.log(page + 1);
    console.log(maxPage - 1);
    setResults(null);
    setDisablePrev(false);
    if (page + 1 === maxPage - 1) {
      setDisableNext(true);
    }
    setPage(page + 1);
  }

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e.target.value);
    }
  }

  const handleSearch = () => {
    nav(`/search?query=${searchWords.split(' ').join('+')}`);
    setKeywords(searchWords);
    setPage(0);
    setDisablePrev(true);
    setResults(null);
  }

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
            keywords: query,
            page: page + 1
        };
        const res = await axios.post(`http://localhost:${BACKEND_PORT}/search/results`, payload);
        const data = res.data;
        for (const m of data.results) {
          if (m.poster_path === null) {
            m.img = "";
            continue;
          }
          const url = `https://image.tmdb.org/t/p/w500${m.poster_path}`;
          const data2 = await fetch(url, {
            method: "GET"
          });
          const imageBlob = await data2.blob();
          m.img = URL.createObjectURL(imageBlob);
        }
        setResults([...data.results]);
        setMaxPage(data.total_pages);
        setNumRes(data.total_results);
        if (data.total_results > 20 && page === 0) {
          setDisableNext(false);
        }
      } catch (errData) {
        console.log(errData);
      }
    }
    fetchData();
  }, [keywords, page]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          keywords: searchWords
        };
        const res = await axios.post(`http://localhost:${BACKEND_PORT}/search/suggestions`, payload);
        setSuggestions([...res.data]);
      } catch (errData) {
        console.log(errData);
      }
    }
    if (searchWords === '') {
      setSuggestions([]);
      return;
    }
    fetchData();
  }, [searchWords]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Grid container justifyContent="center" sx={{ paddingTop: "30px" }}>
          <Grid item xs="9" lg="6">
            <Autocomplete
              sx={{ width: "100%" }}
              freeSolo
              disableClearable
              onChange={(e, data) => setSearchWords(data)}
              options={suggestions.map((option) => option.name)}
              filterOptions={(options, state) => options}
              defaultValue={queryString}
              renderInput={(params) => 
                <TextField
                  {...params}
                  placeholder="Search for a movie or genre"
                  color="secondary"
                  onKeyDown={e => handleEnter(e)}
                  onChange={e => setSearchWords(e.target.value)}
                />
              }
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Box width="80%">
            {results === null
            ? <Stack spacing={1} direction="row" justifyContent='center' sx={{ margin: 3 }}>
                <Skeleton variant="text" width={50} height={50} />
                <Skeleton variant="text" width={150} height={50} />
              </Stack>
            : <Typography variant="h4" sx={{ margin: 3, textAlign: 'center' }}>{numRes} results</Typography>}
            <MovieList movies={results} />
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <IconButton disabled={disablePrev} onClick={prevPage}>
            <NavigateBeforeIcon color="secondary" />
          </IconButton>
          <IconButton disabled={disableNext} onClick={nextPage}>
            <NavigateNextIcon color="secondary" />
          </IconButton>
        </Box>
    </Box>
  );
}

export default SearchResults;
