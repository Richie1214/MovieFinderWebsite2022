import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = (props) => {
  const nav = useNavigate();
  const [searchWords, setSearchWords] = React.useState(props.keywords);

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  const handleSearch = () => {
    nav(`/search/${searchWords.split(' ').join('+')}`);
  }

  return (
    <TextField
      sx={{ width: "40%", margin: "50px" }}
      placeholder="Search for a movie or genre"
      autoComplete="off"
      variant="filled"
      onChange={e => setSearchWords(e.target.value)}
      onKeyDown={e => handleEnter(e)}
      InputProps={{
        endAdornment:
          <InputAdornment position="end">
            <IconButton
              onClick={handleSearch}
            >
              <SearchIcon/>
            </IconButton>
          </InputAdornment>,
      }}
    />
  );
}

export default SearchBar;
