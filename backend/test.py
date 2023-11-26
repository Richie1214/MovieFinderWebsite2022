import requests
import json
from error import Error
from helper import *
from collections import Counter
from requests.exceptions import HTTPError
from database_management import *
from movie import *
API_key = "0bd56f6f6dd453c1765c10fbc5d07b36" 

def get_recommended_movies(current_movie_id, user_id, same_genre, same_director):
    # Recommended movies returned should be limited to 5

    # For a user who is not logged in (empty string user_id), recommendation is only based on the current movie page
    if not user_id:
        current_movie_recommendations = get_movie_recommendations(current_movie_id)
        return current_movie_recommendations[0:5]

    recommended_movies = []
    current_movie = get_movie_details(current_movie_id)

    # Get genres of the current movie
    # List of dictionaries with id and name of genre returned
    search_movie_details = current_movie["movie_details"]
    search_genres = search_movie_details["genres"]
    # Get directors of current movie
    # A list of ids representing directors returned
    search_directors = []
    for cast in current_movie["movie_cast"]["cast"]:
        if cast["known_for_department"] == "Directing":
            search_directors.append(cast["id"])

    # Retrieve review history and gather recommendations
    # Tables to store movies ids from review history
    review_history_recommendations_aggregate = []
    review_history_recommendations_unique = []
    previous_reviews_sample = []

    # Check if the user has made a 'positive' review before. If not, the current movie should be the only movie used to search for recommendations
    # If the current user hasn't reviewed any movies or has no valid reviewed movies (score >=3/5), the if statement is skipped
    if get_favourable_movies_of_user_by_reviews(user_id):
        previous_reviews_sample = get_favourable_movies_of_user_by_reviews(user_id)
        # Gather up to the last 10 reviews made by a user
        most_recent_reviews = previous_reviews_sample[-3:]
        # Add the current movie to the lists if it's not already there
        if current_movie_id not in previous_reviews_sample:
            previous_reviews_sample.append(current_movie_id)
        # Get recommendations from the most recent movies reviewed + the current movie
        for review_movie in most_recent_reviews:
            recommendations = get_movie_recommendations(review_movie)
            # Take the list of recommendations and append individually to aggregate list
            for movie_id in recommendations[0:5]:
                review_history_recommendations_aggregate.append(movie_id)
                # Create list without duplicate movie IDs
                if movie_id not in review_history_recommendations_unique:
                    review_history_recommendations_unique.append(movie_id)

    # Each unique movie id is checked to see if they fit the search criteria
    # List for holding acceptable movie ids
    valid_movie_recommendations = []
    invalid_movie_recommendations = []
    for unique_movie in review_history_recommendations_unique:
        # Tags to indicate filters have been applied properly
        genre_tag = False
        director_tag = False

        # If the genre or director filter is not enabled, change tag value to pass final check component
        if not same_genre:
            genre_tag = True
        if not same_director:
            director_tag = True

        # Get details of the current iterated movie
        # Genres
        unique_movie = get_movie_details(unique_movie)
        unique_movie_id = unique_movie["movie_details"]["id"]
        unique_movie_details = unique_movie["movie_details"]
        unique_genres = unique_movie_details["genres"]
        # If there is an overlap in genre, consider this movie a valid recommendation
        if same_genre and not set(unique_genres).isdisjoint(search_genres):
            genre_tag = True

        # Directors
        unique_directors = []
        for cast in unique_movie_details["movie_cast"]["cast"]:
            if cast["known_for_department"] == "Directing":
                unique_directors.append(cast["id"])
        # If there is an overlap in director, consider this movie a valid recommendation
        if same_director and not set(unique_directors).isdisjoint(search_directors):
            director_tag = True

        # Only if both genre and director filters are properly processed will the movie be considered "recommended"
        # Movies recommended should also not be a movie already reviewed by the user nor should it be the current movie being viewed
        if genre_tag and director_tag and (unique_movie_id not in previous_reviews_sample) and (unique_movie_id != current_movie_id):
            valid_movie_recommendations.append(unique_movie)
        # If the movie did not fit the filters but is different to the current movie and previously reviewed ones, it may be added to the movie
        # to ensure 5 recommendations are returned
        elif (unique_movie_id not in previous_reviews_sample) and (unique_movie_id != current_movie_id):
            invalid_movie_recommendations.append(unique_movie)

    # Processing Output
    # To ensure 5 recommendations are outputted, the 'best' recommendations which did not fit the filters will be added onto the return list
        
    # With a list of valid recommendations, the best recommendations are taken based on the times
    # the movie id appeared in the aggregated recommendations list

    # Construct a table from aggregate table where non-valid movies are removed
    valid_movies_data = []
    for movie in review_history_recommendations_aggregate:
        if movie in valid_movie_recommendations:
            valid_movies_data.append(movie)
    valid_recommended_movies_data = Counter(valid_movies_data).most_common(5)
    for tup in valid_recommended_movies_data:
        # Extract the movie id
        recommended_movies.append(tup[0])
    
    # Check if there's exactly 5 recommended movies in the return value
    if len(recommended_movies) == 5:
        return recommended_movies
    elif len(recommended_movies) > 5:
        raise Error(description='Recommended movies ended up with more than 5 recommendations')
    # If there's insufficient valid recommendations, the most highly recommended movies which did not pass the filters will be appended
    # to ensure 5 movies are added to the return list
    else:
        # Check list of invalid movies and get the most recommended ones to be added to make 5
        # returned movies
        invalid_movies_data = []
        for movie_id in review_history_recommendations_aggregate:
            if movie_id in invalid_movie_recommendations:
                invalid_movies_data.append(movie_id)
        required_movies = 5 - len(recommended_movies)
        backup_movies_data = Counter(invalid_movies_data).most_common(required_movies)
        for tup in backup_movies_data:
            # Extract the movie id
            recommended_movies.append(tup[0])
        return recommended_movies

# Pull movie details from the API
def get_movie_details(movie_id):
    movieInfoLink = f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={API_key}&language=en-US'
    movieCastLink = f'https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key={API_key}&language=en-US'

    # Error handling
    try:
        requests.get(movieInfoLink)
    except HTTPError as err:
        if err.code == 401:
            raise Error(description='Invalid API Key (Code: {err.code})')
        elif err.code == 404:
            raise Error(description='No movie found with id {movie_id} (Code: {err.code})')
        else:
            raise Error(description='Unexpected Error Number (Code: {err.code})')
    # Successful Movie Request (Code 200)
    else:
        # Call API for main movie details and cast
        mov_info = requests.get(movieInfoLink)
        movie_details = json.loads(mov_info.text)
        mov_cast = requests.get(movieCastLink)
        movie_cast = json.loads(mov_cast.text)

        # Construct return dictionary consisting of main details and cast details
        return_value = {
            "movie_details": movie_details,
            "movie_cast": movie_cast
        }
        # Check if json.dumps is necessary, otherwise just return return_value
        # return return_value
        return return_value