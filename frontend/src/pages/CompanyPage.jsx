import React from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import { Avatar, Box, Button, Grid, Paper, Skeleton, Stack, Typography } from '@mui/material';

import BACKEND_PORT from '../BACKEND_PORT';
import EditModal from '../components/EditModal';
import DetailField from '../components/DetailField';
import CompanyMembers from '../components/company/CompanyMembers';
import CompanyPosts from '../components/company/CompanyPosts';
import PostModal from '../components/company/PostModal';
import PostPlaceHolder from '../components/company/PostPlaceholder';

const Input = styled('input')({
  display: 'none',
});

const CompanyPage = ({userType}) => {
  const ViewBox = styled(Paper, {})(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    width: '80%',
    padding: '10px',
    marginBottom: '20px',
    marginTop: '20px'
  }));

  const [postOpen, setPostOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState('');
  const [companyName, setCompanyName] = React.useState(null);
  const [companyImg, setCompanyImg] = React.useState('');
  const [companyInfo, setCompanyInfo] = React.useState(null);
  const [companyPosts, setCompanyPosts] = React.useState(null);
  const [companyMembers, setCompanyMembers] = React.useState([]);
  const location = useLocation();
  const pageOwner = parseInt(new URLSearchParams(location.search).get('id'));

  const handleEditImg = (e) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      setCompanyImg(reader.result);
      const data = {
        image_path: reader.result
      };
      const config = {
        headers: {
          token: localStorage['token']
        }
      };
      try {
        await axios.put(`http://localhost:${BACKEND_PORT}/company/image/edit`, data, config);
      } catch (errData) {
        console.log(errData);
      }
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  let ownProfile = false;
  if (pageOwner === parseInt(localStorage['cid'])) {
    ownProfile = true;
  }

  const handleModal = () => {
    setPostOpen(true);
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:${BACKEND_PORT}/company/details/view/${pageOwner}`);
      const data = res.data;
      setCompanyName(data.author);
      setCompanyInfo(data.info);
      setCompanyPosts([...data.posts]);
      setCompanyMembers([...data.members]);
      console.log(data);
    }
    fetchData();
  }, []);


  return (
    <Box sx={{ display:'flex', justifyContent: 'center', marginTop: 5}}>
      <Grid container direction="column" width="90%">
        { companyName === null
        ?
        <Stack spacing={1}>
          <Stack spacing={4} sx={{ display:'flex', alignItems: 'center' }}>
            <Skeleton variant="text" height={50} width={400}/>
            <Skeleton variant="circular" height={240} width={240}/>
            <Skeleton variant="rectangle" height={40} width={100}/>
          </Stack>
          <Skeleton variant="text" height={40} width={90}/>
          <Skeleton variant="text" height={20} width="100%"/>
          <Skeleton variant="text" height={20} width="100%"/>
          <Skeleton variant="text" height={20} width="100%"/>
          <Skeleton variant="text" height={40} width={200}/>
          <Skeleton variant="rectangle" height={40} width={80}/>
        </Stack>
        :
        <Grid container direction="row">
          <Grid item sx={{ textAlign: 'center', marginBottom: '20px', width: '100%' }}>  
            <Typography variant="h3">{companyName}</Typography>
          </Grid>
          <Grid item container direction="column">
            <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar sx={{ width: '200px', height: '200px' }} />
            </Grid>
            <Grid item sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px',  marginBottom: '20px' }}>
              <label htmlFor="contained-button-file">
                <Input onChange={handleEditImg} accept="image/*" id="contained-button-file" multiple type="file" />
                <Button variant="contained" component="span">
                  Upload
                </Button>
              </label>
            </Grid>
          </Grid>
        </Grid>}
        { companyName === null ||
        <DetailField
          field="Info"
          val={companyInfo || "No information to display."}
          setModalType={setModalType}
          isOwner={ownProfile}
          setOpen={setEditOpen}
          fieldVar="h4"
          valVar="h6"
        />}
        <Grid container item direction="column">
          { companyName === null ||
          <Grid item sx={{ marginTop: '20px',  marginBottom: '20px' }}>
            <Typography variant="h4">Company Posts</Typography>
          </Grid>}
          { companyName === null || (pageOwner === parseInt(localStorage.cid) &&
            <Grid item>
              <Button variant="contained" onClick={handleModal}>Create Post</Button>
            </Grid>
          )}
          <Grid item>
            {companyPosts === null 
              ? <PostPlaceHolder />
              : companyPosts.length > 0
              ? <CompanyPosts posts={companyPosts} count={4} owner={pageOwner} showAll={false}/>
              : <ViewBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  <Typography variant="h5">No posts to display.</Typography>
                </ViewBox>
            }
          </Grid>
        </Grid>
        <Grid container item direction="column">
          <Grid item>
            <Typography variant="h4">Company Members</Typography>
          </Grid>
          <Grid item>
            <CompanyMembers members={companyMembers} />
          </Grid>
        </Grid>
      </Grid>
      <EditModal
        open={editOpen}
        setOpen={setEditOpen}
        modalType={modalType}
        isOwner={ownProfile}
        setName={setCompanyName}
        setInfo={setCompanyInfo}
      />
      <PostModal
        open={postOpen}
        setOpen={setPostOpen}
        posts={companyPosts}
        setPosts={setCompanyPosts}
        author={companyName}
        edit={-1}
      />
    </Box>
  );
}

export default CompanyPage;