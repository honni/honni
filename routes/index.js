var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{partials: {
                        metatags: 'partials/metatags',
                        navbar: 'partials/navbar',
                        footer: 'partials/footer'},
                      loggedIn: req.cookies['presence']});
});

module.exports = router;