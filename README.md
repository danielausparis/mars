# MARS - open source Audience Response System

MARS is a browser-based Audience Response System dedicated to e.g. teachers, moderators to support their courses to evaluate knowledge, assess opinions or illustrate concepts, or just for fun!

## Web page
More info, screenshots etc. [here](https://danielausparis.github.io/mars/)

## Prerequisites
### front-end
MARS requires recent HTML 5 capable browsers. It has been tested on Firefox 48-50 and Chromium 54.
### back-end
The MARS back-end is built with PHP and Postgresql. Any decent versions should do (tested ok on CentOs 7 and Ubuntu 14 LTS with default PHP and Postgresql).

## Installation

### Assess environment
Your Http server/PHP/Postgresql stack should first be assessed. The Http server MUST be configured for HTTPS if you want credible security.

### Clone this repo
Deploy the MARS file hierarchy (its root is the 'mars' directory) according to your web server environment by cloning the 'master' branch of this repo.

### Database setup

1. Create a 'mars' user in Postgresql from the postgres role, and create a database named 'mars':

    ```
    # sudo -i -u postgres
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
    -bash-4.2$ psql -d mars -a -f <path to mars>/mars-server/dbsetup.sql 
    ```

3. Copy the file "dbparams.sample.php" to "dbparams.php" and edit it to fill in the password used at step 1:

    ```
    # cd mars/mars-server
    # cp dbparams.sample.php dbparams.php
    # nano dbparams.php
    ```
    
    At this stage a small 'testdb.php' file in the mars-server directory can assess if the database access works from local PHP:

    ```
    # php testdb.php    # should show the details of user 'admin'
    ```

4. Remote access
Access from remote browsers implies to configure e.g. firewalls and Postgresql itself accordingly. This is very much related to the host distribution as well as local details. The reader will find many useful generic procedures on the net. I would however like to mention following trick after some headaches on a CentOs 7 system that would not relay remote connections (see http://stackoverflow.com/questions/23509994/php-on-centos-6-5-can-not-connect-to-postgres-db) :

    ```
    # setsebool -P httpd_can_network_connect_db on
    ```

### Test and initial setup
The system should respond with the URL https://yourmachine.yourdomain/mars/mars-manager. Default login is "admin", password "admin". Go to the 'user admin' menu, change your password and provide a working email address, since the approval procedure for new users requires email exchanges between MARS and its administrator.


