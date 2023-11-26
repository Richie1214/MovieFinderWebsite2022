import hashlib
import random
import smtplib
import ssl
import string
import psycopg2
import re
from error import Error
from database_management import *
from userToken import generate_token
from helper import *

email_regex = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
email_dict = []
active_user_dict = []

connection = psycopg2.connect(
    dbname= "movieFinder",
    user = "postgres",
    password = "postgres",
)
cur = connection.cursor()

def connect():
    global connection
    global cur
    connection.close()
    connection = psycopg2.connect(
        host = "localhost",
        database = "movieFinder",
        user = "postgres",
        password = "postgres",
    )
    cur = connection.cursor()

def close():
    connection.close()

def account_create(username, password, email, name, gender):
    # May need to check value types here before entering into db
    # Check if username/email already exists
    
    # Validate email
    if not email.isascii():
        raise Error(description="Email must be in ASCII.")

    if not re.search(email_regex, email):
        raise Error(description="Email is not valid.")

    if value_exists('email', 'movie_user', email):
        raise Error(description="Email already exists.")

    # Validate password
    if not password.isascii():
        raise Error(description="Password must be in ASCII.")
        
    if len(password) < 8:
        raise Error(description="Password must be at least 8 characters.")

    password = encrypt_password(password)

    # Validate username and name
    if not (username.isascii() and name.isascii()):
        raise Error(description="Names must be in ASCII.")

    if value_exists('username', 'movie_user', username):
        raise Error(description="Username already exists.")

    if (len(name) > 25 or len(username) > 25):
        raise Error(description="Username must be a maximum of 25 characters.")


    # If all checks pass, send email confirmation
    # valid_code = email_code_generator
    # send_email_verification(email, name, valid_code)

    # TODO: Check that email has been confirmed

    # Add new user into DB once email is confirmed

    user_db = get_all_accounts()
    if not user_db:
        # Check the user db entries and if empty, the user created is a site admin instead
        cur.execute(f"INSERT INTO movie_user \
            (username, user_password, email, real_name, gender, bio, account_type, \
            verified, company, company_id, last_online, reviews_today) \
            VALUES (\'{username}','{password}', '{email}', '{name}', '{gender}', '', 'site_admin', \
            false, false, null, '{datetime.now()}', 0)")
    else:
        cur.execute(f"INSERT INTO movie_user \
            (username, user_password, email, real_name, gender, bio, account_type, \
            verified, company, company_id, last_online, reviews_today) \
            VALUES (\'{username}','{password}', '{email}', '{name}', '{gender}', '', 'normal', \
            false, false, null, '{datetime.now()}', 0)")

    connection.commit()
    return { "token": generate_token(email), "uid": get_account_user_id(username) }

def account_login(email, password):
    # Encrypt password and connect to DB
    entered_password = encrypt_password(password)
    cur.execute(f"SELECT user_password FROM movie_user WHERE email ='{email}'")
    stored_password = cur.fetchone()

    if stored_password is None:
        raise Error(description="Email does not belong to an existing account.")

    if stored_password[0] != entered_password:
        raise Error(description="Incorrect password.")

    try:
        cur.execute(f"SELECT user_id FROM movie_user WHERE email ='{email}'")
    except:
        raise Error(description="Unable to find user id for given email.")
    else:
        user_id = cur.fetchone()
        current_user_id = user_id[0]
        username = get_account_by_id(current_user_id)[1]
        update_last_online(username)

    active_user_dict.append(current_user_id)

    return generate_token(email)

def account_logout(user_id):
    # TODO: have to make some sort of dictionary of logged in users and their user ids
    # if user not logged in, return error
    if user_id not in active_user_dict:
        raise Error(description="Account is not logged in.")
    username = get_account_by_id(user_id)[1]
    update_last_online(username)
    # if user exists in active users list, remove user and return the list
    active_user_dict.remove(user_id)
    return

### HELPER FUNCTIONS ###
def encrypt_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def email_code_generator():
    letters = string.ascii_lowercase
    verification_code = ''.join((random.choice(letters)) for i in range(8))
    return verification_code

def send_email_verification(email, name, verify_code):
    # we'll need to make a dummy email account to send verification emails
    port = 465
    sender_email = 'comp3900dummyemail@gmail.com'
    password = 'asdfghjkl'
    message = """\
    Subject: Signup verification email

    Hi """ + name + """!
    Your registration code is 

    """ + verify_code + """
    """
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", port, context = context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, email, message)

def register_new_user(username, password, email, name, gender):
    connect()
    cur.execute(f"INSERT INTO movie_user (username, user_password, email, real_name, gender) VALUES ('{username}', '{password}', '{email}', '{name}', '{gender}')")
    connection.commit()

def user_info(user_id):
    connect()
    # TODO: connect to DB and get movie_user info and store in active_user_dict 


