
import requests
import json
from database_management import get_account_by_id

from database_management import get_account, get_wishlist

from error import Error

def get_wishlist_helper(id):
    # try:
    #     id = get_account(email)[0]
    # except:
    #     raise Error(description="Invalid token")

    # Get all movie id's that are part of the user's wishlist.
    wishlistTups = get_wishlist(id)
    # Ret will contain some information about the movies in the user's wishlist.
    # It will contain: title, id, poster_path
    ret = { "username": get_account_by_id(id)[1], "wishlist": [] }
    if (len(wishlistTups) == 0):
        return ret
    for uId, mId, date in wishlistTups:
        # Do API call for the movie details.
        response = requests.get(f'https://api.themoviedb.org/3/movie/{mId}?api_key=b916a5c72fde8f24db7515176d58c836&language=en-US')
        body = json.loads(response.text)
        ret["wishlist"].append({
            'title': body['title'],
            'id': body['id'],
            'poster_path': body['poster_path']
        })
    return ret

# response = requests.get(f'https://api.themoviedb.org/3/movie/453395?api_key=b916a5c72fde8f24db7515176d58c836&language=en-US')
# body = json.loads(response.text)
# # print(body)
# print({
#     'title': body['title'],
#     'id': body['id'],
#     'poster_path': body['poster_path']
# })