# MARS - open source Audience Response System

MARS is a browser-based Audience Response System dedicated to e.g. teachers, moderators to support their courses to evaluate knowledge, assess opinions or illustrate concepts, or just for fun!

## Web page
More info, screenshots etc. [here](https://danielausparis.github.io/mars/)

## Prerequisites
### front-end
MARS requires recent HTML 5 capable browsers. It has been tested on Firefox 48-50 and Chromium 54.
### back-end
The MARS back-end is built with PHP and POSTGRESQL. Any decent versions should do (tested ok on Ubuntu 14 LTS which is already quite old at time of writing).

## Installation
### Assess environment
Your Http server/PHP/POSTGRESQL stack should first be assessed. The Http server MUST be configured for HTTPS if you want credible security.
### Database setup
1. Create a 'mars' user in POSTGRESQL from the postgres role, and create a database named 'mars':
```
$ sudo -i -u postgres  # (no password)
-bash-4.2$ psql
postgres=# CREATE USER mars;
postgres=# ALTER ROLE mars WITH CREATEDB;
postgres=# CREATE DATABASE mars OWNER mars;
postgres=# ALTER USER mars WITH ENCRYPTED PASSWORD 'xxxxxx';
postgres=# \q
-bash-4.2$
```
2. The system provides a SQL file "mars-server/dbsetup.sql" for database setup. Execute this file while still within the postgres role:
```
-bash-4.2$ psql -d mars -a -f mars-server/dbsetup.sql 
```
3. Copy the file "mars-server/dbparams.sample.php" to "mars-server/dbparams.php" and edit it to fill in the password used at step 1:
```bash
$ cd mars
$ cp mars-server/dbparams.sample.php mars-server/dbparams.php
$ nano mars-server/dbparams.php
```

### Web server setup
Deploy the MARS file hierarchy (its root is the 'mars' directory) according to your web server environment. 
### Test
The system should respond with the URL https://yourmachine.yourdomain/mars/mars-manager. Default login is "admin", password "admin". Change your password.


