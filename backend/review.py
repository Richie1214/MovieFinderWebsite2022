import re
from datetime import datetime, date
from requests.exceptions import HTTPError
from database_management import *
from json import dumps
from helper import *
import nltk
from nltk.corpus import stopwords

UNVERIFIED_REVIEW_LIMIT = 5
VERIFIED_REVIEW_LIMIT = 10

# Check for urls in the review
regex = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
# Just remember that there is a limit on the number of reviews people are allowed
# to make per day. Verified reviewers can bypass this limit. 5 reviews for std user, 10 reviews for verified reviewers
# This will have to be accounted for.                                             (Date)  (24 hour Time)    
# payload will contain the keys: 'uid', 'content', 'movie_id', 'rating', 'date' (dd/mm/yyyy hh:mm), 'verified' (bool), 
# 'video' (list of strings to youtube videos or something)
# 'verified' is a boolean. If the reviewers are verified, then they can add video links
# to their reviews. So we might need a new entry in the reviews table for 'videos' or 
# something. Either way, the video links need to be stored.
def make_review(payload):
    user_id = payload["uid"]
    review_text = payload["content"]
    movie_id = payload["movie_id"]
    movie_rating = payload["rating"]
    datetime_string = payload["date"]
    links = payload["hyperlinks"]
    # Check if the user is a verified reviewer.
    reviewer_verified = True if get_account_status(user_id) == 'reviewer' else False
    # Convert date + time string to datetime object
    movie_datetime = datetime.strptime(datetime_string, '%d/%m/%Y %H:%M')

    # If user is a company account, they are not allowed to post a review
    if get_account_status(user_id) == 'company':
        raise Error(description="Movie Company Accounts cannot post reviews")
    # Check Review contents for hyperlinks. If user is not verified and posts a hyperlink, they are prevented from making that review.
    # Check for valid rating value
    if movie_rating not in range(1, 6):
        raise Error(description="Invalid Rating Value (Must be a number between 1 and 5")
    found_urls = re.findall(regex, review_text)
    if links and not reviewer_verified:
        raise Error(description="Unverified users cannot post links in reviews")
    if found_urls and not reviewer_verified:
        raise Error(description="Unverified users cannot include links in the body of a review")
    else:
        # Check review limit has not been reached
        if review_allowed(user_id):
            username = get_account_by_id(user_id)[1]
            update_last_online(username)
            # Return value will be the review id, handled by 'add_review'
            review_id = add_review(user_id, review_text, movie_id, movie_rating, movie_datetime)
            # Update number of reviews today.
            update_reviews_made(username)
            # Create New review_links table to store links of the movie
            if reviewer_verified and links:
                for indiv_link in links:
                    create_review_link(review_id, indiv_link)
            return {'review_id': review_id}
        else:
            raise Error(description=f"You cannot exceed your daily review limit")

def change_review(payload):
    # payload will contain keys: 'uid', 'review_id', 'content', 'rating', 'hyperlinks'
    user_id = payload["uid"]
    review_id = payload["review_id"]
    review_text = payload["content"]
    movie_rating = payload["rating"]
    review_time = datetime.now()
    links = payload["hyperlinks"]
    user = get_account_by_id(user_id)
    username = user[1]
    update_last_online(username)
    user_verified = True if user[7] == 'reviewer' else False

    # If user is a company account, they cannot edit reviews (Reviews should be deleted when promoted to a company account
    # so this should be redundant)
    if get_account_status(user_id) == 'company':
        raise Error(description="Movie Company Accounts cannot edit reviews")

    # Check Review contents for hyperlinks. If user is not verified and posts a hyperlink, they are prevented from making that review.
    # Check for valid rating value
    if movie_rating not in range(1, 6):
        raise Error(description="Invalid Rating Value (Must be a number between 1 and 5")
    found_urls = re.findall(regex, review_text)
    if links and not user_verified:
        raise Error(description="Unverified users cannot post links in reviews")
    if found_urls and not user_verified:
        raise Error(description="Unverified users cannot include links in the body of a review")
    else:
        delete_review_links(review_id)
        # Return value will be True if the edit is successful, otherwise an error will have been raised
        if user_verified and links:
            # Delete any remaining review links before adding new ones
            for indiv_link in links:
                create_review_link(review_id, indiv_link)
        return dumps(edit_review(review_id, review_text, movie_rating, review_time))

def remove_review(payload):
    review_id = payload["review_id"]
    delete_review_links(review_id)
    # True will be returned upon successful deletion, will throw error otherwise
    return dumps(delete_review(review_id))

def review_allowed(user_id):
    # This should return something like:
    # {limit_reached: bool, 'result': get_account_verified_status(payload['username'])}
    review_allowed = False
    user = get_account_by_id(user_id)
    reviewer_verified = True if user[7] == 'reviewer' else False
    user_last_online = user[11]
    reviews_today = user[12]

    # If last active date is different to the date today, reset the reviews made
    # print(user_last_online)
    if not user_last_online.date().strftime('%Y-%m-%d') == date.today().strftime('%Y-%m-%d'):
        update_last_online(user[1])
        reset_review_limit(user[0])
        return True
    # Check if the user's review limit has been exceeded
    else:
        if not reviewer_verified and reviews_today in range(0, UNVERIFIED_REVIEW_LIMIT):
            review_allowed = True
        if reviewer_verified and reviews_today in range(0, VERIFIED_REVIEW_LIMIT):
            review_allowed = True
    return review_allowed

def review_word_frequency(movie_id):
    reviews = get_review_from_movie(movie_id)
    nltk.download('stopwords')
    stop_words = stopwords.words('english')
    word_frequency = {}
    for review in reviews:
        edited_review = re.sub(r'[^\w\s]', '', review[1].lower())
        for word in edited_review.split():
            if word not in stop_words:
                if not word in word_frequency:
                    word_frequency[word] = 1
                else:
                    word_frequency[word] += 1
    
    return word_frequency