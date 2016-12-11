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
1. Create an account for the MARS system in POSTGRESQL and create a database named 'mars'.
2. The system provides a SQL file "mars-server/dbsetup.sql" for database setup. Execute this file with the above account.
3. Configure the file "mars-server/dbparams.php" with the credentials used at step 1.

### Web server setup
Deploy the MARS file hierarchy (its root is the 'mars' directory) according to your web server environment. 
### Test
The system should respond with the URL https://yourmachine.yourdomain/mars/mars-manager. Default login is "admin", password "admin". Change your password.


