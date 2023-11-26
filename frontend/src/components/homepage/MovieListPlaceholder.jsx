import { Grid, Skeleton, Stack } from '@mui/material';

const MovieListPlaceHolder = () => {
  const range = [...Array(20).keys()];
  return (
    <Grid container columns="120" sx={{ justifyContent: "center", textAlign: "left" }} spacing={5}>
    {range.map(() => (
      <Grid item xl="24" lg="30" md="40" sm="60">
        <Stack spacing={1}>
          <Skeleton variant="rectangular" width={210} height={350} />
          <Skeleton variant="text" width={210} />
          <Skeleton variant="text" width={210} />
        </Stack>
      </Grid>))}
    </Grid>
  );
}

export default MovieListPlaceHolder;
