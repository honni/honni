# [Honni](http://www.honni.org)
The peer to peer local produce finder

## How to run locally
1. [Download Node.js](http://nodejs.org)
2. Clone this repository by either:
   1. [Downloading the ZIP file](https://github.com/honni/honni/archive/master.zip) and unzip the code (Download ZIP button is also above)
   2. `git clone https://github.com/honni/honni.git`

3. Change into the `honni` directory: `cd honni`

4. Install dependecies: `sudo npm install`

5. Start the server with the (one line) command:

``` bash
PARSE_MOUNT=/parse MONGODB_URI=mongodb://<dbuser>:<dbpassword>@ds157624.mlab.com:57624/honni-db APP_ID=<can_be_anything> MASTER_KEY=<can_be_anything> GOOGLE_API_KEY=<Distance Matrix API Key> DEBUG=honni:* node ./bin/www
```

6. The server is now running! Navigate to [localhost:3000](http://localhost:3000)

7. You can access the database through [mlab.com](mlab.com) or through the command line

``` bash
mongo ds157624.mlab.com:57624/honni-db -u admin --password
```


## Deployment Instructions:
1. Create an account at [mlab.com](mlab.com) and create a new (empty) database and add a user (e.g. "admin")

2. Create a [heroku.com](heroku.com) app

3. In the heroku app's settings set the config variables:
    * APP_ID:       <can_be_anything>
    * DEBUG:        honni:*
    * MASTER_KEY:   <can_be_anything>
    * MONGODB_URI:  mongodb://<dbuser>:<dbpassword>@ds157624.mlab.com:57624/honni-db
    * PARSE_MOUNT:  /parse
    * SERVER_URL:   https://honni2.herokuapp.com/parse
    * GOOGLE_API_KEY: <Distance Matrix API KEY>

4. Choose "Heroku git" as the deployment method
    1. [Install heroku cli](https://devcenter.heroku.com/articles/heroku-cli#debian-ubuntu)
    2. Follow heroku's CLI deployment instructions


(The necessary code changes to migrate to a heroku hosted parse-server were made in commits cf16c and fc6fd)

Useful links:
* [article1](https://code.tutsplus.com/tutorials/get-started-building-your-blog-with-parsejs-migration-to-your-own-parse-server--cms-27954)
* [article2](http://docs.parseplatform.org/js/guide/#initialize)
