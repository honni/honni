var express = require('express');
var router = express.Router();

var makeStars = require('../public/js/star-maker.js');

/* GET home page. */
router.get('/:id', function(req, res, next) {
  console.log(req.params.id);
  res.render('farm',
             { partials: {metatags: 'partials/metatags',
                          navbar: 'partials/navbar',
                          footer: 'partials/footer'},
               farm: {name: 'Johnson Farms',
                      image: 'farm4.jpg',
                      farmId: 'xfqzs',
                      stars: makeStars('xfqzs', true, '3.5'),
                      numReviews: 217,
//               produce: ['Meats', 'Cheese', 'Vegetables', 'Fruits', 'Honey']
                      bio: 'Always serving the best vegetables and cheeses around!',
                      phoneNumber: '(000) 000-0000',
                      address: {firstLine: '0000 Main Street',
                                secondLine: 'Baltimore, MD 21250'}
               },
               produce: [
                 {image: 'http://placehold.it/400x300',
                  food: 'Apples',
                  price: '$0.05'},
                 {image: 'http://placehold.it/400x300',
                  food: 'Apples',
                  price: '$0.05'},
                 {image: 'http://placehold.it/400x300',
                  food: 'Apples',
                  price: '$0.05'},
                 {image: 'http://placehold.it/400x300',
                  food: 'Apples',
                  price: '$0.05'},
                 {image: 'http://placehold.it/400x300',
                  food: 'Apples',
                  price: '$0.05'},
                 {image: 'http://placehold.it/400x300',
                  food: 'Apples',
                  price: '$0.05'},
                 {image: 'http://placehold.it/400x300',
                  food: 'Apples',
                  price: '$0.05'},
               ],
               reviews: [
                 {name: 'John Doe',
                  stars: makeStars('0', true, '3'),
                  date: '7/12/2015',
                  comments: "This is the best place that I have ever see! Without them, I don't know where to find apples. It's not like they grow on trees or anything."},
                 {name: 'Jane Doe',
                  stars: makeStars('1', true, '2'),
                  date: '4/1/2015',
                  comments: "Meh"},
                 {name: 'John Doe',
                  stars: makeStars('2', true, '4.5'),
                  date: '8/2/2015',
                  comments: "Seems good"},
                 {name: 'John Doe',
                  stars: makeStars('3', true, '5'),
                  date: '3/20/2015',
                  comments: "I'm the owner, give me good reviews"}
               ],
               reviewStars: makeStars('review-stars', false)
             });
});

module.exports = router;