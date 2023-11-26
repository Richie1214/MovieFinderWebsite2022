import React from 'react';
import axios from 'axios';

import { Box, Modal, Grid, TextField, Button, Typography } from '@mui/material';

import BACKEND_PORT from '../../BACKEND_PORT';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'secondary.light',
  boxShadow: 24,
  p: 4
};

const PostModal = (props) => {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  
  const handleClose = () => {
    props.setOpen(false);
  }

  const handlePost = async () => {
    try {
      const body = {
        title: title,
        content: content,
        id: localStorage.cid,
      };
      const config = {
        headers: {
          token: localStorage.token
        }
      };
      const res = await axios.post(`http://localhost:${BACKEND_PORT}/company/post/add`, body, config);
      const posts = props.posts;
      posts.push({ title: title, content: content, id: res.data.id, author: props.author });
      console.log([...posts]);
      props.setPosts([...posts]);
    } catch (errData) {
      console.log(errData);
    }
  }

  const handleEdit = async () => {
    try {
      const body = {
        title: title,
        content: content,
        p_id: props.edit
      };
      const res = await axios.put(`http://localhost:${BACKEND_PORT}/company/post/edit`, body);
      const newPosts = props.posts.map((p) => {
        if (p.id === props.edit) {
          return {
            title: title,
            content: content,
            id: res.data.id,
            author: props.author
          };
        }
        return p;
      });
      props.setPosts([...newPosts]);
    } catch (errData) {
      console.log(errData);
    }
  }

  const handleSubmit = async () => {
    if (props.edit !== -1) {
      handleEdit();
    } else {
      handlePost();
    }
    props.setOpen(false);
  }

  return (
    <Box>
      <Modal
        open={props.open}
        onClose={handleClose}
      >
        <Grid 
          container 
          direction='column'
          justifyContent='center'
          sx={style}
        >
          <Grid item>
            {props.edit !== -1
              ? <Typography variant="h4" sx={{ p: 1 }}>Edit Post</Typography>
              : <Typography variant="h4" sx={{ p: 1 }}>Create Post</Typography>
            }
          </Grid>
          <Grid item sx={{ p: 1 }}>
            <TextField 
              sx={{ width: '100%' }}
              color="secondary"
              label="Title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item sx={{ p: 1 }}>
            <TextField 
              multiline
              rows={10}
              sx={{ width: '100%' }}
              color="secondary"
              label="Content"
              onChange={(e) => setContent(e.target.value)}
            />
          </Grid>
          <Grid item sx={{ display: 'flex', justifyContent: 'space-evenly', p: 1 }}>
            <Button
              onClick={handleClose}
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              size="large"
              variant="contained"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Modal>
    </Box>
  );
}

export default PostModal;
