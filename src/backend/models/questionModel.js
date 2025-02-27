const oracledb = require('oracledb');
const dbConfig = require('../config/dbConfig');

async function fetchQuestionsBySectionID(sectionID) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT question_id, question, hints, html_content 
             FROM parsons.questions 
             WHERE section_id = :sectionID
             ORDER BY question_id ASC `,
            [sectionID],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        console.log(`Questions fetched for sectionID ${sectionID}:`, result.rows.length);
        return result.rows;
    } catch (err) {
        console.error('Error fetching questions by section:', err);
        throw err;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

async function fetchQuestionDetailsByID(questionID) {
    let connection;
    if (isNaN(questionID)) {
        throw new Error(`Invalid questionID: ${questionID}`);
    }
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT q.question_id, q.question, q.hints, q.html_content, cl.code_line_id, cl.text AS code_line_text, summary
             FROM parsons.questions q
             JOIN parsons.code_lines cl ON q.question_id = cl.question_id
             WHERE q.question_id = :questionID`,
            [Number(questionID)], // Ensure the questionID is cast to a number
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    } catch (err) {
        console.error('Error fetching question details:', err);
        throw err;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

async function fetchCorrectOrderDetails(questionID) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT cqo.code_line_id, cqo.explanation
             FROM parsons.correct_question_order cqo
             WHERE cqo.question_id = :questionID
             ORDER BY cqo.correct_question_order_id ASC`,
            [Number(questionID)],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        // Map the results to include codeLineId and explanation
        return result.rows.map(row => ({
            codeLineId: row.CODE_LINE_ID,
            explanation: row.EXPLANATION
        }));
    } catch (err) {
        console.error('Error fetching correct order details:', err);
        throw err;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

async function fetchFeedbackByQuestionID(questionID) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT f.code_line_id, f.feedback_text
             FROM parsons.feedback f
             WHERE f.question_id = :questionID`,
            [Number(questionID)],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        console.log(result);
        // Map the results to an array of feedback objects
        return result.rows.map(row => ({
            codeLineId: row.CODE_LINE_ID,
            feedbackText: row.FEEDBACK_TEXT
        }));
    } catch (err) {
        console.error('Error fetching feedback details:', err);
        throw err;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}



async function fetchColumnQuestions(questionID) {
    let connection;
    try {
      // Ensure CLOBs are fetched as strings
      oracledb.fetchAsString = [oracledb.CLOB];
  
      connection = await oracledb.getConnection(dbConfig);
  
      // Fetch data
      const questionsResult = await connection.execute(
        `SELECT cq.question_id, cq.title, cq.instructions, cq.html_content, summary
         FROM parsons.column_questions cq where cq.question_id = :questionID`,
         [Number(questionID)],
         { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
  
      const oneNFResult = await connection.execute(
        `SELECT id, question_id, table_name, column_name
         FROM parsons.column_one_nf_tables where question_id = :questionID`,
         [Number(questionID)],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
  
      const twoNFResult = await connection.execute(
        `SELECT id, question_id, table_name, column_name, key_type, references
         FROM parsons.column_two_nf_tables where question_id = :questionID`,
         [Number(questionID)],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
  
      const feedbackResult = await connection.execute(
        `SELECT feedback_id, question_id, column_name, feedback, feedback_type, key_type
         FROM parsons.column_feedback where question_id = :questionID`,
         [Number(questionID)],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
  
      // Map questions by ID
      const questionsMap = new Map();
      questionsResult.rows.forEach(row => {
        questionsMap.set(row.QUESTION_ID, {
          questionId: row.QUESTION_ID,
          title: row.TITLE,
          instructions: row.INSTRUCTIONS,
          oneNFTable: null,
          twoNFTables: [],
          feedback: [],
          html_content: row.HTML_CONTENT,
          summary: row.SUMMARY
        });
      });
  
      // Map 1NF tables to questions
      oneNFResult.rows.forEach(row => {
        if (questionsMap.has(row.QUESTION_ID)) {
          const question = questionsMap.get(row.QUESTION_ID);
          if (!question.oneNFTable) {
            question.oneNFTable = {
              tableName: row.TABLE_NAME,
              columns: [],
            };
          }
          question.oneNFTable.columns.push(row.COLUMN_NAME);
        }
      });
  
      // Map 2NF tables to questions with new Column object structure
      twoNFResult.rows.forEach(row => {
        if (questionsMap.has(row.QUESTION_ID)) {
          const question = questionsMap.get(row.QUESTION_ID);
          let table = question.twoNFTables.find(t => t.tableName === row.TABLE_NAME);
  
          if (!table) {
            table = { tableName: row.TABLE_NAME, columns: [] };
            question.twoNFTables.push(table);
          }
  
          table.columns.push({
            columnName: row.COLUMN_NAME,
            keyType: row.KEY_TYPE || 'NONE', // Default keyType if not provided
            referencesTable: row.REFERENCES || null, // Default referencesTable if not provided
          });
        }
      });
  
      // Map feedback to questions
      feedbackResult.rows.forEach(row => {
        if (questionsMap.has(row.QUESTION_ID)) {
          questionsMap.get(row.QUESTION_ID).feedback.push({
            columnName: row.COLUMN_NAME,
            targetTable: row.TARGET_TABLE,
            feedback: row.FEEDBACK || '',
            feedbackType: row.FEEDBACK_TYPE || 'normal',
            keyType: row.KEY_TYPE || 'NONE'
          });
        }
      });
  
      return Array.from(questionsMap.values());
    } catch (err) {
      console.error('Error fetching column questions:', err);
      throw err;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
  

  async function fetchColumnFeedback(questionId) {
    let connection;
    try {
        // Ensure CLOBs are fetched as strings
        oracledb.fetchAsString = [oracledb.CLOB];

        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT column_name, target_table, feedback, feedback_type, key_type
             FROM parsons.column_feedback
             WHERE question_id = :questionId`,
            [questionId],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        console.log(`Feedback Query Result for Question ${questionId}:`, result.rows);

        // Map feedback to an array of objects with feedbackType and keyType for matching
        return result.rows.map(row => ({
            columnName: row.COLUMN_NAME,
            targetTable: row.TARGET_TABLE,
            feedback: row.FEEDBACK, // This is now properly converted to a string
            feedbackType: row.FEEDBACK_TYPE,
            keyType: row.KEY_TYPE || 'NONE'  // Default keyType if not provided
        }));
    } catch (err) {
        console.error('Error fetching column feedback:', err);
        throw err;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}


async function fetchTwoNFData(questionId) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT table_name, column_name, key_type, references
             FROM parsons.column_two_nf_tables
             WHERE question_id = :questionId`,
            [questionId],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        console.log(`2NF Data for Question ${questionId}:`, result.rows);

        // Process the data to group by table
        const tables = {};
        result.rows.forEach(row => {
            if (!tables[row.TABLE_NAME]) {
                tables[row.TABLE_NAME] = { tableName: row.TABLE_NAME, columns: [] };
            }
            tables[row.TABLE_NAME].columns.push({
                columnName: row.COLUMN_NAME,
                keyType: row.KEY_TYPE,
                referencesTable: row.REFERENCES
            });
        });

        return Object.values(tables); // Return the processed data as an array of tables
    } catch (err) {
        console.error('Error fetching 2NF data:', err);
        throw err;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}



module.exports = {
    fetchQuestionsBySectionID,
    fetchQuestionDetailsByID,
    fetchCorrectOrderDetails,
    fetchFeedbackByQuestionID,
    fetchColumnQuestions,
    fetchColumnFeedback,
    fetchTwoNFData,
};
