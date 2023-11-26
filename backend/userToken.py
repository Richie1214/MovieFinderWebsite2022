"""_summary_
    This file is for generating or checking an access token.
"""

import jwt

secretKey = "ahawtflolhehomglolhiIsohungry"

# Generate the access token for the user.
def generate_token(email):
    return jwt.encode({"email": email}, secretKey, algorithm="HS256")

# Return the email from an access token.
def email_from_token(token):
    return (jwt.decode(token, secretKey, algorithms=["HS256"]))['email']
