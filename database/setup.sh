# ======================== Before starting =======================

# Before running this script, make sure that you have installed postgreSQL on your
# computer. My version is 12. Then, update your environmental variables by adding 
# in the path to the psql bin. For example, my one was: "C:\Program Files\PostgreSQL\12\bin".

# Also, you should also define a new environment variable called PGDATA, and set it to
# a postgres data file. For example, my one was: "C:\Program Files\PostgreSQL\12\data" (Not sure if
# this was here by default, but if it isn't, take a look at the paragraph I wrote below).
# I think that if you don't define a PGDATA, you will have to call pg_ctl start and stop like so:
# pg_ctl start -D "C:\Program Files\PostgreSQL\12\data". Which is pretty annoying,
# so you should probably just set PGDATA.

# If you don't have a data file, then just call "initdb -D ./wherever/you/want/the/data/to/be/stored",
# and set PGDATA to that path.

# ======================== The script ==========================

# This script will currently start up your postgres server, create a database, then
# close the postgres server.

# pg_ctl start starts up your postgres server.
pg_ctl start

# createdb movieFinder creates a new database called movieFinder. If there's already
# a database named movieFinder, then the command below will error.
createdb movieFinder

# dropdb movieFinder deletes the database called movieFinder. If you ever want to remove
# the database, then you remove the comment on dropdb movieFinder, or manually call it
# when your postgres server is up and running.
# dropdb movieFinder

# pg_ctl stop stops your postgres server. If you want your postgres server to remain on
# after running this script, just comment pg_ctl stop.
# pg_ctl stop


# ====================== More information =======================

# This is just a template for creating a database. You should probably use manual commands
# afterward.

# E.g. If you want to access the database, then you should manually input commands:
# "pg_ctl start" (if the server is not started yet), then to access database, you use
# "psql movieFinder". You can then use queries, insert tables, directly into the database.
# After you are done with everything, you can then type in quit to leave the database.
# Then after you are done with using the databases, you can call "pg_ctl stop" to close
# your postgres server.

# You can also write a .txt file that builds all of the tables, and then load it
# into your database by using "psql -f (.txt file) movieFinder"