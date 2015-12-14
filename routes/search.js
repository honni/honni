var express = require('express');
var router = express.Router();

// Include Parse
var Parse = require('parse/node');
Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_JS_KEY);
Parse.User.enableUnsafeCurrentUser();

var makeStars = require('../public/js/star-maker.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(process.env.PARSE_APP_ID);
  console.log(process.env.PARSE_JS_KEY);
  
  // Finds the Producer class in Parse
  var Producer = Parse.Object.extend("Producer");
  
  // Creates a Query based on the Person class
  var query = new Parse.Query(Producer);
  
  // Find some objects based on our query.
  query.find({
    // results is an array of objects that matched the query
    success: function(results) {
      var farms = [];
      
      for (var i=0; i < results.length; i++) {
        
        // Sets the image if the user doesn't have one
        var image = results[i].get('image');
        if (image) {
          image = image.url();
        } else {
          image = '/img/logo.png';
        }
        
        farms.push({
          name: results[i].get('name'),
          image:  image,
          distance: 2,
          farmId: results[i].id,
          stars: makeStars(results[i].id, true, results[i].get('rating')),
          numReviews: results[i].get('numReviews'),
          
          // TODO: Make a relation for types of produce
          produce: ['Meats', 'Cheese', 'Vegetables', 'Fruits', 'Honey']
        });
      }
      
      res.render('search',
        {partials:
         {metatags: 'partials/metatags',
          navbar: 'partials/navbar',
          footer: 'partials/footer'
         },
         farms: farms,
         loggedIn: req.cookies['presence']});
      
    },
    error: function(error) {
      console.log(error);
      // Displays the error
      res.render('error', {message: error.message, error: error});
    }});
});

module.exports = router;