import { Divider, Grid, Skeleton, Stack } from '@mui/material';
import PostPlaceHolder from '../company/PostPlaceholder';

const ProfilePlaceholder = () => {
  return (
    <Grid container direction="column" spacing={4}>
      <Grid item>
        <Grid
          container
          spacing={3}
          sx={{ p: 3 }}
        >
          <Grid item md={2} sm={3}>
            <Grid container direction="column" spacing={3}>
              <Grid container item alignItems="center" direction="column">
                <Grid item>
                  <Skeleton variant="circular" width={200} height={200} />
                </Grid>
              </Grid>
              <Stack spacing={2} sx={{ p: 2 }}>
                {[...Array(5).keys()].map(() => (
                  <Stack spacing={1}>
                    <Skeleton variant="text" width={100} height={40}/>
                    <Skeleton variant="text" width={200} height={30}/>
                  </Stack>
                ))}
              </Stack>
            </Grid>
          </Grid>
          <Grid item sm={1}>
            <Divider orientation="vertical" />
          </Grid>
          <Grid item container direction="column" md={9} sm={8} spacing={3} alignItems="center">
            <Grid item textAlign="center">
              <Skeleton variant="text" width={100} height={40}/>
            </Grid>
            <Grid item width="100%">
              <PostPlaceHolder />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ProfilePlaceholder;