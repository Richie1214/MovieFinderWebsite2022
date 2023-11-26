from werkzeug.exceptions import HTTPException

class Error(HTTPException):
    code = 400
    message = 'No message specified'