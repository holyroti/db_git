const oracledb = require('oracledb');
const dbConfig = require('../config/dbConfig');

// Fetch feedback for a question
async function fetchFeedbackByQuestionID(questionID) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT f.code_line_id, f.feedback_text, c.text AS code_line_text
             FROM parsons.feedback f
             JOIN parsons.code_lines c ON f.code_line_id = c.code_line_id
             WHERE f.question_id = :questionID`,
            [Number(questionID)],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    } catch (err) {
        console.error('Error fetching feedback:', err);
        throw err;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

// Fetch correct order for a question
async function fetchCorrectOrderByQuestionID(questionID) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT c.code_line_id, c.text AS code_line_text, o.explanation
             FROM parsons.correct_question_order o
             JOIN parsons.code_lines c ON o.code_line_id = c.code_line_id
             WHERE o.question_id = :questionID
             ORDER BY o.correct_question_order_id`,
            [Number(questionID)],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    } catch (err) {
        console.error('Error fetching correct order:', err);
        throw err;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}





module.exports = {
    fetchFeedbackByQuestionID,
    fetchCorrectOrderByQuestionID,
};
