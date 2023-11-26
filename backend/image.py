# rename if irrelevant name
from email.mime import image
from PIL import Image
from error import Error
from pathlib import Path
import urllib
from os.path import *
from binascii import a2b_base64
import re
import os


# Navigating from backend folder to images folder
# image.py is at src/backend
# backend_to_image_path = str(dirname(dirname(realpath(__file__)))) + "/images"
# Path to navigate from Profile Page jsx to images folder
# jsx is at src/frontend/src/pages
# jsx_to_image_path = str(dirname(dirname(dirname(realpath(__file__))))) + "/images"

# Absolute Path
# All calls of functions occur here, so an absolute path should work
abs_image_path = str(dirname(dirname(realpath(__file__)))) + "\images"

# change this file path if not working with cwd

# parse in image object from Image.open(/location/to/image/)
def upload_profile_image_path(user_id, data_url):
    # determine the file extension
    if data_url[11] != 'p':
        raise Error(description="Please upload a PNG file")
    
    # save the image
    with open(f"../frontend/src/images/profile/{user_id}.png", "wb") as f:
        f.write(a2b_base64(re.sub("^data:image\/(png|jpeg);base64,", "", data_url)))

# Check if the user has a profile picture
def check_profile_image(user_id):
    image_path = f"../frontend/src/images/profile/{user_id}.png"
    try:
        Image.open(image_path)
    except:
        return False
    else:
        return True

def get_profile_image_path(user_id):
    frontend_path = (f"{abs_image_path}\profile\{user_id}.png")
    backend_path = (f"{abs_image_path}\profile\{user_id}.png")
    try:
        Image.open(backend_path)
    except:
        raise Error(description="Path to stored image not valid or image not found")
    else:
        return frontend_path

def upload_movie_image_path(movie_id, image_path):
    try:
        image = Image.open(image_path)
        image.save(f'{abs_image_path}/movie/{movie_id}.png', format="png")
    except:
        raise Error(description="Unsuccessful file upload")

def get_movie_image_path(movie_id):
    try:
        frontend_image_path = f"{abs_image_path}/movie/{movie_id}.png"
        backend_image_path = f"{abs_image_path}/movie/{movie_id}.png"
        Image.open(backend_image_path)
        return frontend_image_path
    except:
        raise Error(description="Movie image not valid")