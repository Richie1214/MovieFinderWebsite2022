import React from 'react';
import axios from 'axios';

import { Avatar, Box, Button, Grid, Typography, IconButton, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import BACKEND_PORT from '../BACKEND_PORT';

const BanList = () => {
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

  const removeBanListItem = async (id) => {
    try {
      const config = {
        headers: {
          token: localStorage['token'],
        },
        data: {
          uid: localStorage['uid'],
          block_id: id
        }
      }
      await axios.delete(`http://localhost:${BACKEND_PORT}/banlist/remove`, config);
      setBanlist([...banlist.filter((b) => b.id !== id)]);
    } catch (errData) {
      console.log(errData);
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
    if (pageSize * (page + 2) >= banlist.length ) {
      setDisableNext(true);
    }
    setDisablePrev(false);
    setPage(page + 1);
  }

  const [disablePrev, setDisablePrev] = React.useState(true);
  const [disableNext, setDisableNext] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [banlist, setBanlist] = React.useState([]);
  const pageSize = 24;

  React.useEffect(() => {
    const getBanList = async () => {
      const config = {
        headers: {
          token: localStorage['token']
        }
      };
      const payload = {
        uid: localStorage['uid']
      };
      try {
        const res = await axios.post(`http://localhost:${BACKEND_PORT}/banlist/view`, payload, config);
        console.log(res.data);
        setBanlist([...res.data.banlist]);
      } catch (errData) {
        console.log(errData);
      }
    }
    getBanList();
    if (banlist.length > pageSize) setDisableNext(false);
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <ViewBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Grid container>
          {banlist.slice(page * pageSize, Math.min(pageSize * (page + 1), banlist.length)).map((user, key) => (
            <Grid Item xl="3" lg="4" sm="6" xs="12" key={user.id} sx={{ display: "flex", justifyContent: "center" }}>
              <ReviewBox sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar width='100px' />
                  <Typography variant="body" sx={{ p: 2 }}>{user.username}</Typography>
                </Box>
                <Button color="secondary" onClick={e => removeBanListItem(user.id)} variant="contained">Unban</Button>
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

export default BanList;
