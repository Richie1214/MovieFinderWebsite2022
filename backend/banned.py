from database_management import *
from error import Error

def block_user(id, blocked_id):
    # check if blocked user exists 
    check_user_exists(blocked_id)

    # check if user is already blocked
    if blocked_id in get_blocked_list(id):
        raise Error(description="You have already blocked this user.")

    # check if user is trying to block themselves
    if id == blocked_id:
        raise Error(description="You can't block yourself.")

    return add_user_to_ban_list(id, blocked_id)

def unblock_user(id, blocked_id):
    # check if blocked user exists
    check_user_exists(blocked_id)
    # check if user wasn't blocked in the first place
    if blocked_id not in get_blocked_list(id):
        raise Error(description="This user isn't blocked.")
    
    if id == blocked_id:
        raise Error(description="You can't unblock yourself.")

    return remove_user_from_ban_list(id, blocked_id)

### HELPER FUNCTIONS ###

def check_user_exists(id):
    if value_exists('user_id', 'movie_user', id) == False:
        raise Error(description="This user does not exist.")
    else:
        return True

