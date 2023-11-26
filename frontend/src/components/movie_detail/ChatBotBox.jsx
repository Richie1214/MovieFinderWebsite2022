
import React from 'react';
import axios from 'axios';

import {
  AccordionSummary,
  AccordionDetails,
  Card,
  Typography,
  Box,
Button,
TextField,
Snackbar,
Alert
} from '@mui/material'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import CollapsibleAccordionAbsolute from './CollapsibleAccordionAbsolute';
import ChatBotText from './ChatBotText';

import { getDateString, closeToast } from '../helper';

import BACKEND_PORT from '../../BACKEND_PORT';

const ChatBotBox = ({movieName, movieId, releaseDate, setChatBotAnswered}) => {

const [openToast, setOpenToast] = React.useState(false);
const [toastMessage, setToastMessage] = React.useState('');

const [openBot, setOpenBot] = React.useState(false);
const [startingq, setStartingQ] = React.useState(false);
const [q1, setq1] = React.useState(false);
const [q2, setq2] = React.useState(false);
const [q3, setq3] = React.useState(false);
const [q4, setq4] = React.useState(false);
const [q5, setq5] = React.useState(false);
const [q6, setq6] = React.useState(false);
const [success, setSuccess] = React.useState(false);

const [answers, setAnswers] = React.useState([]);

const [enjoyment, setEnjoyment] = React.useState(false);
const [recommended, setRecommended] = React.useState(false);
const [discover, setDiscover] = React.useState('');
const [platform, setPlatform] = React.useState('Not watched');
const [reason, setReason] = React.useState('');
const [dateViewed, setDateViewed] = React.useState(new Date());


React.useEffect(() => {
if (openBot) {
    setAnswers(["No", "Yes"]);
      setStartingQ(true);
}
}, [openBot])

const buttonClick = (e) => {
  if (startingq) {
    if (e.target.value === "yes") {
      setStartingQ(false);
      setq1(true);
    } else {
      setStartingQ(false);
      setOpenBot(false);
      setAnswers([]);
      handleSubmit();
    }
  } else if (q1) {
    if (e.target.value === "yes") {
      setEnjoyment(true);
    } else {
      setEnjoyment(false);
    }
    setq1(false);
    setq2(true);
  } else if (q2) {
    if (e.target.value === "yes") {
      setRecommended(true);
    } else {
      setRecommended(false);
    }
    setq2(false);
    setq3(true);
    setAnswers(["Online","TV","Outdoor ad", 
                  "Friend", "Other"]);
  } else if (q3) {
    setDiscover(e.target.value);
    setq3(false);
    setq4(true);
    setAnswers(["Stream", "Pirate", "Theatres", "TV", "Other"]);
  } else if (q4) {
    setPlatform(e.target.value);
    setq4(false);
      setq5(true);
      setAnswers(["Forced", "Appealing", "Other"]);
  } else if (q5) {
      setReason(e.target.value);
      setq5(false);
      setq6(true);
      setAnswers([]);
  }
}

const handleRender = (params) => {
    let dateArray = params.inputProps.value.split("/");
    [dateArray[0], dateArray[1]] = [dateArray[1], dateArray[0]];
    params.inputProps.value = dateArray.join("/");
    return (
      <TextField
        color="info"
        {...params}
      />
    )
}

const handleSubmit = async () => {
  let data = {
      'uid': localStorage['uid'],
    'movie_id': movieId,
    'platform': platform,
    'date': getDateString()
  }

    // Take release date, split it and create a new date object
    if (platform !== "Not watched") {
      let newReleaseDate = releaseDate.split('/');
  	  const rel = new Date(parseInt(newReleaseDate[2]), parseInt(newReleaseDate[1]) - 1, parseInt(newReleaseDate[0]));
      // Create new object from dateviewed.
  	  const viewed = new Date(dateViewed.getFullYear(), dateViewed.getMonth(), dateViewed.getDate());
  	  // Make sure the date viewed is before or on the current date.
  	  const today = new Date()
  	  if (today.getTime() - viewed.getTime() < 0) {
  	    setToastMessage('View date cannot be in the future');
  	    setOpenToast(true);
  	    return;
  	  }
  	  const diff = viewed.getTime() - rel.getTime()
  	  if (diff < 0) {
        setToastMessage('View date cannot be before the release date');
  	    setOpenToast(true);
  	    return;
  	  }
  	  const days = Math.ceil(diff/(1000 * 3600 * 24));
  	  
  	  data['reason'] = reason;
  	  data['days_since_release'] = days;
      data['enjoyment'] = enjoyment;
    data['recommended'] = recommended;
    data['discover'] = discover;
    }
  
  try {
    await axios.post(`http://localhost:${BACKEND_PORT}/chatbot_answers`, data, {
      headers: {
        'token': localStorage['token']
      }
    });
    setq6(false);
    setSuccess(true);
  } catch (errData) {
    console.log(errData);
  }
}

React.useEffect(() => {
  if (success) {
    	setTimeout(() => {
  	    setChatBotAnswered(true);
  	  }, 5000)
  }
}, [success])

return (
  <CollapsibleAccordionAbsolute
    onClick={() => {setOpenBot(true)}}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
    >
      <Typography>
        Chat bot
      </Typography>
    </AccordionSummary>
    <AccordionDetails sx={{height: '300px'}}>
      <ChatBotText
      text={"Hi there! I am a chat bot that collects information about a movie."}
      />
      {
        (startingq) && (
          <ChatBotText
            text={`Did you watch ${movieName}?`}
          />
        )
      }
      {
      (q1) && (
      <ChatBotText
      text={`1) Did you enjoy ${movieName}?`}
      />
      )
      }
      {
        (q2) && (
          <ChatBotText
            text={`2) Would you recommend ${movieName} to someone else?`}
          />
        )
      }
      {
        (q3) && (
          <ChatBotText
            text={`3) Where did you discover ${movieName}?`}
          />
        )
      }
      {
        (q4) && (
          <ChatBotText
            text={`4) Where did you watch ${movieName}?`}
          />
        )
      }
      {
        (q5) && (
          <ChatBotText
            text={`5) Why did you watch ${movieName}?`}
          />
        )
      }
      {
        (success) && (
          <ChatBotText
            text={'Thank you. Goodbye.'}
          />
        )
      }
      {
        (q6) && (
          <Box>
            <ChatBotText
              text={`Final question: When did you watch ${movieName}?`}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                label="Pick date viewed"
                value={dateViewed}
                renderInput={(params) => handleRender(params)}
                onChange={(newValue) => {setDateViewed(newValue)}}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              onClick={() => handleSubmit()}
            >
              Submit answers
            </Button>
          </Box>
        )
      }
      {
        answers.map((q, idx) => {
          return (
            <Button
              variant="contained"
              onClick={buttonClick}
              value={q.toLowerCase()}
              key={`question-${idx}`}
              sx={{margin: '5px'}}
            >
              {q}
            </Button>
          )
        })
      }
    </AccordionDetails>
    <Snackbar open={openToast} autoHideDuration={6000} onClose={(e, r) => {closeToast(e, r, setOpenToast)}}>
      <Alert onClose={(e, r) => {closeToast(e, r, setOpenToast)}} severity="error" >
        {toastMessage}
      </Alert>
    </Snackbar>
  </CollapsibleAccordionAbsolute>
  )
}

export default ChatBotBox;