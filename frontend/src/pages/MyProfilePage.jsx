import React from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

import { Alert, Divider, Grid, Avatar, Typography, Button, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';

import EditModal from '../components/EditModal';
import ViewReviewBox from '../components/reviews/ViewReviewBox';
import UserInfoBox from '../components/user_profile/UserInfoBox';
import SettingsModal from '../components/user_profile/SettingsModal';

import BACKEND_PORT from '../BACKEND_PORT';
import AddHyperlinkModal from '../components/AddHyperlinkModal';
import ProfilePlaceholder from '../components/user_profile/ProfilePlaceholder';

const Input = styled('input')({
  display: 'none',
});

const MyProfilePage = ({ loggedIn, setLoggedIn, userType }) => {
  const [open, setOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState('');
  const [fullname, setFullname] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [userImg, setUserImg] = React.useState(false);
  const [reviews, setReviews] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [banned, setBanned] = React.useState(false);
  const [verified, setVerified] = React.useState(false);
  const [hyperlinks, setHyperlinks] = React.useState([]);
  const [hyperlinkModal, setHyperlinkModal] = React.useState(false);
  const [openToast, setOpenToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  
  const location = useLocation();
  const pageOwner = parseInt(new URLSearchParams(location.search).get('id'));

  let ownProfile = false;
  if (pageOwner === parseInt(localStorage['uid'])) {
    ownProfile = true;
  }

  const handleEditUsername = () => {
    setOpen(true);
    setModalType('username');
  }

  const handleEditEmail = () => {
    setOpen(true);
    setModalType('email');
  }

  const handleEditBio = () => {
    setOpen(true);
    setModalType('bio');
  }

  const handleEditGender = () => {
    setOpen(true);
    setModalType('gender');
  }

  const handleEditFullname = () => {
    setOpen(true);
    setModalType('name');
  }

  const getErrMsg = (err) => {
    const msg = err.response.data.message;
    return msg.slice(3, msg.length - 4);
  }

  const closeToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  }

  const handleBanlist = async (id, toBan) => {
    try {
      const payload = {
        uid: localStorage['uid'],
        block_id: id
      };
      const config = {
        headers: {
          token: localStorage['token']
        }
      };
      if (toBan) {
        await axios.post(`http://localhost:${BACKEND_PORT}/banlist/add`, payload, config);
        setBanned(true);
      } else {
        await axios.delete(`http://localhost:${BACKEND_PORT}/banlist/remove`, payload, config);
        setBanned(false);
      }
    } catch (errData) {
      console.log(errData);
    }
  }

  const handleEditImg = (e) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const data = { id: localStorage.uid, img: reader.result };
      console.log(data);
      const config = { headers: { token: localStorage['token'] }};
      try {
        await axios.put(`http://localhost:${BACKEND_PORT}/profile/edit/profilepic`, data, config);
        setUserImg(true);
      } catch (errData) {
        setToastMessage(getErrMsg(errData))
        setOpenToast(true);
      }
    }
    reader.readAsDataURL(e.target.files[0])
  }
  
  React.useEffect(() => {
    const fetchData = async () => {

        try {
          let config = {
            headers: {
              uid: pageOwner
            }
          };
          const res = await axios.get(`http://localhost:${BACKEND_PORT}/profile/view`, config);
          const data = res.data;
          setUsername(data['account']['username']);
          setEmail(data['account']['email']);
          setBio(data['account']['bio']);
          setHyperlinks(data['account']['hyperlinks'])
          setFullname(data['account']['name']);
          setGender(data['account']['gender']);
          setUserImg(data['img']);
          setReviews([...data['reviews']]);
          if (data['verified']) {
            setVerified(true);
          }
        } catch (errData) {
          console.log(errData);
        }
        
  
        if (loggedIn) {
          try {
            const config = {
              headers: {
                token: localStorage['token']
              }
            };
            const payload = {
              uid: localStorage['uid']
            };
            const res = await axios.post(`http://localhost:${BACKEND_PORT}/banlist/view`, payload, config);
            if (res.data.banlist.some(user => user.id === pageOwner)) {
              setBanned(true);
            } else {
              setBanned(false);
            }
          } catch (errData) {
            console.log(errData);
          }
        }
  
      }

    fetchData();
  }, []);

  return (
    <div>
      {username === ''
      ?<ProfilePlaceholder />
      :<Grid container direction="column" spacing={4}>
        <Grid item>
          <Grid
            container
            spacing={3}
            sx={{ p: 3 }}
          >
            <Grid item md={2} sm={4}>
              <Grid container direction="column" spacing={3}>
                <Grid container item alignItems="center" direction="column">
                  <Grid item>
                    <Avatar sx={{ width: "150px", height: "150px" }} src={userImg ? require(`../images/profile/${localStorage.uid}.png`) : require('../images/default.png')} />
                  </Grid>
                  {ownProfile &&
                    <Grid item sx={{ marginTop: "20px" }}>
                      <label htmlFor="contained-button-file">
                        <Input onChange={handleEditImg} accept="image/*" id="contained-button-file" multiple type="file" />
                        <Button variant="contained" component="span">
                          Upload
                        </Button>
                      </label>
                    </Grid>
                  }
                </Grid>
                <UserInfoBox isOwnProfile={ownProfile} infoType="Username" info={username} handleEdit={handleEditUsername} />
                <UserInfoBox isOwnProfile={ownProfile} infoType="Email" info={email} handleEdit={handleEditEmail} />
                <UserInfoBox isOwnProfile={ownProfile} infoType="Name" info={fullname} handleEdit={handleEditFullname} />
                <UserInfoBox isOwnProfile={ownProfile} infoType="Gender" info={gender} handleEdit={handleEditGender} />
                <UserInfoBox isOwnProfile={ownProfile} infoType="Bio" info={bio} handleEdit={handleEditBio} />
                {
                  (userType === 'reviewer') && (
                    <UserInfoBox isOwnProfile={ownProfile} infoType="Hyperlinks" info={hyperlinks} handleEdit={() => setHyperlinkModal(true)} />
                  )
                }
                
                {ownProfile
                  ? <Grid item>
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => {setOpenModal(true)}}
                      >
                        Settings
                      </Button>
                    </Grid>
                  : <Grid item container direction="column" spacing={3}>
                      <Grid item>
                        <Button component={Link} to={`/wishlist?id=${pageOwner}`} color="secondary" variant="contained">Wishlist</Button>
                      </Grid>
                      { 
                        (loggedIn) && (banned === true) ? (
                          <Grid item>
                            <Button
                              color="success"
                              variant="contained"
                              onClick={() => handleBanlist(pageOwner, false)}
                            >
                              Unban
                            </Button>
                          </Grid>
                        ) : (banned === false) && (
                          <Grid item>
                            <Button
                              color="error"
                              variant="contained"
                              onClick={() => handleBanlist(pageOwner, true)}
                            >
                              Ban
                            </Button>
                          </Grid>
                        )
                      }
                    </Grid>
                }
              </Grid>
            </Grid>
            <Grid item sm={1}>
              <Divider orientation="vertical" />
            </Grid>
            <Grid item container direction="column" md={9} sm={7} spacing={3} alignItems="center">
              <Grid item>
                <Typography variant="h4">
                  Reviews
                </Typography>
              </Grid>
              <Grid item>
                <ViewReviewBox reviews={reviews} setReviews={setReviews} ownProfile={ownProfile} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>}
      <SettingsModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        setLoggedIn={setLoggedIn}
        userType={userType}
      />
      <EditModal
        open={open}
        setOpen={setOpen}
        modalType={modalType.charAt(0).toUpperCase() + modalType.slice(1)}
        setUsername={setUsername}
        setEmail={setEmail}
        setBio={setBio}
        setFullname={setFullname}
        setGender={setGender}
        gender={gender}
      />
      <AddHyperlinkModal
        hyperlinks={hyperlinks}
        setHyperlinks={setHyperlinks}
        hyperlinkModal={hyperlinkModal}
        setHyperlinkModal={setHyperlinkModal}
        isOwnProfile={true}
      />
      <Snackbar open={openToast} autoHideDuration={6000} onClose={closeToast}>
        <Alert onClose={closeToast} severity="error" >
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default MyProfilePage;
