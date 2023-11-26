from error import Error
import requests
import json
from requests.exceptions import HTTPError
from database_management import *

# connection = psycopg2.connect(
#         dbname= "movieFinder",
#         user = "postgres",
#         password = "postgres",
# )
# cur = connection.cursor()

# This is used for when you are using your database.
def error_helper(connection, message):
    connection.rollback()
    raise Error(description=f'{message}')

def get_movie_name(movie_id):
    API_key = "0bd56f6f6dd453c1765c10fbc5d07b36"
    # Pulling movie details from the API
    movieInfoLink = f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={API_key}&language=en-US'
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
    else:
        # Successful Movie Request (Code 200)
        # Call API for main movie details
        mov_info = requests.get(movieInfoLink)
        movie_details = json.loads(mov_info.text)

        # Extract movie name and return it
        movie_title =  movie_details["title"]
        return movie_title