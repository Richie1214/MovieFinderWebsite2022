import React from 'react';

import { Avatar, Box, Grid, IconButton, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const CompanyMembers = (props) => {
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
    if (pageSize * (page + 2) >= props.members.length ) {
      setDisableNext(true);
    }
    setDisablePrev(false);
    setPage(page + 1);
  }

  const [disablePrev, setDisablePrev] = React.useState(true);
  const [disableNext, setDisableNext] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const pageSize = 24;

  console.log(props.members);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <ViewBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Grid container>
          {props.members.slice(page * pageSize, Math.min(pageSize * (page + 1), props.members.length)).map((user) => (
            <Grid Item xl="3" lg="4" sm="6" xs="12" key={user.id} sx={{ display: "flex", justifyContent: "center" }}>
              <ReviewBox sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar width='100px' />
                  <Typography variant="body" sx={{ p: 2 }}>{user.username}</Typography>
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

export default CompanyMembers;
