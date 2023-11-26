import React from 'react';

import { Card, CardActionArea, CardMedia, CardContent, Divider, Grid, Stack, Skeleton, Typography } from '@mui/material';
import MovieListPlaceHolder from './MovieListPlaceholder';

const MovieList = (props) => {
  return (
    <div>
      {props.movies === null ?
        <MovieListPlaceHolder />
      :<Grid container columns="120" sx={{ justifyContent: "center", textAlign: "left" }} spacing={5} >
        {props.movies.map((movie) => {
          return (
            <Grid key={movie.id} item xl="24" lg="30" md="40" sm="60">
              <Card sx={{ maxWidth: "250px", minWidth: "220px" }}>
                <CardActionArea href={`/moviedetail?id=${movie.id}`}>
                  <CardMedia
                    component="img"
                    height="350"
                    image={movie.img}
                    alt="Movie Poster"
                  />
                  <Divider />
                  <CardContent sx={{height: "40px"}}>
                    <Typography gutterBottom variant="body2" component="div">
                      {movie.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      }
    </div>
  );
}

export default MovieList;
