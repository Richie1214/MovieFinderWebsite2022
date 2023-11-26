import React from 'react';

import { Grid, IconButton } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const PageNavigation = (props) => {
  const [disablePrev, setDisablePrev] = React.useState(props.page <= 0);
  const [disableNext, setDisableNext] = React.useState(props.itemCount <= (props.page + 1) * props.pageSize);

  const prevPage = () => {
    if (props.page - 1 === 0) {
      setDisablePrev(true);
    }
    setDisableNext(false);
    props.setPage(props.page - 1);
  }

  const nextPage = () => {
    if (props.pageSize * (props.page + 2) >= props.itemCount) {
      setDisableNext(true);
    }
    setDisablePrev(false);
    props.setPage(props.page + 1);
  }
  console.log(props.page);
  console.log(props.itemCount);

  return (
    <Grid item sx={{ display: "flex", justifyContent: "center" }}>
      <IconButton disabled={disablePrev} onClick={prevPage}>
        <NavigateBeforeIcon color="secondary" />
      </IconButton>
      <IconButton disabled={disableNext} onClick={nextPage}>
        <NavigateNextIcon color="secondary" />
      </IconButton>
    </Grid>
  );
}

export default PageNavigation;
