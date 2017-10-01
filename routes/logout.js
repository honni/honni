var express = require('express');
var router = express.Router();

// Include Parse
var Parse = require('parse/node');
Parse.initialize(process.env.APP_ID);
Parse.serverURL = process.env.SERVER_URL || 'http://localhost:3000/parse';
Parse.User.enableUnsafeCurrentUser();

/* GET logout page. */
router.get('/', function(req, res, next) {
  // Get the presence cookie that we made to determine if they are logged in
  var loggedIn = req.cookies['presence'];
  
  // If the user has not logged in yet, tell them
  if (!loggedIn) {
    res.redirect('/');
    return;
  }
  
  // Sets the Parse.User to the user that made the request.
  // The cookie 'presence' is the session token generated by
  // Parse.signUp() or Parse.logIn()
  Parse.User.become(req.cookies['sessionid']).then(function (user) {
    // The current user is now set to user.

    // Logs out the current user
    Parse.User.logOut();

    // Removes the cookie and sends them to the login page
    res.clearCookie('presence');
    res.redirect('/');
//    res.render('index',{partials:
//                        {metatags: 'partials/metatags',
//                         navbar: 'partials/navbar',
//                         footer: 'partials/footer'}});
    
  }, function (error) {
    console.log(error);
    // Removes the cookie and sends them to the login page
    res.clearCookie('presence');
    // The token could not be validated.
    res.render('error', {
      message: error.message,
      error: error
    });
  });
});

module.exports = router;
