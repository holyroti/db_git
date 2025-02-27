const feedbackModel = require('../models/feedbackModel');

exports.getFeedbackAndCorrectOrder = async (req, res) => {
    const { question_id } = req.params;

    try {
        const feedbackData = await feedbackModel.fetchFeedbackByQuestionID(question_id);
        const correctOrderData = await feedbackModel.fetchCorrectOrderByQuestionID(question_id);

        res.json({ feedback: feedbackData, correctOrder: correctOrderData });
    } catch (err) {
        console.error('Error fetching feedback and correct order:', err);
        res.status(500).json({ error: 'Failed to fetch feedback and correct order' });
    }
};
