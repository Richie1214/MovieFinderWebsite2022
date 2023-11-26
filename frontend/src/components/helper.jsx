
import React from 'react';
import axios from 'axios';

import BACKEND_PORT from '../BACKEND_PORT';

const closeToast = (event, reason, setOpenToast) => {
  if (reason === 'clickaway') {
    return;
  }
  setOpenToast(false);
}

const closeModal = (event, reason, setOpenModal) => {
  if (reason === 'clickaway') {
    return;
  }
  setOpenModal(false);
}

const handleHyp = (link) => {
  if (link.indexOf('http://') !== 0 || link.indexOf('https://') !== 0) {
    // Add https:// onto the beginning...
    link = 'https://' + link;
  }
  window.open(link, '_blank', 'noopener,noreferrer');
}

const getDateString = () => {
  const currDate = new Date();
  const dateString = (currDate.getDate().toString()).padStart(2, '0') + '/' + 
                     ((currDate.getMonth() + 1).toString()).padStart(2, '0') + '/' +
                     ((currDate.getFullYear()).toString()) + ' ' +
                     ((currDate.getHours()).toString()).padStart(2, '0') + ':' +
                     ((currDate.getMinutes()).toString()).padStart(2, '0');
  return dateString;
}

const getUserType = async (loggedIn, setUserType) => {
  if (loggedIn) {
    try{
      const res = await axios.get(`http://localhost:${BACKEND_PORT}/usertype`, {
        headers: {
          'token': localStorage['token'],
          'uid': localStorage['uid']
        }
      });
      const data = res.data;
      setUserType(data.type);
    } catch (errData) {
      console.log(errData);
    }
  }
}

export { closeToast, closeModal, handleHyp, getDateString, getUserType }