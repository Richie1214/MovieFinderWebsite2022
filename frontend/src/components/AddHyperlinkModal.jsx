
import React from 'react';
import axios from 'axios';

import {
  Modal,
  Grid,
  Typography,
  Paper,
  Chip,
  Button,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';

import { closeModal } from './helper';

import GridListItem from './GridListItem';
import ContentBox from './reviews/ContentBox';
import AdditionalContentModal from './reviews/AdditionalContentModal.jsx';

import CloseIcon from '@mui/icons-material/Close';

import { deleteLink } from './reviews/helper';

import GridItem from './GridItem';

import BACKEND_PORT from '../BACKEND_PORT';

import { closeToast } from './helper';

const AddHyperlinkModal = ({ hyperlinkModal, setHyperlinkModal, hyperlinks, setHyperlinks, isOwnProfile }) => {
  const [oldHyperlinks, setOldHyperlinks] = React.useState([]);
  const [newHyperlink, setNewHyperlink] = React.useState('');
  
  const [openToast, setOpenToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  
  React.useEffect(() => {
    const copyHyperlinks = [...hyperlinks];
    setOldHyperlinks(copyHyperlinks);
  }, [])
  
  const addHyperlink = (e) => {
    e.preventDefault();
    if (newHyperlink === '') {
      return;
    }
    const newHyperlinks = [...hyperlinks, newHyperlink];
    setHyperlinks(newHyperlinks);
    setNewHyperlink('');
  }
  
  const editHyperlinks = async () => {
    const config = { headers: { token: localStorage['token'] } };
    const data = { hyperlinks: hyperlinks }
    try {
      await axios.put(`http://localhost:${BACKEND_PORT}/profile/edit/hyperlinks`, data, config);
      setOldHyperlinks([...hyperlinks]);
      setHyperlinkModal(false);
    } catch (errData) {
      setToastMessage(errData.response.data.message);
      setOpenToast(true);
    }
  }
  
  const cancelEdit = () => {
    setHyperlinks([...oldHyperlinks]);
    setHyperlinkModal(false);
  }
  
  return (
    <Modal
      open={hyperlinkModal}
      onClose={(e, r) => closeModal(e, r, setHyperlinkModal)}
    >
      <>
        <AdditionalContentModal>
          <form onSubmit={addHyperlink}>
            <Grid container>
              <GridListItem item xs={11} />
              <GridListItem item xs={1}>
                <IconButton onClick={(e, r) => closeModal(e, r, setHyperlinkModal)}>
                  <CloseIcon />
                </IconButton>
              </GridListItem>
              <GridListItem item xs={12}>
                <Typography variant="h5">
                  Add Hyperlinks
                </Typography>
              </GridListItem>
              <GridListItem item xs={1}/>
              <GridListItem item xs={10}>
                <Paper>
                  {
                    hyperlinks.map((link, idx) => {
                      return (
                        <Chip
                          label={link}
                          onDelete={() => {deleteLink(idx, hyperlinks, setHyperlinks)}}
                          key={`link-${idx}`}
                        />
                      )
                    })
                  }
                </Paper>
              </GridListItem>
              <GridListItem item xs={1}/>
              <GridListItem item xs={3} />
              <GridListItem item xs={6}>
                <ContentBox
                  size="small"
                  variant="filled"
                  label="New Hyperlink"
                  color="info"
                  onChange={(e) => {setNewHyperlink(e.target.value)}}
                  value={newHyperlink}
                />
              </GridListItem>
              <GridListItem item xs={3}>
                <Button type="submit" variant="contained">
                  Add
                </Button>
              </GridListItem>
            </Grid>
          </form>
          {
            (isOwnProfile) && (
              <Grid container>
                <GridItem item xs={6}>
                  <Button
                    variant="contained"
                    onClick={() => editHyperlinks()}
                  >
                    Save
                  </Button>
                </GridItem>
                <GridItem item xs={6}>
                  <Button
                    variant="contained"
                    onClick={() => cancelEdit()}
                  >
                    Cancel
                  </Button>
                </GridItem>
              </Grid>
            )
          }
        </AdditionalContentModal>
        <Snackbar open={openToast} autoHideDuration={6000} onClose={(e, r) => {closeToast(e, r, setOpenToast)}}>
          <Alert onClose={(e, r) => closeToast(e, r, setOpenToast)} severity="error" >
            {toastMessage}
          </Alert>
        </Snackbar>
      </>
    </Modal>
  )
}

export default AddHyperlinkModal;