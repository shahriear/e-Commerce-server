const express = require('express');
const router = express.Router();
const apiRoute = require('./api/index')

router.use(process.env.API_ROUTE, apiRoute);
router.get('/', (req, res) => {
  res.send('Hello! Welcome to the Server.');
});
router.use((req, res) => {
  res.status(404).send('Page Not Found!');
});

module.exports = router;
