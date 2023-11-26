from venv import create
from database_management import *
from auth import *
from movie import *
from datetime import datetime
from review import *

clear_all()
account_create("test2", "testtest", "insert_email_here@hotmail.com", "test", "test")
account_create("test3", "testtest2", "insert_email_here2@hotmail.com", "test2", "test2")
create_company("company1")
edit_account_variable(1, 'company_id', 1)
edit_account_variable(2, 'company_id', 1)
add_company_post(1, "post_title", "post_content", "multimedia_link", "img_link")
add_company_post(1, "post_title2", "post_content", "multimedia_link", "img_link")
print(get_company_representatives(1))
insert_chatbot_answer(1, True, True, "hello", "hello2", "hello3", 5, datetime.now(), 1)
print(get_chatbot_answers(1))
add_review(1, "hello hello goodbye bye yo. at the what the Heck", 1, 2, datetime.now())
print(get_company_posts(1))
print(review_word_frequency(1))
print(get_company_details(1))