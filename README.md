# [Honni](http://www.honni.org)
The peer to peer local produce finder

## How to run locally
1. [Download Node.js](http://nodejs.org)
2. Clone this repository by either:
   1. [Downloading the ZIP file](https://github.com/honni/honni/archive/master.zip) and unzip the code (Download ZIP button is also above)
   2. `git clone https://github.com/honni/honni.git`

3. Change into the `honni` directory: `cd honni`

4. Install dependecies: `sudo npm install`

5. Start the server with the [Parse database](http://parse.com) keys:  
```PARSE_APP_ID=insert_parse_app_id_here PARSE_JS_KEY=insert_parse_javascript_key_here DEBUG=honni:* node ./bin/www```

6. The server is now running! Navigate to [localhost:3000](http://localhost:3000)