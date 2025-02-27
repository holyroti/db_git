const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.get('/:questionID/blank-question', questionController.getBlankQuestionByID);

// Define the more specific route first
router.get('/column-questions/:questionID', questionController.getColumnQuestions);
router.get('/questions/column-questions/:questionID', questionController.getColumnQuestions);
router.get('/:questionId/two-nf', questionController.getTwoNFData);


router.get('/blank-questions', questionController.getBlankQuestions);
router.get('/blank-details/:questionID', questionController.getBlankDetails);
router.get('/:questionID/blank-details', questionController.getBlankDetails);

// Then define the parameterized route
router.get('/:questionID', questionController.getQuestionDetailsByID);

// Other routes
router.get('/section/:sectionID', questionController.getQuestionsBySectionID);
router.get('/correct-order/:questionID', questionController.getCorrectOrderDetailsByID);
router.get('/feedback/:questionID', questionController.getFeedbackByQuestionID);


module.exports = router;
