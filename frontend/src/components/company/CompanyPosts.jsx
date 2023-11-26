import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Avatar, Box, Button, Divider, Grid, IconButton, Paper, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

import PageNavigation from '../PageNavigation';

import BACKEND_PORT from '../../BACKEND_PORT';

const CompanyPosts = (props) => {
  const [page, setPage] = React.useState(0);
  const nav = useNavigate();

  const Anchor = styled('a')({
    textDecoration: 'none',
  });

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
    marginBottom: '10px',
    marginTop: '10px'
  }));

  const showAllPosts = () => {
    nav(`/company/posts?id=${props.owner}`)
  }

  const handleEditPost = (id) => {
    props.setEdit(id);
    props.setOpen(true);
  }

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:${BACKEND_PORT}/company/post/delete/${id}`);
      const updatedPosts = props.posts.filter(p => p.id !== id);
      props.setPosts([...updatedPosts]);
    } catch (errData) {
      console.log(errData);
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <ViewBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Grid container>
          {props.posts.slice(page * props.count, Math.min(props.posts.length, (page + 1) * props.count)).map((post) => (
            <Grid item container direction="column" key={post.id}>
              <ReviewBox>
                <Grid container direction="column">
                  <Grid item container spacing={2} sx={{ alignItems: 'center' }}>
                    <Grid item>
                      <Anchor href={`/company?id=${post.cid}`}>
                        <Avatar width='100px' />
                      </Anchor>
                    </Grid>
                    <Grid item>
                      <Anchor href={`/company?id=${post.cid}`}>
                        <Typography variant="h5">{post.author}</Typography>
                      </Anchor>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Divider sx={{ p: 0.5 }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" sx={{ paddingTop: 0.5 }}>{post.title}</Typography>
                  </Grid>
                  <Grid item>
                    <div>{post.content}</div>
                  </Grid>
                    {props.showAll && props.owner === parseInt(localStorage.cid) &&
                      <Grid container item direction="row-reverse">
                        <Grid item>
                          <IconButton
                            color="error"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <DeleteIcon/>
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <IconButton
                            color="secondary"
                            onClick={() => handleEditPost(post.id)}
                          >
                            <EditIcon fontSize="medium"/>
                          </IconButton>
                        </Grid>
                      </Grid>
                    }
                </Grid>
              </ReviewBox>
            </Grid>
          ))}
          {props.showAll ?
            <Grid item sx={{ display: "flex", justifyContent: "center", width: '100%' }}>
              <PageNavigation page={page} setPage={setPage} itemCount={props.posts.length} pageSize={5}/>
            </Grid>
          :
            <Grid item sx={{ display: "flex", justifyContent: "center", width: '100%' }}>
              <Button
                color="secondary"
                variant="contained"
                onClick={showAllPosts}
                sx={{
                  marginBottom: '5px',
                  marginTop: '10px'
                }}
                >
                  View all
              </Button>
            </Grid>
          }
        </Grid>
      </ViewBox>
    </Box>
  );
}

export default CompanyPosts;
