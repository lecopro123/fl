var express = require('express');
var axios = require('axios');

var router = express.Router();
var data = [];

/* GET home page. */

router.get('/data', async (req, res) => {
  await axios.get("https://jsonplaceholder.typicode.com/photos")
    .then(function (resp) {
      resp.data.map(item => data.push(item.title))
      res.json(data)
    }).catch(function (error) {
      res.json(error)
    })
  data = [];
})

module.exports = router;
