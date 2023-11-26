import React from 'react';
import axios from 'axios';

import { Avatar, Box, Grid, IconButton, Paper, Typography  } from '@mui/material';
import { styled } from '@mui/material/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import BACKEND_PORT from "../BACKEND_PORT";

const Anchor = styled('a')({
  textDecoration: 'none',
});

const Companies = (userType) => {
  const ViewBox = styled(Paper, {})(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    width: '80%',
    padding: '10px',
    marginBottom: '20px',
    marginTop: '20px'
  }));

  const ReviewBox = styled(Paper, {})(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
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
    if (pageSize * (page + 2) >= companies.length ) {
      setDisableNext(true);
    }
    setDisablePrev(false);
    setPage(page + 1);
  }

  const [companies, setCompanies] = React.useState([]);
  const [disablePrev, setDisablePrev] = React.useState(true);
  const [disableNext, setDisableNext] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const pageSize = 24;
  React.useEffect(() => {
    if (userType !== '') {
      const fetchData = async () => {
        try {
          const res = await axios.get(`http://localhost:${BACKEND_PORT}/companies/all`);
          const data = res.data;
          setCompanies([...data.companies]);
        } catch (errData) {
          console.log(errData);
        }
      }
      fetchData();
    }
  }, [userType]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <ViewBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Grid container>
          {companies.slice(page * pageSize, Math.min(pageSize * (page + 1), companies.length)).map((company) => (
            <Grid Item xl="3" lg="4" sm="6" xs="12" key={company.id} sx={{ display: "flex", justifyContent: "center" }}>
              <Anchor href={`/company?id=${company.id}`}>
                <ReviewBox sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Avatar width='100px' />
                  <Typography variant="body" sx={{ p: 2 }}>{company.name}</Typography>
                </ReviewBox>
              </Anchor>
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

export default Companies;
