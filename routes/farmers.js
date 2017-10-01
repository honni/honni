var express = require('express');
var router = express.Router();

// Include Parse
var Parse = require('parse/node');
Parse.initialize(process.env.APP_ID);
Parse.serverURL = process.env.SERVER_URL || 'http://localhost:3000/parse';
Parse.User.enableUnsafeCurrentUser();

/* GET for farmers page. */
router.get('/', function(req, res, next) {
  res.render('farmers', {partials: {
                           metatags: 'partials/metatags',
                           navbar: 'partials/navbar',
                           footer: 'partials/footer'},
                         loggedIn: req.cookies['presence']});
});

router.post('/login', function(req, res, next) {
  Parse.User.logIn(req.body.email, req.body.password, {
    success: function(user) {
      // Do stuff after successful login.

      // Sets a user session cookie to expire in 30 days
      // The Parse.Session is automatically created and linked to this user
      res.cookie('presence', user.getSessionToken(), { maxAge: 2592000000 });
      res.redirect('/farm/' + user.get('producer').id);
    },
    error: function(user, error) {
      // The login failed. Check error to see why.
      
      // Invalid Credentials. Check which was invalid
      if (error.code == 101) {
        
        // Creates a Query off of the User class
        var User = Parse.Object.extend('_User');
        
        // Creates a Query based on the User class and the email
        var query = new Parse.Query(User);
        query.equalTo('email', req.body.email);

        // Find some objects based on our query
        query.find({
          success: function(results) {
            // If there's there's an email address that matched
            if (results.length) {
              // Incorrect password
              res.render('farmers', {partials:
                                      {metatags: 'partials/metatags',
                                       navbar: 'partials/navbar',
                                       footer: 'partials/footer'},
                                     loggedIn: req.cookies['presence'],
                                     loginEmail: req.body.email,
                                     invalidLoginPassword: 'invalid'});


            } else {
              // Incorrect email address
              res.render('farmers', {partials:
                                      {metatags: 'partials/metatags',
                                       navbar: 'partials/navbar',
                                       footer: 'partials/footer'},
                                     loggedIn: req.cookies['presence'],
                                     invalidLoginEmail: 'invalid'});

            }
  //          res.render('search',
  //            {partials:
  //             {metatags: 'partials/metatags',
  //              navbar: 'partials/navbar',
  //              footer: 'partials/footer'
  //             },
  //             farms: farms,
  //             loggedIn: req.cookies['presence']});

          },
          error: function(error) {
            // Couldn't query for email address
            console.log(error);
          }});
      }
            
//      logError(error);
//      res.render('error', {message: error.message, error: error});
    }
  });
});

/* POST for farmers page. */
router.post('/new', function(req, res, next) {
  
  // Createst the Produce instance first
  // Finds the Producer class in Parse
  var Producer = Parse.Object.extend('Producer');

  // Creates a producer object based on the class
  var producer = new Producer();

  // Sets the type of producer they are and their zip code
  if (req.body.producerType == 'farmer') {
    producer.set('isFarm', true);
  } else {
    producer.set('isFarm', false);
  }
  producer.set('zipcode', req.body.zipcode);
  producer.set('isTrialAccount', true);
  producer.set('rating', 0);
  producer.set('numReviews', 0);

  // Saves the producer object to the Parse database
  producer.save(null, {
    success: function(producer) {
      // Creates a new User in the Parse database
      var user = new Parse.User();
      user.set("username", req.body.email);
      user.set("password", req.body.password);
      user.set("email", req.body.email);
      user.set("producer", producer);

      user.signUp(null, {
        success: function(user) {
          // Hooray! Let them use the app now.

          // Sets a user session cookie to expire in 30 days
          // The Parse.Session is automatically created and linked to this user
          res.cookie('presence', user.getSessionToken(), { maxAge: 2592000000 });
//          req.cookies['presence'];
          
          res.redirect('/farm/' + producer.id);
        },
        error: function(user, error) {
          // The signup failed. Check error to see why.
          // Destroy the producer entry
          producer.destroy({});
          
          // Show the error message somewhere and let the user try again.
          logError(error);
          res.render('error', {message: error.message, error: error});
        }
      });
    },
    error: function(producer, error) {
      // The save failed. Check error to see why.
      // Show the error message somewhere and let the user try again.
      logError(error);
      res.render('error', {message: error.message, error: error});
    }
  });
});

// Logs the error message in the console
function logError(error) {
  console.log("ERROR");
  console.log("error code: " + error.code);
  console.log("message: " + error.message);
}

module.exports = router;
