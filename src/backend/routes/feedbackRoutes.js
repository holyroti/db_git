const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');


router.get('/:question_id', feedbackController.getFeedbackAndCorrectOrder);

module.exports = router;


