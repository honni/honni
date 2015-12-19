var express = require('express');
var router = express.Router();

// Include Parse
var Parse = require('parse/node');
Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_JS_KEY);
Parse.User.enableUnsafeCurrentUser();

var makeStars = require('../public/js/star-maker.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  // Finds the Producer class in Parse
  var Producer = Parse.Object.extend("Producer");
  
  // Creates a Query based on the Person class
  var query = new Parse.Query(Producer);
  
  var sortByDistance;
  var sortByRating;
  var sortByNumReviews;
  var sortByValue;
  
  var producerType = req.query.producerType;
  var producerGarden = true;
  var producerFarm = true;
  
  // Setup the rating filter
  if (req.query.sortby == 'rating') {
    // Sets the sort to render the button green
    sortByRating = true;
    sortByValue = 'rating';
    
    // Sorts the results in ascending order by the rating
    query.descending('rating');
    
  } else if (req.query.sortby == 'num_reviews') {
    // Sets the sort to render the button green
    sortByNumReviews = true;
    sortByValue = 'num_reviews';
    
    // Sorts the results in ascending order by the rating
    query.descending('numReviews');
    
  } else {
    // Sets the sort to render the button green
    sortByDistance = true;
    sortByValue = 'distance';
    
    // TODO: Google maps API sorting by distance
  }
  
  // Setup the producer type filter
  if (producerType) {
    // If there is one producer type
    if (!Array.isArray(producerType)) {
      // If farm is selected, turn off garden
      if (producerType == 'farm') {
        producerGarden = false;
        query.equalTo('isFarm', true);
      } else {
        // if garden is selected, turn off farm
        producerFarm = false;
        query.equalTo('isFarm', false);
      }
    }
  }
  
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
          stars: makeStars(results[i].id, true,
                           Math.round(results[i].get('rating') * 2) / 2),
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
         loggedIn: req.cookies['presence'],
         sortBy: {
           distance: sortByDistance,
           rating: sortByRating,
           numReviews: sortByNumReviews,
           value: sortByValue
         },
         producerType: {
           farm: producerFarm,
           garden: producerGarden
         }
        });
      
    },
    error: function(error) {
      console.log(error);
      // Displays the error
      res.render('error', {message: error.message, error: error});
    }});
});

module.exports = router;