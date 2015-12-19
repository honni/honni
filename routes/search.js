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
  
  // SortBy filter
  var sortBy = req.query.sortby;
  var sortByDistance;
  var sortByRating;
  var sortByNumReviews;
  var sortByValue;
  
  // Produce type filter
  var produceType = req.query.produceType;
  // TODO: Don't hardcode the produce types
  var typesOfProduce = {'Meat': false, 'Cheese': false, 'Vegetable': false,
                        'Fruit': false, 'Honey': false};
  var produceTypes = []; // [{name: 'Meat', selected: false}, ...]
  
  // Producer type filter
  var producerType = req.query.producerType;
  var producerGarden = true;
  var producerFarm = true;
  
  
  // Setup the rating filter
  if (sortBy == 'rating') {
    // Sets the sort to render the button green
    sortByRating = true;
    sortByValue = 'rating';
    
    // Sorts the results in ascending order by the rating
    query.descending('rating');
    
  } else if (sortBy == 'num_reviews') {
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
    
  
  // Setup produce type filter
  // TODO: Make an option to OR the produce types together
  // If there's a produce type filter, limit the query on those types
  if (produceType) {
    // If there's multiple produce types selected
    if (Array.isArray(produceType)) {
      // Limit the query on each produce type and
      
      // ANDs the produce types together
      query.containsAll('produceTypes', produceType);
      
      // Indicate that the type is selected on the frontend
      for (var i=0; i < produceType.length; i++) {
        typesOfProduce[produceType[i]] = true;
      }
      
    } else { // Only one produce type is selected
      query.equalTo('produceTypes', produceType);
      typesOfProduce[produceType] = true;
    }
  }
  
  // Transforms the produce type filter object
  // into an array for rendering correctly
  // If the type of produce is still false, add its object to the produceTypes
  for (var key in typesOfProduce) {
    // If we added the key
    if (typesOfProduce.hasOwnProperty(key)) {
      produceTypes.push({
        name: key,
        selected: typesOfProduce[key]
      });
    }
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
  
  // For pagination
//  query.skip(10); // skip the first 10 results
  
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
          produce: results[i].get('produceTypes')
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
         produceTypes: produceTypes,
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