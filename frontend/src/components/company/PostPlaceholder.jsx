import { Grid, Paper, Skeleton, Stack, styled } from '@mui/material';

const PostPlaceHolder = () => {
  const ViewBox = styled(Paper, {})(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    width: '80%',
    padding: '10px',
    marginBottom: '20px',
    marginTop: '20px'
  }));

  const range = [...Array(3).keys()];
  return (
    <ViewBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Grid container direction="column" columns="120" sx={{ justifyContent: "center", textAlign: "left" }} spacing={5}>
        {range.map(() => (
        <Grid item xl="24" lg="30" md="40" sm="60">
          <Stack spacing={1}>
            <Skeleton variant="rectangular" width={200} height={30} />
            <Skeleton variant="text" width={100} />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </Stack>
        </Grid>))}
      </Grid>
    </ViewBox>
  );
}

export default PostPlaceHolder;