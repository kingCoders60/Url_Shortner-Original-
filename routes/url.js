const express = require('express')
const {handleGeneralNewShortURL}=require('../controllers/url')
const router = express.Router();

router.post('/',handleGeneralNewShortURL);
module.exports = router;