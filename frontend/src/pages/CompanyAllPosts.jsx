import React from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";

import { Box, Button, Grid, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import CompanyPosts from "../components/company/CompanyPosts";
import PostModal from '../components/company/PostModal';
import PostPlaceHolder from '../components/company/PostPlaceholder';

import BACKEND_PORT from '../BACKEND_PORT';

const ViewBox = styled(Paper, {})(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: '80%',
  padding: '10px',
  marginBottom: '20px',
  marginTop: '20px'
}));

const CompanyAllPosts = ({userType}) => {
  const [companyPosts, setCompanyPosts] = React.useState(null);
  const [companyName, setCompanyName] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const location = useLocation();
  const pageOwner = parseInt(new URLSearchParams(location.search).get('id'));

  const handleModal = () => {
    setEdit(-1);
    setOpen(true);
  }

  React.useEffect(() => {
    if (userType !== '') {
      const fetchData = async () => {
        try {
          const res = await axios.get(`http://localhost:${BACKEND_PORT}/company/posts/${pageOwner}`);
          setCompanyPosts([...res.data.posts]);
          setCompanyName(res.data.author);
        } catch (errData) {
          console.log(errData);
        }
      }
      fetchData();
    }
  }, [userType]);

  return (
    <Box>
      { companyPosts === null
      ? <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Stack sx={{ width: '80%' }}>
            <Skeleton variant="text" height={40} width={400} />
            <Skeleton variant="rectangle" height={40} width={80}/>
          </Stack>
        </Box>
      : <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Grid container direction="column" spacing={1} sx={{ width: '80%' }}>
            <Grid item>
              <Typography variant="h4">Posts by {companyName}</Typography>
            </Grid>
            {pageOwner === parseInt(localStorage.cid) &&
              <Grid item>
                <Button variant="contained" onClick={handleModal}>Create Post</Button>
              </Grid>}
          </Grid>
        </Box>}
      {companyPosts === null
      ? <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <PostPlaceHolder />
        </Box>
      : companyPosts.length === 0
        ? <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ViewBox>
              <Typography variant="h5" textAlign="center">No posts to display.</Typography>
            </ViewBox>
          </Box>
      : <CompanyPosts 
          posts={companyPosts}
          setPosts={setCompanyPosts}
          setOpen={setOpen}
          count={5}
          owner={pageOwner}
          showAll={true}
          setEdit={setEdit}
        />}
      <PostModal
        open={open}
        setOpen={setOpen}
        posts={companyPosts}
        setPosts={setCompanyPosts}
        author={companyName}
        edit={edit}
      />
    </Box>
  );
}

export default CompanyAllPosts;
