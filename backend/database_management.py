import hashlib
import random
import smtplib
import ssl
import string
from turtle import clear
import psycopg2
from datetime import datetime
import re
import urllib
import json
from image import *
from helper import error_helper, get_movie_name
import smtplib

hyperlink_regex = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
email_regex = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
email_dict = []
API_key = "0bd56f6f6dd453c1765c10fbc5d07b36"

sender_email = "comp3900moviefinder@gmail.com"
email_password = "hqaqsarhqxflypnk"
port = 465

connection = psycopg2.connect(
        dbname= "movieFinder",
        user = "postgres",
        password = "postgres",
)
cur = connection.cursor()

def value_exists(column, table, value):
    try:
        cur.execute(f"SELECT {column} FROM {table} WHERE {column} ='{value}'")
    except:
        error_helper(connection, "Unsuccessful call of value_exists")
    else:    
        rows = cur.fetchall()
        if rows:
            return True
        return False

# def connect():
#     global connection
#     global cur
#     connection.close()
#     connection = psycopg2.connect(
#         host = "localhost",
#         database = "movieFinder",
#         user = "postgres",
#         password = "postgres",
#     )
#     cur = connection.cursor()

def close():
    connection.close()
    
def edit_account_variable(user_id, variable, value):
    if variable not in ['username', 'bio', 'email', 'real_name', 'gender', 'hyperlinks', 'account_type', 'company_id']:
        error_helper(connection, f"Invalid variable named {variable}")
    if not value and not variable == "hyperlinks":
        error_helper(connection, f"New {variable} cannot be empty")
    if not value_exists('user_id', 'movie_user', user_id):
        error_helper(connection, "Username doesn't exists")
    if type(value) == string and not value.isascii():
        error_helper(connection, "Strings must be in ascii")
    if variable == 'email' and not re.search(email_regex, value):
        error_helper(connection, "Email is not valid")
    
    # Handle hyperlink values separately
    if variable == 'hyperlinks':
        # Clear any hyperlinks on the user's profile before adding new ones
        delete_user_links(user_id)
        for link in value:
            url = re.findall(hyperlink_regex, link)
            if not url:
                error_helper(connection, "Non-URL found in Hyperlinks Table")
            else:
                create_user_link(user_id, link)
        return True

    # Check if username or email is unique
    if variable in ['username', 'email']:
        # Username
        if variable == 'username':
            if get_account_with_username(value):
                error_helper(connection, "This username is already taken, either by you or someone else")
        # Email
        else:
            if get_account(value):
                error_helper(connection, "This email is already linked to an account")
    try:
        if (not value == 'null'):
            cur.execute(f"UPDATE movie_user SET {variable} = '{value}' WHERE user_id = '{user_id}'")
        else:
            cur.execute(f"UPDATE movie_user SET {variable} = null WHERE user_id = '{user_id}'")
    except:
        error_helper(connection, "Unsuccessful edit of user's database record")
    else:
        connection.commit()
        return True

def edit_account_username(user_id, new_username):
    edit_account_variable(user_id, "username", new_username)
    
def edit_account_email(user_id, new_email):
    edit_account_variable(user_id, "email", new_email)

def edit_account_name(user_id, new_name):
    edit_account_variable(user_id, "real_name", new_name)

def edit_account_bio(user_id, new_bio):
    edit_account_variable(user_id, "bio", new_bio)

def edit_account_gender(user_id, new_gender):
    edit_account_variable(user_id, "gender", new_gender)

def edit_account_hyperlinks(user_id, new_hyperlinks):
    edit_account_variable(user_id, "hyperlinks", new_hyperlinks)

def get_account_user_id(username):
    try:
        # There will only be at most 1 user_id entry returned by the query
        cur.execute(f"SELECT user_id FROM movie_user WHERE username ='{username}'")
    except:
        error_helper(connection, "Error in get_account_user_id call")
    else:
        user_id = cur.fetchone()
        return user_id[0]

def get_account_with_username(username):
    try:
        # There will only be at most 1 movie_user entry returned by the query
        cur.execute(f"SELECT * FROM movie_user WHERE username ='{username}'")
    except:
        error_helper(connection, "Error in check_account_username call")
    else:
        account = cur.fetchone()
        return account
        
def get_account(email):
    try:
        # There will only be at most 1 movie_user entry returned by the query
        cur.execute(f"SELECT * FROM movie_user WHERE email = '{email}'")
    except:
        error_helper(connection, "Error in get_account call")
    else:
        account = cur.fetchone()
        return account

# Checks if the given username's account is verified.
# Returns true if verified, else false
def check_reviews_made(username):
    try:
        cur.execute(f"SELECT reviews_today FROM movie_user WHERE username ='{username}'")
    except:
        error_helper(connection, "Unable to check the review limit of the user")
    else:
        reviews_made = cur.fetchone()
        return reviews_made

def update_reviews_made(username):
    try:
        cur.execute(f"UPDATE movie_user SET reviews_today = reviews_today + 1 WHERE username ='{username}'")
    except:
        error_helper(connection, "Unable to update the number of reviews made")
    else:
        connection.commit()
        return True

def reset_review_limit(username):
    try:
        cur.execute(f"UPDATE movie_user SET reviews_today = '{0}' WHERE username ='{username}'")
    except:
        error_helper(connection, "Unable to reset the number of reviews made by the user")
    else:
        connection.commit()
        return True
    
def update_last_online(username):
    user_id = get_account_user_id(username)
    try:
        cur.execute(f"UPDATE movie_user SET last_online = '{datetime.now()}' WHERE user_id = '{user_id}'")
    except:
        error_helper(connection, "Cannot update user's last active time")
    else:
        connection.commit()
        return True

def get_account_status(user_id):
    try:
        cur.execute(f"Select account_type from movie_user WHERE user_id = '{user_id}'")
    except:
        error_helper("Cannot conduct search for account status")
    else:
        x = cur.fetchall()
        account_type = x[0][0]
    return account_type

def get_account_verified_status(username):
    try:
        result = cur.execute(f"SELECT * from movie_user WHERE username = '{username}' AND verified = 'true'")
    except:
        error_helper(connection, "Error in accessing verified stfatus in db")
    else:
        if not result:
            return False
        return True

def get_account_company_status(username):
    try:
        result = cur.execute(f"SELECT company_name from movie_user mu \
                               JOIN company c ON (c.company_id = mu.company_id) WHERE username = '{username}' AND company = 'true'")
    except:
        error_helper(connection, "Error in accessing company status in db")
    else:
        if not result:
            return False
        else:
            company = cur.fetchone()
            # Company name is returned
            return company

def get_all_accounts():
    try:
        cur.execute(f"SELECT * from movie_user")
    except:
        error_helper("Error in returning all users from db")
    else:
        company = cur.fetchall()
        return company

# # not sure if this function belongs in this file
# # Sets 'verified' field in movie_user table to True for given username
# def verify_account(username):
#     # minimum number of reviews to be verified
#     MIN_REVIEWS_FOR_VERIFY = 100

#     # check if user is already verified
#     account = get_account_with_username(username)
#     if get_account_verified_status(account[1]):
#         error_helper(connection, "This user is already verified.")
#     else:
#         if (len(get_user_reviews(account[3])) < MIN_REVIEWS_FOR_VERIFY):
#             error_helper(connection, "Not enough reviews to be verified.")
#         else:
#             edit_account_variable(account[0], 'verified', 'true')

# Checks if the given uid has already sent in a verification form.
# Returns true if form with uid already exists in db.
def check_verif_form_already_sent(uid):
    try:
        cur.execute(f"SELECT * from reviewer_verification_form WHERE user_id = '{uid}' AND status = 'reviewing'")
    except:
        error_helper(connection, "Unable to access reviewer_verification_form table")
    else:
        result = cur.fetchone()
        if not result:
            return False 
        return True

# Checks if the given uid has already sent in a company verification form.
# Returns true if company form with uid already exists in db.
def check_company_verif_form_already_sent(uid):
    try:
        cur.execute(f"SELECT * from company_verification_form WHERE user_id = '{uid}' AND status = 'reviewing'")
    except:
        error_helper(connection, "Unable to access company_verification_form table")
    else:
        result = cur.fetchone()
        if not result:
            return False
        return True

def get_user_reviews(email):
    account = get_account(email)
    try:
        cur.execute(f"SELECT * from movie_review WHERE reviewer_id ='{account[0]}'")
    except:
        error_helper(connection, "Error in get_user_reviews")
    else:
        reviews = cur.fetchall()
        if reviews:
            return reviews
        else:
            return []

# Returns a list of all blocked users that the given u_id has blocked.
def get_blocked_list(id):
    try:
        cur.execute(f"SELECT blocked_id from ban_list WHERE user_id = '{id}'")
    except:
        error_helper(connection, "Error in get_blocked_list")
    else:
        block_list = []
        result = cur.fetchall()
        for id in result:
            block_list.append(id[0])
        return block_list

# Adds blocked_id to id's (current user) ban list
def add_user_to_ban_list(id, blocked_id):
    try:
        cur.execute(f"INSERT INTO ban_list (user_id, blocked_id) VALUES ({id}, {blocked_id})")
    except:
        error_helper(connection, "Error adding user to ban list")
    else:
        connection.commit()
        return True

# Remove blocked_id from id's (current user) ban list
def remove_user_from_ban_list(id, blocked_id):
    try:
        cur.execute(f"DELETE FROM ban_list WHERE user_id = '{id}' AND blocked_id = '{blocked_id}'")
    except:
        error_helper(connection, "error unblocking user")
    else:
        connection.commit()
        return True

################## User Link Queries #########################
def create_user_link(user_id, link):
    try:
        cur.execute(f"INSERT INTO user_links (origin_user_id, link) \
            VALUES ('{user_id}', '{link}')")
    except:
        error_helper(connection, "Error creating entry in user_links")
    else:
        connection.commit()
        return True

# Deletes all links associated with a user
def delete_user_links(user_id):
    try:
        cur.execute(f"DELETE FROM user_links WHERE origin_user_id = '{user_id}'")
    except:
        error_helper(connection, "Error deleting entries in user_links")
    else:
        connection.commit()
        return True

def get_user_links_from_profile(user_id):
    try:
        cur.execute(f"SELECT link from user_links WHERE origin_user_id = {user_id}")
    except:
        error_helper(connection, "Error returning links in user_links")
    else:
        profile_links = cur.fetchall()
        if profile_links:
            return [link[0] for link in profile_links]
        else:
            return []
##############################################################

# Gets account details and written reviews by a specific user  
def get_user_profile(id):
    account = get_account_by_id(id)

    #Check the user's profile image and either place it in the return value or use the default image (For users with no profile pic)
    profile_img = check_profile_image(id)

    # Pass the email into get_user_reviews, as this requires the email.
    account_reviews = get_user_reviews(account[3])
    # Below is to simply change the date into a string.
    new_account_reviews = []
    for tup in account_reviews:
        new_account_reviews.append({
            'review_id': tup[0],
            'content': tup[2],
            'movie_name': get_movie_name(tup[3]),
            'movieId': tup[3],
            'rating': tup[4],
            'date': str(tup[5].day) + '/' + str(tup[5].month) + '/' + str(tup[5].year),
            'edited': tup[6],
            'hyperlinks': get_review_links_from_movie(tup[0]),
            'username': account[1],
            'verified': True if get_account_status(id) == 'reviewer' else False
        })

    return_value = {
        "account": {
            'username': account[1],
            'email': account[3],
            'name': account[4],
            'gender': account[5],
            'bio': account[6],
            'account_type': account[7],
            'verified': account[8],
            'company_id': account[10],
            'last_online': account[11].strftime("%d/%m/%Y %H:%M"),
            'reviews_today': account[12],
            'hyperlinks': get_user_links_from_profile(id)
        },
        "img": profile_img,
        "reviews": new_account_reviews
    }
    return return_value
        
def get_account_by_id(id):
    try:
        cur.execute(f"SELECT * FROM movie_user WHERE user_id = '{id}'")
    except:
        error_helper(connection, "Error in get_account_by_id call")
    else:
        account = cur.fetchone()
        return account

def delete_account(id):
    try:
        # Delete all records of a user
        cur.execute(f"DELETE FROM ban_list WHERE user_id = '{id}'")
        cur.execute(f"DELETE FROM wishlist_movie WHERE user_id = '{id}'")
        cur.execute(f"DELETE FROM review_links USING movie_review WHERE \
            (review_links.origin_review_id = movie_review.review_id AND \
            movie_review.reviewer_id = {id})")
        cur.execute(f"DELETE FROM movie_review WHERE reviewer_id = '{id}'")
        cur.execute(f"DELETE FROM user_links WHERE origin_user_id = '{id}'")
        cur.execute(f"DELETE FROM chatbot_answer WHERE user_id = '{id}'")
        cur.execute(f"DELETE FROM movie_user WHERE user_id = '{id}'")
    except:
        error_helper(connection, "Couldn't delete account (or specific records linked to that account) from database")
    else:    
        connection.commit()
        return True

def add_wishlist_movie(user_id, movie_id, date_added):
    try:
        cur.execute(f"INSERT INTO wishlist_movie (user_id, movie_id, date_added) \
            VALUES ('{user_id}', '{movie_id}', '{date_added}')")
    except:
        error_helper(connection, "Couldn't add movie to wishlist in database")
    else:
        connection.commit()
        return True

def get_wishlist(user_id):
    try:
        cur.execute(f"SELECT * FROM wishlist_movie WHERE user_id ='{user_id}'")
    except:
        error_helper(connection, "Couldn't return the wishlist from database")
    else:
        return cur.fetchall()

def delete_wishlist_movie(user_id, movie_id):
    try:
        cur.execute(f"DELETE FROM wishlist_movie WHERE user_id = '{user_id}' AND movie_id = '{movie_id}'")
    except:
        error_helper(connection, "Error deleting movie from database")
    else:
        connection.commit()
        return True

# This will have to be accounted for.                                         (Date)  (24 hour Time)    
# payload will contain the keys: 'uid', 'content', 'movie_id', 'rating', 'date' (dd/mm/yyyy hh:mm), 'verified' (bool), 
def add_review(user_id, review_text, movie_id, movie_rating, movie_datetime):
    try:
        review_text = review_text.replace("'", "''")
        cur.execute(f"INSERT INTO movie_review (reviewer_id, review_content, review_movie_source, \
            review_rating, review_datetime, review_edited) \
            VALUES ('{user_id}', '{review_text}', '{movie_id}', \
            '{movie_rating}', '{movie_datetime}', false)")
    except:
        error_helper(connection, "Couldn't add review to database")
    else:
        # Should return something like {review_id: INT}
        connection.commit()
        review_id = get_review_id(user_id, movie_id)
        return review_id

def edit_review(review_id, review_text, movie_rating, edit_time):
# Things that are updated are the text, rating, time
    try:
        review_text = review_text.replace("'", "''")
        cur.execute(f"UPDATE movie_review SET review_content = '{review_text}' WHERE review_id = '{review_id}'")
        cur.execute(f"UPDATE movie_review SET review_rating = '{movie_rating}' WHERE review_id = '{review_id}'")
        cur.execute(f"UPDATE movie_review SET review_datetime = '{edit_time}' WHERE review_id = '{review_id}'")
        cur.execute(f"UPDATE movie_review SET review_edited = true WHERE review_id = '{review_id}'")
    except:
        error_helper(connection, "Couldn't edit review in database")
    else:
        # Should return something like {review_id: INT}
        connection.commit()
        return True

def delete_review(review_id):
    try:
        cur.execute(f"DELETE FROM movie_review WHERE review_id = '{review_id}'")
    except:
        error_helper(connection, "Error deleting movie review from database")
    else:
        delete_review_links(review_id)
        connection.commit()
        return True

# Delete all reviews made by a user using delete_review
def delete_all_user_reviews(user_id):
    user_reviews = get_user_reviews_by_id(user_id)
    for review in user_reviews:
        review_id = review[0]
        delete_review(review_id)

def get_user_reviews_by_id(user_id):
    try:
        cur.execute(f"SELECT * from movie_review WHERE reviewer_id ='{user_id}'")
    except:
        error_helper(connection, "Error in getting all reviews of the specified reviewer")
    else:
        reviews = cur.fetchall()
        if reviews:
            return reviews
        else:
            return []

# Returns ids of movies which the specific user has rated favourable (>=3/5)
def get_favourable_movies_of_user_by_reviews(user_id):
    try:
        cur.execute(f"SELECT review_movie_source from movie_review WHERE (reviewer_id ='{user_id}' AND review_rating >= 3)")
    except:
        error_helper(connection, "Error in getting all reviews of the specified reviewer")
    else:
        movie_ids = cur.fetchall()
        if movie_ids:
            favourable_movies = [ids[0] for ids in movie_ids]
            return favourable_movies
        else:
            return []

def get_review_id(user_id, movie_id):
    try:
        cur.execute(f"SELECT review_id from movie_review WHERE (reviewer_id = '{user_id}' AND review_movie_source = '{movie_id}')")
    except:
        error_helper(connection, "Error in finding review id from database")
    else:
        connection.commit()
        review_id = cur.fetchone()
        return review_id[0]

# Check if user has interacted with the chatbot on a specific movie page
def check_chatbot_interaction(user_id, movie_id):
    try:
        cur.execute(f"SELECT * FROM chatbot_answer WHERE (user_id = '{user_id}' AND movie_id = '{movie_id}')")
    except:
        error_helper(connection, "Error getting chatbot entries from DB")
    else:
        chatbot_answers = cur.fetchall()
        if chatbot_answers:
            return True
        else:
            return False

def get_review_from_movie(movie_id):
    cur.execute(f"SELECT mr.review_id, mr.review_content as review_content, mr.review_movie_source as movie_id,\
                  mr.review_rating as rating, mr.review_datetime as date, mr.review_edited, mu.username, mu.email, mu.user_id\
                  FROM movie_review mr JOIN movie_user mu ON (mr.reviewer_id = mu.user_id)\
                  WHERE review_movie_source = '{movie_id}'")
    reviews = cur.fetchall()
    if reviews:
        return reviews
    else:
        return []


################ Review Link Queries ###########################
def create_review_link(review_id, link):
    try:
        cur.execute(f"INSERT INTO review_links (origin_review_id, link) \
            VALUES ('{review_id}', '{link}')")
    except:
        error_helper(connection, "Error creating entry in review_links")
    else:
        connection.commit()
        return True

# Deletes all review links associated with a particular review
def delete_review_links(review_id):
    try:
        cur.execute(f"DELETE FROM review_links WHERE origin_review_id = '{review_id}'")
    except:
        error_helper(connection, "Error deleting entries in review_links")
    else:
        connection.commit()
        return True

def get_review_links_from_movie(review_id):
    cur.execute(f"SELECT link from review_links WHERE origin_review_id = '{review_id}'")
    review_links = cur.fetchall()
    if review_links:
        return [link[0] for link in review_links]
    else:
        return []
#####################################################################

def get_all_companies():
    try:
        cur.execute("SELECT * FROM company")
    except:
        error_helper(connection, "Error getting companies")
    allCompanies = cur.fetchall()
    retCompanies = []
    for tup in allCompanies:
        retCompanies.append({'id': tup[0], 'name': tup[1]})
    return retCompanies

############### VERIFICATION FORMS ###############

# Returns list of all company verification forms in DB sorted by date descending
def get_all_company_verification_forms():
    try:
        cur.execute("SELECT * FROM company_verification_form ORDER BY date DESC")
    except:
        error_helper(connection, "Error getting company verification forms")
    else:
        return cur.fetchall()

# Returns list of all company verification forms sent by 'user_id' sorted by date descending
def get_company_verification_forms_from_user(user_id):
    try:
        cur.execute(f"SELECT * FROM company_verification_form WHERE user_id = '{user_id}' ORDER BY date DESC")
    except:
        error_helper(connection, "Error getting this user's company verification forms")
    else:
        result = cur.fetchall()
        all_company_forms = []
        for row in result:
            current_form = {
                'form_id': int(row[0]),
                'company_name': str(row[3]),
                'link': str(row[4]),
                'message': str(row[7]),
                'files': 'todo',
                'company_website': str(row[5]),
                'phone': str(row[6]),
                'uid': str(row[1]),
                'username': str(get_account_by_id(str(row[1]))[1]),
                'date': str(row[8]),
                'status': str(row[9])}
            all_company_forms.append(current_form)

    return all_company_forms

# Returns list of all reviewer verification forms in DB sorted by date descending
def get_all_reviewer_verification_forms():
    try:
        cur.execute("SELECT * FROM reviewer_verification_form ORDER BY date DESC")
    except:
        error_helper(connection, "Error getting reviewer verification forms")
    else:
        return cur.fetchall()

# Returns list of all reviewer verification forms that are still under review sorted by date descending
def get_reviewer_forms_under_review():
    try:
        cur.execute("SELECT * FROM reviewer_verification_form WHERE status = 'reviewing' ORDER BY date DESC")
    except:
        error_helper(connection, "Error getting forms that are under review")
    else:
        result = cur.fetchall()
        return convert_json_reviewer_form(result)

    # Alternate implementation below, form[7] is hardcoded which isn't very good
    #
    # all_forms = get_all_reviewer_verification_forms()
    # forms_under_review = []
    # for form in all_forms:
    #     if form[7] == 'reviewing':
    #         forms_under_review.append(form)
    # return forms_under_review

# Returns list of all reviewer verification forms that have either been accepted or rejected, sorted by date descending
def get_reviewer_forms_already_reviewed():
    try:
        cur.execute("SELECT * FROM reviewer_verification_form WHERE status = 'accepted' OR status = 'rejected' ORDER BY date DESC")
    except:
        error_helper(connection, "Error getting forms that have already been reviewed")
    else:
        result = cur.fetchall()
        return convert_json_reviewer_form(result)


    # Alternate implementation below, form[7] is hardcoded which isn't very good
    #
    # all_forms = get_all_reviewer_verification_forms()
    # forms_under_review = []
    # for form in all_forms:
    #     if form[7] == 'accepted' or form[7] == 'rejected':
    #         forms_under_review.append(form)
    # return forms_under_review

# Returns list of all company verification forms that are still under review, sorted by date descending
def get_company_forms_under_review():
    try:
        cur.execute("SELECT * FROM company_verification_form WHERE status = 'reviewing' ORDER BY date DESC")
    except:
        error_helper(connection, "Error getting company forms that are under review")
    else:
        result = cur.fetchall()
        return convert_json_company_form(result)


# Returns list of all company verification forms that either been accepted or rejected, sorted by date descending
def get_company_forms_already_reviewed():
    try:
        cur.execute("SELECT * FROM company_verification_form WHERE status = 'accepted' or status = 'rejected' ORDER BY date DESC")
    except:
        error_helper(connection, "Error getting company forms that are already reviewed")
    else:
        result = cur.fetchall()
        return convert_json_company_form(result)

# Returns list of all reviewer verification forms sent by given user_id, sorted by date descending
def get_verification_forms_from_user(user_id):
    try:
        cur.execute(f"SELECT * FROM reviewer_verification_form WHERE user_id = '{user_id}' ORDER BY date DESC")
    except:
        error_helper(connection, "Error getting current users verification forms")
    else:
        result = cur.fetchall()
        return convert_json_reviewer_form(result)

# Helper func. Converts reviewer forms into list of JSON objects
def convert_json_reviewer_form(fetched_forms):
    json_list = []
    for row in fetched_forms:
        current_form = {
            'form_id': int(row[0]),
            'company_name': str(get_company_name_from_id(row[3])) if row[3] else 'None',
            'company_id': int(row[3]) if row[3] else -1,
            'link': str(row[4]),
            'message': str(row[5]),
            'files': 'todo',
            'uid': str(row[1]),
            'username': str(get_account_by_id(str(row[1]))[1]),
            'date': str(row[6]),
            'status': str(row[7])
        }
        json_list.append(current_form)

    return json_list

# Helper func. Converts company forms into list of JSON objects
def convert_json_company_form(fetched_forms):
    json_list = []
    for row in fetched_forms:
        current_form = {
            'form_id': int(row[0]),
            'company_name': str(row[3]),
            'company_id': int(row[2]) if row[2] else -1,
            'link': str(row[4]),
            'message': str(row[7]),
            'files': 'todo',
            'company_website': str(row[5]),
            'phone': str(row[6]),
            'uid': str(row[1]),
            'username': str(get_account_by_id(str(row[1]))[1]),
            'date': str(row[8]),
            'status': str(row[9])}
        json_list.append(current_form)

    return json_list

# Helper func. Returns company name when given it's company_id
def get_company_name_from_id(company_id):
    try:
        cur.execute(f"SELECT company_name FROM company WHERE company_id = '{company_id}'")
    except:
        error_helper(connection, "Error getting company name from company id")
    else:
        res = cur.fetchone()
        return res[0]

def get_company_info(company_id):
    try:
        cur.execute(f"SELECT company_info FROM company WHERE company_id = '{company_id}'")
    except:
        error_helper(connection, "Error getting company name from company id")
    else:
        res = cur.fetchone()
        return res[0]

# Adds a company verification form into DB
def send_company_verification_form(user_id, company_id, company_name, link, company_website, phone, message, date):
    try:
        form_datetime = datetime.strptime(date, '%d/%m/%Y %H:%M')
        if (not company_id == -1):
            cur.execute(f"INSERT INTO company_verification_form (user_id, company_id, company_name, link, company_website, phone, message, date, status) \
                VALUES ('{user_id}', '{company_id}', '{company_name}', '{link}', '{company_website}', '{phone}', '{message}', '{form_datetime}', 'reviewing')")
        else:
            cur.execute(f"INSERT INTO company_verification_form (user_id, company_id, company_name, link, company_website, phone, message, date, status) \
                VALUES ('{user_id}', null, '{company_name}', '{link}', '{company_website}', '{phone}', '{message}', '{form_datetime}', 'reviewing')")
    except:
        error_helper(connection, "Error inserting verification form to db")
    else:
        connection.commit()
        return True

# Create the new company, and return the company id.
def create_company(name):
    try:
        cur.execute(f"INSERT INTO company (company_name) VALUES ('{name}')")
    except:
        error_helper(connection, "Company name already exists")
    else:
        connection.commit()
    # Now, obtain the company id.
    try:
        cur.execute(f"SELECT company_id FROM company WHERE company_name = '{name}'")
    except:
        error_helper(connection, "Unable to access company information.")
    else:
        company_id = cur.fetchone()
        return company_id[0]

# Get company details
def get_company_details(company_id):
    try:
        cur.execute(f"SELECT * FROM company WHERE company_id = {company_id}")
    except:
        error_helper(connection, "Unable to retrieve company details")
    else:
        result = cur.fetchone()
        return result

# Update company_id's company info
def update_company_details(company_id, updated_info):
    try:
        cur.execute(f"UPDATE company SET company_info = '{updated_info}' WHERE company_id = '{company_id}'")
    except:
        error_helper(connection= "Unable to update company details")
    else:
        connection.commit()
        return True

# Returns the form_id of the company_verification_form sent by given user_id
def get_company_verification_form_id(user_id):
    try:
        cur.execute(f"SELECT form_id FROM company_verification_form WHERE user_id = '{user_id}'")
    except:
        error_helper(connection, "Error fetching company's verification form id")
    else:
        form_id = cur.fetchone()
        return form_id

# Adds a reviewer verification form into DB
def send_reviewer_verification_form(user_id, name, company_id, link, message, date):
    try:
        form_datetime = datetime.strptime(date, '%d/%m/%Y %H:%M')
        if (not company_id == -1):
            cur.execute(f"INSERT INTO reviewer_verification_form (user_id, name, company_id, link, message, date, status) \
                VALUES ('{user_id}', '{name}', '{company_id}', '{link}', '{message}', '{form_datetime}', 'reviewing')")
        else:
            cur.execute(f"INSERT INTO reviewer_verification_form (user_id, name, company_id, link, message, date, status) \
                VALUES ('{user_id}', '{name}', null, '{link}', '{message}', '{form_datetime}', 'reviewing')")
    except:
        error_helper(connection, "Error inserting reviewer verification form into db")
    else:
        connection.commit()
        return True

# Returns the form_id of the reviewer_verification_form sent by given user_id
def get_reviewer_verification_form_id(user_id):
    try:
        cur.execute(f"SELECT form_id FROM reviewer_verification_form WHERE user_id = '{user_id}'")
    except:
        error_helper(connection, "Error fetching reviewer's verification form id")
    else:
        form_id = cur.fetchone()
        return form_id

############# USER PROMOTION AND DEMOTION #################

# Admin function to promote user account_type to either 'reviewer' or 'company'
# depending on what is passed in through the FE
# Returns True if DB updates are successful
def promote_user(user_type, email, company_id):

    # Extract user id from email
    account = get_account(email)
    user_id = account[0]

    # Set initial return value to False
    promotion_success = False

    # Promotion to 'reviewer' status
    if (int(company_id) == -1 and user_type == 'reviewer'):
        # check if user has a pending verification form and set the forms status to 'accepted'
        # promote account_status to 'reviewer'
        if accept_form_if_exists('reviewer_verification_form', user_id) and edit_account_variable(user_id, 'account_type', 'reviewer') and \
            edit_account_variable(user_id, 'company_id', 'null'):
            promotion_success = True
    # Promotion to 'company' status
    elif (int(company_id) > -1 and user_type == 'company'):
        # check if user has a pending verification form and set the forms status to 'accepted'
        # promote account_status to 'reviewer' 
        if accept_form_if_exists('company_verification_form', user_id) and edit_account_variable(user_id, 'account_type', 'company') and \
            edit_account_variable(user_id, 'company_id', company_id):
            promotion_success = True
            # Delete all reviews made by the account when upgrading to company account
            delete_all_user_reviews(user_id)


    # returns true if promotion was successful, else false
    return promotion_success

# Given the email, change their account_type to 'normal'
def demote_user(email):
    account = get_account(email)
    edit_account_variable(account[0], 'account_type', 'normal')
    edit_account_variable(account[0], 'company_id', 'null')
    return True

# helper function to check if given user has any existing forms
def accept_form_if_exists(form_type, user_id):
    try:
        cur.execute(f"SELECT COUNT(*) FROM {form_type} WHERE user_id = '{user_id}' AND status = 'reviewing'")
    except:
        error_helper(connection, "Error getting count of forms from DB")
    else:
        if cur.fetchone()[0] != 0:
            update_verification_form(form_type, 'accepted', user_id)
            
    return True

# helper function to change verification form status for given user
def update_verification_form(form_type, status, user_id):
    try:
        cur.execute(f"UPDATE {form_type} SET status = {status} WHERE user_id = {user_id}")
    except:
        error_helper(connection, "Error updating verification form")
    else:
        connection.commit()
        return True



############# COMPANY POSTS #######################

# Inserts a new company post into the DB
def add_company_post(company_id, post_title, post_content):
    try:
        cur.execute(f"INSERT INTO company_post (company_id, post_title, post_content) \
            VALUES ('{company_id}', '{post_title}', '{post_content}')")
        connection.commit()
        cur.execute(f"SELECT post_id FROM company_post WHERE company_id = '{company_id}' AND post_title = '{post_title}'")
        post_id = cur.fetchone()
    except:
        error_helper(connection, "Error adding company post to DB")
    else:
        return post_id[0]

# Delete company post given the post_id
def delete_company_post(post_id):
    try:
        cur.execute(f"DELETE FROM company_post WHERE post_id = '{post_id}'")
    except:
        error_helper(connection, "Error deleting company post")
    else:
        connection.commit()
        return True

# Edits company post with new data given the post_id
def edit_company_post(post_id, new_title, new_content):
    try:
        cur.execute(f"UPDATE company_post SET post_title = '{new_title}' WHERE post_id = '{post_id}'")
        cur.execute(f"UPDATE company_post SET post_content = '{new_content}' WHERE post_id = '{post_id}'")
    except:
        error_helper(connection, f"Error updating company post id '{post_id}'")
    else:
        connection.commit()
        return True

def get_company_posts(company_id):
    try:
        cur.execute(f"SELECT * FROM company_post WHERE company_id = '{company_id}'")
    except:
        error_helper(connection, "Error fetching company's posts")
    else:
        res = cur.fetchall()
        posts = { 'posts': [] }
        author = get_company_name_from_id(company_id)
        for r in res:
            posts['posts'].append({
                'author': author,
                'id': r[0],
                'title': r[2],
                'content': r[3]
            })
        posts['author'] = author
        return posts

######### ACCEPTING/DENYING FORMS ###########

def deny(form_id, type, user_id, username):
    if type == 'reviewer':
        try:
            cur.execute(f"SELECT email FROM movie_user WHERE user_id = '{user_id}'")
            receiver_email = cur.fetchone()
            #send_email(receiver_email, "Verification denied", "Your verification has been denied")
            
            cur.execute(f"UPDATE reviewer_verification_form SET status = 'rejected' WHERE form_id = '{form_id}'")
            connection.commit()
        except:
            error_helper(connection, "Error denying reviewer verification form")
        else:
            return True
    elif type == 'company':
        try:
            cur.execute(f"SELECT email FROM movie_user WHERE user_id = '{user_id}'")
            receiver_email = cur.fetchone()
            send_email(receiver_email, "Verification denied", "Your verification has been denied")
            
            cur.execute(f"UPDATE company_verification_form SET status = 'rejected' WHERE form_id = '{form_id}'")
            connection.commit()
        except:
            error_helper(connection, "Error denying company verification form")
        else:
            return True
    else:
        error_helper(connection, "Invalid form type")

def accept(form_id, formType, user_id, username, company_id):
    if formType == 'reviewer':
        try:
            edit_account_variable(user_id, 'account_type', formType)
            cur.execute(f"UPDATE reviewer_verification_form SET status = 'accepted' WHERE form_id = '{form_id}'")
            connection.commit()
            cur.execute(f"SELECT email FROM movie_user WHERE user_id = '{user_id}'")
            receiver_email = cur.fetchone()
            send_email(receiver_email, "Verification accepted", "Your verification has been accepted")
        except:
            error_helper(connection, "Error denying company verification form")
        else:
            return True
    elif formType == 'company':
        try:
            edit_account_variable(user_id, 'account_type', formType)
            edit_account_variable(user_id, 'company_id', company_id)
            cur.execute(f"UPDATE company_verification_form SET status = 'accepted' WHERE form_id = '{form_id}'")
            connection.commit()
            cur.execute(f"SELECT email FROM movie_user WHERE user_id = '{user_id}'")
            receiver_email = cur.fetchone()
            send_email(receiver_email, "Verification accepted", "Your verification has been accepted")
        except:
            error_helper(connection, "Error denying company verification form")
        else:
            delete_all_user_reviews(user_id)
            return True
    else:
        error_helper(connection, "Invalid form type")
    
def send_email(receiver_email, message_subject, message):
    with smtplib.SMTP_SSL('smtp.gmail.com', port, context=ssl.create_default_context()) as server:
        message = f"""\
Subject: {message_subject}

{message}"""
        server.login(sender_email, email_password)
        server.sendmail(sender_email, receiver_email, message)

def get_company_representatives(company_id):
    try:
        cur.execute(f"SELECT username FROM movie_user WHERE company_id = '{company_id}'")
        users = cur.fetchall()
        reps = []
        for u in users:
            reps.append({'username': u[0]})
        pass
    except:
        error_helper(connection, "Unable to get company representatives")
    else:
        return reps

################## Chatbot Functions #############################
def insert_chatbot_answer(movie_id, enjoyment, recommended, discover, platform, reason, days_since_release, date, uid):
    if not isinstance(enjoyment, bool):
        if (enjoyment is not None):
            error_helper(connection, "Variable type is not type bool")
    if not isinstance(recommended, bool):
        if (recommended is not None):
            error_helper(connection, "Variable type is not type bool")
    if not isinstance(discover, str):
        if (discover is not None):
            error_helper(connection, "Variable type is not type string")
    if not isinstance(platform, str):
        error_helper(connection, "Variable type is not type string")
    if not isinstance(reason, str):
        if (reason is not None):
            error_helper(connection, "Variable type is not type string")    
    if not isinstance(movie_id, int):
        error_helper(connection, "Variable type is not type int")
    if not isinstance(days_since_release, int):
        if (days_since_release is not None):
            error_helper(connection, "Variable type is not type int")
    if not isinstance(uid, int):
        error_helper(connection, "Variable type is not type int")
    if not isinstance(date, str):
        error_helper(connection, "Variable type is not type string")

    queryString = f"INSERT INTO chatbot_answer (movie_id, user_id, enjoyment, recommended, discover, platform, reason, days_since_release, date) VALUES \
                   ('{movie_id}', '{uid}', "
    queryString += f"null, null, null, '{platform}', null, null, '{date}')" if (platform == "Not watched") else \
                   f"'{enjoyment}', '{recommended}', '{discover}', '{platform}', '{reason}', '{days_since_release}', '{date}')"
    try:
        cur.execute(queryString)
    except:
        error_helper(connection, "Unable to insert chatbot answer")
    else:
        connection.commit()
        return True
    
def get_chatbot_answers(movie_id):
    try:
        cur.execute(f"SELECT * FROM chatbot_answer WHERE movie_id = '{movie_id}'")
        chatbot_answers = cur.fetchall()
    except:
        error_helper(connection, "Unable to get chatbot answers")
    else:
        # Convert chatbot_answers to json.
        return convert_chatbot_answers_json(chatbot_answers)

def convert_chatbot_answers_json(chatbot_answers):
    json_list = []
    for row in chatbot_answers:
        obj = {
            'enjoyment': row[3],
            'recommended': row[4],
            'discover': row[5],
            'platform': row[6],
            'reason': row[7],
            'days_since_release': row[8],
            'date': str(row[9].day) + '/' + str(row[9].month) + '/' + str(row[9].year)
        }
        json_list.append(obj)
    return json_list

def clear_all():
    cur.execute("DELETE FROM company_verification_form")
    cur.execute("ALTER SEQUENCE company_verification_form_form_id_seq RESTART")
    cur.execute("UPDATE company_verification_form SET form_id = DEFAULT")

    cur.execute("DELETE FROM movie_review")
    cur.execute("ALTER SEQUENCE movie_review_review_id_seq RESTART")
    cur.execute("UPDATE movie_review SET review_id = DEFAULT")

    cur.execute("DELETE FROM chatbot_answer")
    cur.execute("ALTER SEQUENCE chatbot_answer_answer_id_seq RESTART")
    cur.execute("UPDATE chatbot_answer SET answer_id = DEFAULT")

    cur.execute("DELETE FROM movie_user")
    cur.execute("ALTER SEQUENCE movie_user_user_id_seq RESTART")
    cur.execute("UPDATE movie_user SET user_id = DEFAULT")

    cur.execute("DELETE FROM movie")
    cur.execute("ALTER SEQUENCE movie_movie_id_seq RESTART")
    cur.execute("UPDATE movie SET movie_id = DEFAULT")

    cur.execute("DELETE FROM company_post")
    cur.execute("ALTER SEQUENCE company_post_post_id_seq RESTART")
    cur.execute("UPDATE company_post SET post_id = DEFAULT")

    cur.execute("DELETE FROM company")
    cur.execute("ALTER SEQUENCE company_company_id_seq RESTART")
    cur.execute("UPDATE company SET company_id = DEFAULT")

    cur.execute("DELETE FROM wishlist_movie")
    connection.commit()

