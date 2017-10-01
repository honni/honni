var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
//var util = require("util");
var fs = require("fs");

// Include Parse
var Parse = require('parse/node');
Parse.initialize(process.env.APP_ID);
Parse.serverURL = process.env.SERVER_URL || 'http://localhost:3000/parse';
Parse.User.enableUnsafeCurrentUser();

var makeStars = require('../public/js/star-maker.js');

/* GET producer page. */
router.get('/:id', function(req, res, next) {
  
  // Finds the Producer class in Parse
  var Producer = Parse.Object.extend("Producer");
  
  // Creates a Query based on the Producer class
  var query = new Parse.Query(Producer);
  
  query.get(req.params.id, {
    success: function(producer) {
      
      // Creates a Query based on the Review class limited to
      // only the children Reviews related to the producer
      var produceQuery = producer.relation('produce').query();
      
      produceQuery.find({
        success: function(results) {
          var produce = [];
      
          for (var i=0; i < results.length; i++) {
            produce.push({
              id: results[i].id,
              name: results[i].get('name'),
              price: results[i].get('price').toFixed(2), // 2 decimal places
              image: results[i].get('image').url()
            });
          }
          
          // Creates a Query based on the Review class limited to
          // only the children Reviews related to the producer
          var reviewQuery = producer.relation('reviews').query();

          reviewQuery.find({
            success: function(results) {
              var reviews = [];
              dateFormat.masks.simpleDate = 'm/d/yyyy';
              
              for (var i=0; i < results.length; i++) {
                reviews.push({
                  name: results[i].get('name'),
                  stars: makeStars(i, true, results[i].get('rating')),
                  date: dateFormat(results[i].createdAt, 'simpleDate'),
                  comments: results[i].get('comments')
                });
              }

              // Sets the image if the user doesn't have one
              var image = producer.get('image');
              if (image) {
                image = image.url();
              } else {
                image = '/img/logo.png';
              }
              
              if (req.cookies['presence']) {
                Parse.User.become(req.cookies['resence']).then(function (user) {
                  // The current user is now set to user.
                  var editable;
                  // The user is on their own page
                  if (req.params.id == user.get('producer').id) {
                    var editable = 't';
                  }
                  
                  renderFarm(res, req, producer, image, produce, reviews, editable);
                  
                }, function (error) {
                  // The token could not be validated.
                  console.log(error);
                  res.render('error', {message: error.message, error: error});
                });
              }
              else {
                renderFarm(res, req, producer, image, produce, reviews);
              }
            },
            error: function(error) {
              // Review Query failed. Displays the error
              res.render('error', {message: error.message, error: error});
            }});
        },
        error: function(error) {
          // Review Query failed. Displays the error
          res.render('error', {message: error.message, error: error});
        }});
    },
    error: function(object, error) {
      // Producer Query failed. Log the error
      console.log(error);
      res.redirect('/search');
    }
  });
});

/* POST submit review */
router.post('/submitReview', function(req, res, next) {
  
  // Finds the Producer class in Parse
  var Producer = Parse.Object.extend("Producer");
  
  // Creates a Query based on the Producer class
  var query = new Parse.Query(Producer);
  
  query.get(req.body.id, {
    success: function(producer) {
      // Found the producer
      
      // Creating the Review
      var Review = Parse.Object.extend("Review");
      
      // Create the review
      var review = new Review();
      review.set('name', req.body.name);
      review.set('rating', req.body['rating-review']);
      review.set('comments', req.body.comments);
      review.set('producerId', req.body.id);
      
      review.save(null, {
        success: function(review) {
          
          var relation = producer.relation("reviews");
          relation.add(review);
          
          // Updating the rating with a running average
          producer.increment('numReviews');
          var currentRating = producer.get('rating');
          producer.set('rating', currentRating + ((req.body['rating-review'] - currentRating) / producer.get('numReviews')));
          
          producer.save(null, {
            success: function(producer) {
              // Review saved
              res.redirect('/farm/' + req.body.id);
            },
            error: function(producer, error) {
              // Couldn't save producer. Displays the error
              res.render('error', {message: error.message, error: error});
          }});
        },
        error: function(review, error) {
          // Couldn't save review. Displays the error
          res.render('error', {message: error.message, error: error});
      }});
    },
    error: function(error) {
      // Couldn't find producer. Displays the error
      res.render('error', {message: error.message, error: error});
    }});
});

/* POST add produce */
router.post('/addProduce', upload.single('image'), function(req, res, next) {
  // Missing the file. Displays the error
  if (!req.file || req.file.size === 0) {
    res.render('error', {message: 'Missing file for upload'});
    return;
  }
  
  // Finds the Producer class in Parse
  var Producer = Parse.Object.extend("Producer");
  
  // Creates a Query based on the Producer class
  var query = new Parse.Query(Producer);
  
  query.get(req.body.id, {
    success: function(producer) {
      // Found the producer

      // Opening the file
      fs.open(req.file.path, 'r', function(err, fd) {
        if (err) {
          return console.error(err);
        }

        // Reading the file into the buffer
        var buf = new Buffer(req.file.size);
        fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
          if (err){
            return console.log(err);
          }
          
          // Creating the Parse.File
          var image = new Parse.File(req.file.originalname,
                                     {base64: buf.toString('base64')});
          
          image.save().then(function(){
            // Creating the Produce
            var Produce = Parse.Object.extend("Produce");

            var produce = new Produce();
            produce.set('name', req.body.name);
            produce.set('price', parseFloat(req.body.price));
            produce.set('type', req.body.type);
            produce.set('image', image);
            produce.set('producerId', req.body.id);

            produce.save(null, {
              success: function(produce) {
                
                var produceTypes = producer.get('produceTypes');

                // Need to add the new produce type to the producer
                if (produceTypes.indexOf(req.body.type) == -1) {
                  produceTypes.push(req.body.type);
                  producer.set('produceTypes', produceTypes);
                }
                
                var relation = producer.relation("produce");
                relation.add(produce);

                producer.save(null, {
                  success: function(producer) {
                    // Producer saved
                    res.redirect('/farm/' + req.body.id);
                  },
                  error: function(producer, error) {
                    // Couldn't save producer. Displays the error
                    res.render('error', {message: error.message, error: error});
                }});
              },
              error: function(produce, error) {
                // Couldn't save review. Displays the error
                res.render('error', {message: error.message, error: error});
            }});

          },
          function(error) {
            console.log("ERROR SAVING!!!");
            console.log(error);
            // Couldn't save the file. Displays the error
            res.render('error', {message: error.message, error: error});
          });
        });
      });
    },
    error: function(error) {
      // Couldn't find producer. Displays the error
      res.render('error', {message: error.message, error: error});
    }});
});

/* POST delete produce */
/* TODO: Remove the produce type if the farm is out of that produce type
         or keep it because if they farm grew it once, then they probably
         grow it a lot, but gardeners may change it up.
*/
router.post('/removeProduce', function(req, res, next) {
  console.log("prdocuer: " + req.body.producerId);
  console.log("produce: " + req.body.produceId);
  // Finds the Produce class in Parse
  var Produce = Parse.Object.extend("Produce");
  // Creates a Query based on the Produce class
  var query = new Parse.Query(Produce);
  
  // Gets a single row based on ID
  query.get(req.body.produceId, {
    success: function(produce) {
      produce.destroy({
        success: function(produce) {
          res.redirect('/farm/' + req.body.producerId);
        },
        error: function(produce, error) {
          // Couldn't delete the produce. Displays the error
          console.log(error);
          res.render('error', {message: error.message, error: error});          
        }
      });
    },
    error: function(object, error) {
      // Couldn't find the produce by ID. Displays the error
      console.log("Couldn't find produce");
      console.log(error);
      res.render('error', {message: error.message, error: error});
    }
  });
});

/* POST update info page. */
router.post('/updateInfo', upload.single('image'), function(req, res, next) {
  // File is empty. Displays the error
  if (req.file && req.file.size === 0) {
    res.render('error', {message: 'Missing file for upload'});
    return;
  }
  
  // Finds the Producer class in Parse
  var Producer = Parse.Object.extend("Producer");
  
  // Creates a Query based on the Producer class
  var query = new Parse.Query(Producer);
  // could do user.become rather than querying for the object
  query.get(req.body.id, {
    success: function(producer) {
      // Found the producer
      
      var needToSave = false;
      if (req.body.name) {
        producer.set('name', req.body.name);
        needToSave = true;
      }
      if (req.body.phoneNumber) {
        producer.set('phoneNumber', req.body.phoneNumber);
        needToSave = true;
      }
      if (req.body.addressFirst) {
        producer.set('addressFirstLine', req.body.addressFirst);
        needToSave = true;
      }
      if (req.body.addressSecond) {
        producer.set('addressSecondLine', req.body.addressSecond);
        needToSave = true;
      }
      if (req.body.bio) {
        producer.set('bio', req.body.bio);
        needToSave = true;
      }
      
      // If there's a file
      if (req.file) {
      
        // Opening the file
        fs.open(req.file.path, 'r', function(err, fd) {
          if (err) {
            return console.error(err);
          }
          // Reading the file into the buffer
          var buf = new Buffer(req.file.size);
          fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
            if (err){
              return console.log(err);
            }

            // Creating the Parse.File
            var image = new Parse.File(req.file.originalname, {base64: buf.toString('base64')});

            image.save().then(function(){
              producer.set('image', image);

              producer.save(null, {
                success: function(producer) {
                  // Producer saved with image
                  res.redirect('/farm/' + req.body.id);
                },
                error: function(producer, error) {
                  // Couldn't save review. Displays the error
                  res.render('error', {message: error.message, error: error});
              }});

            },
            function(error) {
              console.log("ERROR SAVING IMAGE!!!");
              console.log(error);
              // Couldn't save the file. Displays the error
              res.render('error', {message: error.message, error: error});
            });
          });
        });
      }
      else if (needToSave) {
        producer.save(null, {
          success: function(producer) {
            // Producer saved
            res.redirect('/farm/' + req.body.id);
          },
          error: function(producer, error) {
            // Couldn't save producer. Displays the error
            res.render('error', {message: error.message, error: error});
          }
        }); 
      }
      else {
        // Didn't submit anything, so go back
        res.redirect('/farm/' + req.body.id);
      }
    },
    error: function(error) {
      // Couldn't find producer. Displays the error
      res.render('error', {message: error.message, error: error});
    }});
});

/* Renders the farm to reduce duplicate code */
function renderFarm(res, req, producer, image, produce, reviews, editable) {
  var produceTypes = producer.get('produceTypes');
  console.log();
  res.render('farm',
             {partials: {metatags: 'partials/metatags',
                         navbar: 'partials/navbar',
                         footer: 'partials/footer'},
              producer: {id: req.params.id,
                     name: producer.get('name'),
                     image: image,
                     stars: makeStars(req.params.id, true,
                                      Math.round(producer.get('rating') * 2) / 2),
                     numReviews: producer.get('numReviews'),
    //               produce: ['Meats', 'Cheese', 'Vegetables', 'Fruits', 'Honey']
                     bio: producer.get('bio'),
                     phoneNumber: producer.get('phoneNumber'),
                     address: {firstLine: producer.get('addressFirstLine'),
                               secondLine: producer.get('addressSecondLine')},
                     produceTypes: produceTypes},
              produce: produce,
              reviews: reviews,
              reviewStars: makeStars('review', false),
              loggedIn: req.cookies['presence'],
              editable: editable}); 
}



module.exports = router;
