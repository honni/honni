var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('search',{ partials: {
                        metatags: 'partials/metatags',
                        navbar: 'partials/navbar',
                        footer: 'partials/footer'},
                       
                       farms: [
                         { name: 'Johnson Farms',
                           distance: '2 Miles',
                         }
                       ]
                      
                      
                      });
});

module.exports = router;