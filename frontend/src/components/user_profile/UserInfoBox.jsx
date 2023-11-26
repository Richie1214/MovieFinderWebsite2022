import React from 'react';
import { Grid, Box, Typography, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import { handleHyp } from '../helper';

const UserInfoBox = (props) => {
    return (
      <Grid item>
        <Box item display="flex" alignItems="center">
          <Typography variant="h5">
            {props.infoType}
          </Typography>
          {props.isOwnProfile &&
            <IconButton onClick={props.handleEdit} color="secondary">
              <EditIcon />
            </IconButton>
          }
        </Box>
        <Box item>
          {
            (props.infoType !== "Hyperlinks") ? (
              <Typography variant="body">
                {props.info}
              </Typography>
            ) : (
              <>
                {
                  (props.info).map((link, idx) => {
                    return (
                      <Chip label={link} onClick={() => handleHyp(link)} />
                    )
                  })
                }
              </>
            )
          }

        </Box>
      </Grid>
    );
}

export default UserInfoBox;