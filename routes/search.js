var express = require('express');
var router = express.Router();

var makeStars = require('../public/js/star-maker.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('search',
             { partials:
              {metatags: 'partials/metatags',
               navbar: 'partials/navbar',
               footer: 'partials/footer'
              },
              farms: [
                { name: 'Johnson Farms',
                  image: 'farm1.jpg',
                  distance: '2 Miles',
                  farmId: 'xfqzs',
                  stars: makeStars('xfqzs', true, '3.5'),
                  numReviews: 217,
                  produce: ['Meats', 'Cheese', 'Vegetables', 'Fruits', 'Honey']
                },
                { name: 'Johnson Farms',
                  image: 'farm3.jpg',
                  distance: '5 Miles',
                  farmId: 'abc',
                  stars: makeStars('abc', true, '4.5'),
                  numReviews: 156,
                  produce: ['Meats', 'Vegetables', 'Fruits', 'Honey']
                }
              ]});
});

module.exports = router;