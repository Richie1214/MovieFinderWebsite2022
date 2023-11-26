import profile
from re import M
from tokenize import String
from flask import Flask, request
from auth import account_create, account_login
from flask_cors import CORS
from json import dumps
from error import Error

from userToken import generate_token, email_from_token
from wishlist import get_wishlist_helper
from movie import *
from image import upload_profile_image_path, get_profile_image_path
from review import *
from database_management import *
from banned import block_user, unblock_user
from helper import *

from error import Error

def defaultHandler(err):
    response = err.get_response()
    print('response', err, err.get_response())
    response.data = dumps({
        "code": err.code,
        "name": "System Error",
        "message": err.get_description(),
    })
    response.content_type = 'application/json'
    return response

APP = Flask(__name__)
CORS(APP)
APP.config['TRAP_HTTP_EXCEPTIONS'] = True
APP.register_error_handler(Exception, defaultHandler)

@APP.route("/auth/register", methods=['POST'])
def auth_register():
    payload = request.get_json()
    username = payload["username"]
    password = payload["password"]
    email = payload["email"]
    name = payload["name"]
    gender = payload["gender"]

    ret = account_create(username, password, email, name, gender)
    return dumps({ "token": ret['token'], "uid": ret['uid'] })
    # payload will be a json dictionary, with username, password, email, name, gender, display
    # We will pass the email into the database to see if it exists. If it does, pass
    # an error to the frontend. Else, pass token
    # pass

@APP.route("/auth/login", methods=['POST'])
def auth_login():
    payload = request.get_json()
    email = payload["email"]
    password = payload["password"]
    token = account_login(email, password)
    details = get_account(email)

    # Check user login and if the user is a company account, return the company id as well
    account_type = details[7]
    if account_type == 'company':
        return dumps({ "token": token, "username": details[1], "uid": details[0], "is_company": True, "cid": details[10]})
    else:
        return dumps({ "token": token, "username": details[1], "uid": details[0], "is_company": False })
    # payload will be a json dictionary with email and password. We will pass this into the
    # database to see if it exists. If it does, generate the token, and pass it to frontend
    # pass

@APP.route("/usertype", methods=['GET'])
def get_usertype():
    user_id = request.headers['uid']
    # Return the user type of this user.
    # return something like {'type': string}, where type can be site_admin, normal,
    # verified, company
    return dumps({'type': get_account_status(user_id)})

# Might need this to invalidate the token on the backend? But there won't be
# a token in local storage so maybe not.......
# @APP.route("/auth/logout", methods=['POST'])
# def auth_logout():
#     payload = request.get_json()
#     u_id = payload["u_id"]

#     return auth_logout(u_id)

# return a list containing 5(?) (id, name, rating, image) tuples for popular movies
@APP.route("/movies/popular", methods=['GET'])
def movies_popular():
    return dumps(popular_movies())

# return a list containing the (id, name, rating, image) tuples for the top 5 movies
# with the highest average rating
@APP.route("/movies/top", methods=['GET'])
def movies_top():
    return dumps(top_movies())

# search results and suggestions are basically the same except suggestions
# returns less movies and without a rating

# return a list containing the (id, name, rating, image) tuples for 10 movies where the keywords
# match the movie name, description, or genre
# NOTE api gets results in packs of 20 so I'm just making it 20 movies instead of 10
# also, can probably just reuse the results function for suggestions
@APP.route("/search/results", methods=['POST'])
def search_results():
    payload = request.get_json()
    return dumps(search_movie(payload['keywords'], payload['page']))

# return a list containing the (id, name, image) tuples for 4 movies
@APP.route("/search/suggestions", methods=['POST'])
def search_suggestions():
    payload = request.get_json()
    return dumps(movie_suggestions(payload["keywords"]))

@APP.route("/profile/delete", methods=['DELETE'])
def profile_delete():
    payload = request.get_json()
    check_auth(request)
    return dumps({'result': delete_account(payload['uid'])})

@APP.route("/profile/edit/username", methods=['PUT'])
def edit_profile_username():
    payload = request.get_json()
    check_auth(request)
    edit_account_variable(get_user_id(request), "username", payload['username'])
    return dumps({})

@APP.route("/profile/edit/email", methods=['PUT'])
def edit_profile_email():
    payload = request.get_json()
    check_auth(request)
    new_email = payload['email']
    edit_account_variable(get_user_id(request), "email", new_email)
    return dumps({ 'token': generate_token(new_email) })
 
@APP.route("/profile/edit/name", methods=['PUT'])
def edit_profile_name():
    payload = request.get_json()
    check_auth(request)
    edit_account_variable(get_user_id(request), "real_name", payload['name'])
    return dumps({})

@APP.route("/profile/edit/bio", methods=['PUT'])
def edit_profile_bio():
    payload = request.get_json()
    check_auth(request)
    edit_account_variable(get_user_id(request), "bio", payload['bio'])
    return dumps({})

@APP.route("/profile/edit/gender", methods=['PUT'])
def edit_profile_gender():
    payload = request.get_json()
    check_auth(request)
    edit_account_variable(get_user_id(request), "gender", payload['gender'])
    return dumps({})
    
@APP.route("/profile/edit/hyperlinks", methods=['PUT'])
def edit_profile_hyperlinks():
    # Need to edit for hyperlinks.
    # payload['hyperlinks'] is an array.
    # Need to make sure that they are a verified reviewer
    payload = request.get_json()
    check_auth(request)
    edit_account_variable(get_user_id(request), "hyperlinks", payload['hyperlinks'])
    return dumps({})

@APP.route("/profile/edit/profilepic", methods=['PUT'])
def edit_profile_profilepic():
    payload = request.get_json()
    check_auth(request)
    upload_profile_image_path(payload['id'], payload['img'])
    return dumps({})

# View a user's profile
@APP.route("/profile/view", methods=['GET'])
def view_profile():
    # NEW /profile/view should also return whether they are a verified reviewer or not.
    # Should also return hyperlinks
    # so should also include key value pairs: 'hyperlinks': (Array), 'verified': (bool)
    uid = request.headers['uid']
    details = get_user_profile(uid)
    details['img'] = check_profile_image(uid)
    return dumps(details)

# params:
# u_id - id of the current user
# return:
# list of (image, username, id) tuples of each user in the ban list
@APP.route("/banlist/view", methods=['POST'])
def banlist_view():
    payload = request.get_json()
    final_list = []
    uid = payload['uid']
    banned_ids = get_blocked_list(uid)
    for banned_user in banned_ids:
        final_list.append({
            'image': check_profile_image(uid),
            'username': get_account_by_id(banned_user)[1],
            'id': banned_user
        })
    return dumps({'banlist': final_list})

@APP.route("/banlist/add", methods=['POST'])
def banlist_add_user():
    payload = request.get_json()
    check_auth(request)
    user_id = payload['uid']
    block_id = payload['block_id']
    # returns {'result': True} if successful
    return dumps({'result': block_user(user_id, block_id)})

@APP.route("/banlist/remove", methods=['DELETE'])
def banlist_remove_user():
    payload = request.get_json()
    check_auth(request)
    user_id = payload['uid']
    block_id = payload['block_id']
    # returns {'result': True} if successful
    return dumps({'result': unblock_user(user_id, block_id)})

@APP.route("/wishlist/all", methods=['POST'])
def obtain_wishlist():
    payload = request.get_json()
    check_auth(request)
    return dumps(get_wishlist_helper(payload['uid']))

@APP.route("/wishlist/other", methods=['GET'])
def obtain_other_wishlist():
    uid = request.headers['uid']
    return dumps(get_wishlist_helper(uid))

@APP.route("/wishlist/add", methods=['POST'])
def wishlist_add_movie():
    payload = request.get_json()
    check_auth(request)
    return dumps({'result': add_wishlist_movie(get_user_id(request), payload['movie_id'], payload['date_added'])})

@APP.route("/wishlist/remove", methods=['DELETE'])
def wishlist_remove_movie():
    payload = request.get_json()
    check_auth(request)
    return dumps({'result': delete_wishlist_movie(get_user_id(request), payload['movie_id'])})

# BIG NOTE: Someone also update the path /review/userdetail to also include a keyvalue pair
# of chatbot: bool. This is to check if they have answered a chat bot question.
@APP.route("/review/userdetails", methods=['GET'])
def obtain_user_information():
    # Return value:
    # {limit_reached: bool, 'verified': get_account_verified_status(payload['username']), 'company': bool}
    # payload = request.get_json()
    username = request.headers['username']
    # Below still needs updating!
    # Function takes in user id and checks if they are able to post a review
    company_status = get_account_company_status(username)
    if company_status is False:
        company_affiliated = False
    else:
        company_affiliated = True

    return dumps({
        'limit_reached': not review_allowed(request.headers['uid']), 
        'verified': get_account_verified_status(request.headers['username']),
        'company': company_affiliated
    })

@APP.route("/moviedetails", methods=['GET'])
def get_moviedetails():
    user_id = request.headers['uid']
    movieId = request.headers['Movieid']
    if user_id:
        return get_movie(movieId, user_id)
    else: 
        return get_movie(movieId, [])

# params:
# id - id of the movie currently being viewed
# return:
# list of (id, name, image) tuples for 5(?) similar movies where is similarity determined by
# "at least review history, and a selection of 
# multiple attributes that a user can select 
# (e.g., genre and/or director)." - from the spec
@APP.route("/movies/suggested", methods=['GET'])
def movies_suggested():
    movie_tuple_list = []
    current_movie_id = request.headers['movie_id']
    user_id = request.headers['user_id']
    same_genre = request.headers['genre']
    same_director = request.headers['director']
    recommended_movies = get_recommended_movies(current_movie_id, user_id, same_genre, same_director)

    # Create and append tuples to return (id, name, image)
    for movie in recommended_movies:
        movie_details = get_movie_details(movie)
        movie_tuple = ({'id': movie, 'name': movie_details["movie_details"]["title"], 'poster_path': movie_details["movie_details"]["poster_path"]})
        movie_tuple_list.append(movie_tuple)
    print(movie_tuple_list)
    return dumps({ "movies": movie_tuple_list })

@APP.route("/review/add", methods=['POST'])
def review_insert():
    # Just remember that there is a limit on the number of reviews people are allowed
    # to make per day. Verified reviewers can bypass this limit. 
    # This will have to be accounted for.                                             (Date)  (24 hour Time)    
    # payload will contain the keys: 'uid', 'content', 'movie_id', 'rating', 'date' (dd/mm/yyyy hh:mm), 
    # 'hyperlinks' (list of strings to youtube videos or something)
    # 'verified' is a boolean. If the reviewers are verified, then they can add website & video links (under hyperlinks)
    payload = request.get_json()
    check_auth(request)
    # Should return something like {review_id: INT} to the frontend
    return dumps(make_review(payload))

@APP.route("/review/edit", methods=['PUT'])
def review_edit():
    # payload will contain keys: 'uid', 'review_id', 'content', 'rating', 'hyperlinks'
    payload = request.get_json()
    check_auth(request)
    # Return {result: true} or something to that effect.
    return dumps(change_review(payload))

@APP.route("/review/delete", methods=['DELETE'])
def review_delete():
    # payload will contain keys: 'review_id'
    payload = request.get_json()
    check_auth(request)
    # Should return something like {result: true} or something like that
    # return dumps(BLAH IDK insert something here hehe)
    return dumps(remove_review(payload))

# Note that for verified reviewers or movie companies, we should probably
# make a new table or something for them. Up to you.

@APP.route("/verification_form/reviewer/submit", methods=['POST'])
def send_reviewer_verif_form():
    # We might need to make a new table for companies, reviewer_verification_form
    # payload will contain keys: 'uid'(the requester uid), 'name', 'company_id' (optional), 'link' (string which is
    # URLs to linkedIn) (optional), 'message', 'date' (which will contain dd/mm/yyyy hourhour:minmin)
    # 'files' (these are files which are uploaded
    # by the user to give credibility. How you want to store this is up to you. optional)
    payload = request.get_json()
    check_auth(request)
    send_reviewer_verification_form(payload['uid'], payload['name'], payload['company_id'],
                                    payload['link'], payload['message'], payload['date'])
    # Should return something like: {reviewer_verif_id: int}
    return dumps({'reviewer_verif_id': get_reviewer_verification_form_id(payload['uid'])})

@APP.route("/verification_form/company/submit", methods=['POST'])
def send_company_verif_form():
    # May need to make a new table for company_verification_forms
    # payload will contain keys: 'uid', 'company_id', 'company_name', 'link', 'files' (optional), 
    # 'company_website' (optional), 'phone' (optional), 'message' (optional),
    # 'date' (which will contain dd/mm/yyyy hourhour:minmin)
    # Note that company_id will be -1 if a company_name is provided (this occurs when the user
    # wants to create a new company on the site). Otherwise, company_id will be >= 0, whilst
    # company_name will be an empty string.
    payload = request.get_json()
    check_auth(request)
    send_company_verification_form(payload['uid'], payload['company_id'], payload['company_name'], 
                                   payload['link'],    payload['company_website'],
                                   payload['phone'], payload['message'], payload['date'])
    # should return something like {company_verif_id: int}
    return dumps({'company_verif_id': get_company_verification_form_id(payload['uid'])})
    
@APP.route("/verification_form/valid_apply", methods=['GET'])
def obtain_user_details_for_verif_form():
    # Here, I will pass in the uid in the header.
    # Basically, this is a check for if the user can apply for approved reviewer or company account.
    # Return something like: {num_reviews: int, reviewer_form_already_sent: bool, company_form_already_sent: bool}
    # payload = request.get_json()
    check_auth(request)
    uid = request.headers['uid']
    uid_email = get_account_by_id(request.headers['uid'])[3]
    num_reviews = len(get_user_reviews(uid_email))
    return dumps({'num_reviews': num_reviews,
                  'reviewer_form_already_sent': check_verif_form_already_sent(uid), 
                  'company_form_already_sent': check_company_verif_form_already_sent(uid)})

@APP.route("/companies/all", methods=['GET'])
def get_companies():
    # Here, we simply return the list of companies to the frontend.
    # The return dict should be like {companies: [{id: int, name: string}]}
    # Those are the basic things which I think would be needed. I think an image
    # might also help as well. But if you add anything more, tell me (Tim).
    # return dumps({})
    return dumps({'companies': get_all_companies()})

@APP.route("/verification_form/user", methods=['GET'])
def obtain_verif_forms_user():
    # Obtain the verification forms submitted by the user
    # Header will contain 'uid'
    # {reviewer_forms: [{'form_id': int, 'company_name': string, 'link': string,
    #                   'message': string, 'files': [binary or something idk lol]}, 'uid': int
    #                   'username': string, 'date': string, 'status': string],
    #  company_forms: [{'form_id': int, 'company_name': string, 'link': string,
    #                   'message': string, 'files': binary or sometin, 'company_website': string,
    #                   'phone': string, 'uid': int, 'username': string, 'date': string, 'status': string}]
    # }
    #  Note: dates should be in the format: dd/mm/yyyy hourhour:minmin. It would also be good
    #  to sort each list by the date as well.
    #  Note 2: Status can be something like "reviewing", "accepted", "rejected"
    # payload = request.get_json()
    uid = request.headers['uid']
    reviewer_form_list = get_verification_forms_from_user(uid)
    company_form_list = get_company_verification_forms_from_user(uid)
    return dumps({'reviewer_forms': reviewer_form_list, 'company_forms': company_form_list})

@APP.route("/verification_form/all", methods=['GET'])
def obtain_verif_forms():
    # Here, we simply return the list of all verification forms. (site admin will use this)
    # The return dict should be something like:
    #  {reviewing_reviewer_forms: [{'form_id': int, 'company_name': string, 'link': string,
    #                    'message': string, 'files': [binary or something idk lol]}, 'uid': int
    #                    'username': string, 'date': string, 'status': string],
    #   reviewing_company_forms: [{'form_id': int, 'company_name': string, 'link': string,
    #                    'message': string, 'files': binary or sometin, 'company_website': string,
    #                    'phone': string, 'uid': int, 'username': string, 'date': string, 'status': string}],
    #   reviewed_reviewer_forms: [{'form_id': int, 'company_name': string, 'link': string,
    #                    'message': string, 'files': [binary or something idk lol]}, 'uid': int
    #                    'username': string, 'date': string, 'status': string],
    #   reviewed_company_forms: [{'form_id': int, 'company_name': string, 'link': string,
    #                    'message': string, 'files': binary or sometin, 'company_website': string,
    #                    'phone': string, 'uid': int, 'username': string, 'date': string, 'status': string}]
    #  }
    # reviewing_* contains the forms that have a status of "reviewing"
    # reviewed_* contains the forms that have already been given a status of "accepted" or "rejected"
    # Each list is sorted by date
    # payload = request.get_json()
    check_auth(request)
    uid = request.headers['uid']
    # need to put in check here to see if uid is a site admin
    return dumps({'reviewing_reviewer_forms': get_reviewer_forms_under_review(), 
                  'reviewing_company_forms': get_company_forms_under_review(),
                  'reviewed_reviewer_forms': get_reviewer_forms_already_reviewed(),
                  'reviewed_company_forms': get_company_forms_already_reviewed()
    })

@APP.route("/verification_form/deny", methods=['POST'])
def send_deny():
    # This path is for denying a form. Remember that an email must be sent to
    # the applicant stating something like:
    # Hi user,
    #     Thank you for taking your time to apply to be a verified reviewer.
    #     Unfortunately, at this moment in time, we will not progress with your
    #     application. Please keep in touch for further opportunities
    #     (Above is just a joke, but you should get the idea ahaha)
    # payload will contain 'form_id', 'type' (reviewer or company), 'uid' (int),
    #                       'username': string
    payload = request.get_json()
    form_id = payload['form_id']
    formType = payload['type']
    uid = payload['uid']
    username = payload['username']
    return dumps({'result': deny(form_id, formType, uid, username)})

@APP.route("/verification_form/confirm", methods=['POST'])
def send_accept():
    # payload will contain 'form_id', 'type', 'uid', 'username'
    # Make sure that when a movie company rep is accepted, we remove all of their reviews.
    # Make sure that if the person is applying for a company rep, we create a new company
    # (if they requested for a new company)
    payload = request.get_json()
    form_id = payload['form_id']
    formType = payload['type']
    uid = payload['uid']
    username = payload['username']
    # Create the company if not an existing company.
    if (formType == 'company' and payload['company_id'] == -1):
        # Create the company first, then insert.
        payload['company_id'] = create_company(payload['company_name'])
    return dumps({'result': accept(form_id, formType, uid, username, payload['company_id'])})
    # return something like: {result: true} or something to indicate success

# =============================== David: SPRINT 3 PATHS ================================

# payload:
# - id: company id
# response:
# - name: company name
# - url: link to their website
# - info: company info
# - posts: list of {} need to figure out what we want to show
# - members: list of { username: "", image: ""} objects
@APP.route("/company/details/view/<company_id>", methods=['GET'])
def company_details_view(company_id):
    details = get_company_posts(company_id)
    details['members'] = get_company_representatives(company_id)
    details['info'] = get_company_info(company_id)
    return dumps(details)

# payload:
# - id: company id
# - info: updated information
# response:
# - { success: boolean }
@APP.route("/company/details/edit", methods=['PUT'])
def company_details_edit():
    payload = request.get_json()
    company_id = payload['id']
    info = payload['info']
    return dumps({'success': update_company_details(company_id, info)})

# payload:
# - id: company id
# - title: title of post
# - content: content of post
# - multimedia: multimedia link
# - img: path to attached img (might not be needed depending on backend implementation?)
# response:
# - id: post id
@APP.route("/company/post/add", methods=['POST'])
def company_post_add():
    payload = request.get_json()
    title = payload['title']
    content = payload['content']
    company_id = payload['id']
    return dumps({'id': add_company_post(company_id, title, content)})

# payload:
# - id: post id
# response:
# - { success: boolean }
@APP.route("/company/post/delete/<post_id>", methods=['DELETE'])
def company_post_delete(post_id):
    # delete_company_post will only return if it's successful (it won't return False)
    # maybe just do a check 'if success == True, else ....'
    return dumps({'success': delete_company_post(post_id)})

# payload:
# - id: post id
# - title: new title of post
# - img: new img of post
# - embed: new embed of post
# - content: new content of post
# response:
# - { success: boolean }
@APP.route("/company/post/edit", methods=['PUT'])
def company_post_edit():
    payload = request.get_json()
    post_id = payload['p_id']
    new_title = payload['title']
    new_content = payload['content']
    # edit_company_post will only return if it's successful (it won't return False)
    # maybe just do a check 'if success == True, else ....'
    return dumps({'success': edit_company_post(post_id, new_title, new_content)})

# Extracts details from all posts of a given company
@APP.route("/company/posts/<company_id>", methods=['GET'])
def company_posts_get(company_id):
    return dumps(get_company_posts(company_id))
    
# =============================== Tim: SPRINT 3 PATHS ================================

@APP.route("/chatbot_answered", methods=['GET'])
def get_chatbot_answered():
    # This route is for checking if the user has answered the chatbot.
    # header contains uid, movie_id
    # Check that the user has answered a chatbot
    return dumps({ "chatbot": check_chatbot_interaction(request.headers['uid'], request.headers['movie_id'])})

@APP.route("/promote", methods=['POST'])
def promote():
    # This route is for directly promoting a user to a company account or verified reviewer
    # payload will contain 'userType' (company or reviewer), 'email', and 'company_id' (this is -1
    # if 'userType' is not company)
    # If promoting user to company account, then if the user had a company form that was under
    # review, set that status to accepted. OR if the user had a reviewer form that was under review,
    # set it's status to rejected.
    # vice versa for promoting to verified reviewer
    payload = request.get_json()
    user_type = payload['userType']
    email = payload['email']
    company_id = payload['company_id']
    return dumps({'success': promote_user(user_type, email, company_id)})

@APP.route("/demote", methods=['POST'])
def demote():
    # This route is for directly demoting a user to a normal account.
    # payload will contain 'email'
    payload = request.get_json()
    email = payload['email']
    return dumps({'success': demote_user(email)})

@APP.route("/chatbot_answers", methods=['POST'])
def submit_chatbot():
    # Submit the answers to the chatbot, which will be stored.
    # payload will contain: 'answers', which will be a dictionary of key:value pairs.
    # this dictionary will contain: 'enjoyment': (bool), 'recommended': (bool), 'discover': (string),
    # 'platform': (string), 'reason': (string), 'time_of_view_since_release': int, 'date': dd/mm/yyyy hh:mm
    # Explanation of the above key value pairs:
    # 'enjoyment' = did you enjoy this movie
    # 'recommended' = would you recommend to others
    # 'discover' = where did you see this movie advertised
    # 'platform' = which platforms did you see the movie on
    # 'reason' = why did you watch this movie
    # 'time_of_view_since_release' = number of days after the movie was released, in which the user watched the movie.
    # 'date' = current date of answer.
    # I don't know what else to put in the dictionary lol
    payload = request.get_json()
    uid = payload['uid']
    uid = int(uid)
    movie_id = payload['movie_id']
    movie_id = int(movie_id)
    enjoyment = payload.get('enjoyment')
    recommended = payload.get('recommended')
    discover = payload.get('discover')
    platform = payload['platform']
    reason = payload.get('reason')
    days_since_release = payload.get('days_since_release')
    date = payload['date']
    insert_chatbot_answer(movie_id, enjoyment, recommended, discover, platform, reason, days_since_release, date, uid)
    return dumps({})

# Returns dictionary of chatbot responses for a particular movie
@APP.route("/analytics", methods=['GET'])
def get_analytics():
    # The HEADER (not payload) will contain 'movie_id', corresponding to a movie id.
    # Here, I will need all the chatbot answers, as well as the count of all descriptive words that have been used in
    # the reviews (so exclude words like 'the', 'at', and other words like those)
    # Return something like:
    # {'chatbot': [{'enjoyment': , 'recommended': , and the remaining key
    #              value pairs defined in /chatbot_answers}, Object, Object, ...],
    #  'review_words': [{'exampleword': 1000}, {'secondexampleword': 965}, Obj, Obj, ...]
    #   I'm returning 'review_words' as a dictionary instead!!!!
    # }
    movie_id = request.headers['movie_id']
    chatbot_answers = get_chatbot_answers(movie_id)
    word_frequency = review_word_frequency(movie_id)
    return dumps({'chatbot': chatbot_answers, 'review_words': word_frequency})

def check_auth(request):
    token = request.headers['token']
    # Obtain the email from the token.
    email = email_from_token(token)
    if (len(get_account(email)) == 0):
        raise Error(description='Token is invalid.')

# Takes user_id of the account linked to the token in a given request
def get_user_id(request):
    token = request.headers['token']
    email = email_from_token(token)
    account = get_account(email)
    return account[0]

if __name__ == "__main__":
    APP.run(port=8080)
