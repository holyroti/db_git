const questionModel = require('../models/questionModel');
const blankModel = require('../models/blankModel');

// Fetch questions by section ID
exports.getQuestionsBySectionID = async (req, res) => {
  const { sectionID } = req.params;
  try {
      const questions = await questionModel.fetchQuestionsBySectionID(sectionID);
      if (questions.length === 0) {
          return res.status(404).send('No questions found for the given section.');
      }
      res.json(questions);
  } catch (err) {
      console.error('Failed to fetch questions by section:', err);
      res.status(500).send('Failed to fetch questions by section.');
  }
};

exports.getQuestionDetailsByID = async (req, res) => {
  const { questionID } = req.params;
  if (isNaN(questionID)) {
    return res.status(400).json({ error: 'Invalid question ID' });
}
  try {
      const questionDetails = await questionModel.fetchQuestionDetailsByID(questionID);
      if (!questionDetails || questionDetails.length === 0) {
          return res.status(404).send('No question details found.');
      }
      res.json(questionDetails);
  } catch (err) {
      console.error('Failed to fetch question details:', err);
      res.status(500).send('Failed to fetch question details.');
  }
};

exports.getCorrectOrderDetailsByID = async (req, res) => {
  const { questionID } = req.params;
  try {
      const correctOrderDetails = await questionModel.fetchCorrectOrderDetails(questionID);
      if (!correctOrderDetails || correctOrderDetails.length === 0) {
          return res.status(404).send('No correct order details found.');
      }
      res.json(correctOrderDetails);
  } catch (err) {
      console.error('Failed to fetch correct order details:', err);
      res.status(500).send('Failed to fetch correct order details.');
  }
};


exports.getFeedbackByQuestionID = async (req, res) => {
  const { questionID } = req.params;
  try {
      const feedback = await questionModel.fetchFeedbackByQuestionID(questionID);
      if (!feedback || feedback.length === 0) {
          return res.status(404).send('No feedback found for the given question.');
      }
      res.json(feedback);
  } catch (err) {
      console.error('Failed to fetch feedback details:', err);
      res.status(500).send('Failed to fetch feedback details.');
  }
};



const { fetchColumnFeedback, fetchColumnQuestions } = require('../models/questionModel');

// exports.getColumnQuestions = async (req, res) => {
//     try {

//         const questions = await fetchColumnQuestions();

//         // Fetch feedback for each question and add it to the response
//         for (const question of questions) {
//             question.feedback = await fetchColumnFeedback(question.questionId);
//             console.log(`Feedback for Question ${question.questionId}:`, question.feedback); // Log feedback
//         }

//         res.json({ success: true, data: questions });
//     } catch (err) {
//         console.error('Failed to fetch column questions:', err);
//         res.status(500).send('Failed to fetch column questions.');
//     }
// };

exports.getColumnQuestions = async (req, res) => {
    try {
      // Read the question ID from the URL parameter (if provided)
      const questionID = req.params.questionID; // e.g. /questions/column-questions/123
  
      // Pass the questionID to fetchColumnQuestions; if not provided, it can fetch all.
      const questions = await fetchColumnQuestions(questionID);
  
      // For each question, fetch and attach feedback
      for (const question of questions) {
        question.feedback = await fetchColumnFeedback(question.questionId);
        console.log(`Feedback for Question ${question.questionId}:`, question.feedback);
      }
  
      res.json({ success: true, data: questions });
    } catch (err) {
      console.error('Failed to fetch column questions:', err);
      res.status(500).send('Failed to fetch column questions.');
    }
  };




const { fetchTwoNFData } = require('../models/questionModel');

exports.getTwoNFData = async (req, res) => {
    const { questionId } = req.params; // Assume questionId is passed as a route parameter

    try {
        const data = await fetchTwoNFData(questionId);
        res.json({ success: true, data });
    } catch (err) {
        console.error('Failed to fetch 2NF data:', err);
        res.status(500).send('Failed to fetch 2NF data.');
    }
};

exports.getBlankQuestions = async (req, res) => {
    try {
        const questions = await blankModel.fetchBlankQuestions();
        res.json({ success: true, data: questions });
    } catch (err) {
        console.error('Failed to fetch blank questions:', err);
        res.status(500).send('Failed to fetch blank questions.');
    }
};

// exports.getBlankDetails = async (req, res) => {
//     const { questionID } = req.params;
//     try {
//         // Fetch related details
//         const tables = await blankModel.fetchBlankTables(questionID);
//         const columns = await blankModel.fetchBlankColumns(questionID);
//         const feedback = await blankModel.fetchBlankFeedback(questionID);

//         // Map columns to their respective tables
//         const mappedTables = tables.map((table) => ({
//             ...table,
//             columns: columns.filter((column) => column.target_table === table.TARGET_TABLE),
//         }));

//         // Respond with the mapped structure, explicitly including the columns array
//         res.json({
//             success: true,
//             data: {
//                 tables: mappedTables,
//                 feedback,
//                 columns, // Add columns explicitly here
//             },
//         });
//     } catch (err) {
//         console.error('Failed to fetch blank details:', err);
//         res.status(500).send('Failed to fetch blank details.');
//     }
// };


//let { questionPromise,tablesPromise,columnsPromise,feedbackPromise } = require('../models/blankModel');

// exports.getBlankDetails = async (req, res) => {
//     const { questionID } = req.params;
//     try {
//         // Fetch related details
//         const tables = await blankModel.fetchBlankTables(questionID);
//         const columns = await blankModel.fetchBlankColumns(questionID);
//         const feedback = await blankModel.fetchBlankFeedback(questionID);
//         const references = await blankModel.fetchBlankTableReferences(questionID);

//         // Group references by target_table_id.
//         const referencesMap = {};
//         references.forEach((ref) => {
//             // Adjust property names as per your DB. Here we assume:
//             // ref.target_table_id is the ID of the table,
//             // ref.references_table is the name of the reference.
//             const tableId = ref.target_table_id;
//             if (tableId !== undefined) {
//                 if (!referencesMap[tableId]) {
//                     referencesMap[tableId] = [];
//                 }
//                 referencesMap[tableId].push(ref.references_table);
//             }
//         });

//         // Map columns to their respective tables.
//         // Note: We're using table.TARGET_TABLE for comparison.
//         const mappedTables = tables.map((table) => ({
//             ...table,
//             columns: columns.filter((column) => column.target_table === table.TARGET_TABLE),
//             // Attach the references array using the table's ID.
//             references: referencesMap[table.ID] || []
//         }));

//         // Respond with the mapped structure.
//         res.json({
//             success: true,
//             data: {
//                 tables: mappedTables,
//                 feedback,
//                 columns, // Also return columns explicitly if needed.
//             },
//         });
//     } catch (err) {
//         console.error('Failed to fetch blank details:', err);
//         res.status(500).send('Failed to fetch blank details.');
//     }
// };

exports.getBlankDetails = async (req, res) => {
    const { questionID } = req.params;
    try {
      // Fetch related details
      const tables = await blankModel.fetchBlankTables(questionID);
      const columns = await blankModel.fetchBlankColumns(questionID);
      const feedback = await blankModel.fetchBlankFeedback(questionID);
      const references = await blankModel.fetchBlankTableReferences(questionID);
  
      // Group references by target_table_id (as number).
      const referencesMap = {};
      references.forEach(ref => {
        // Oracle returns keys in uppercase if unquoted.
        const tableId = ref.TARGET_TABLE_ID || ref.target_table_id;
        if (tableId !== undefined && tableId !== null) {
          const key = Number(tableId);
          if (!referencesMap[key]) {
            referencesMap[key] = [];
          }
          // Use the uppercase property since Oracle returns unquoted column names in uppercase.
          const refValue = ref.REFERENCES_TABLE || ref.references_table;
          referencesMap[key].push(refValue);
        }
      });
  
      // Map columns to their respective tables and attach the references array.
      const mappedTables = tables.map((table) => {
        // Ensure table.ID is a number.
        const tableId = Number(table.ID);
        return {
          ...table,
          // Use the proper casing; Oracle usually returns target_table in uppercase.
          columns: columns.filter((column) => column.target_table === table.TARGET_TABLE),
          // Attach references using the numeric table ID.
          references: referencesMap[tableId] || []
        };
      });
  
      // Respond with the mapped structure.
      res.json({
        success: true,
        data: {
          tables: mappedTables,
          feedback,
          columns, // Also return columns if needed.
        },
      });
    } catch (err) {
      console.error('Failed to fetch blank details:', err);
      res.status(500).send('Failed to fetch blank details.');
    }
  };
  

exports.getBlankQuestionByID = async (req, res) => {
    const { questionID } = req.params;

    try {
        // Fetch related data asynchronously using await
        const questionPromise = blankModel.fetchBlankQuestionsById(questionID);
        const tablesPromise = blankModel.fetchBlankTables(questionID);
        const columnsPromise = blankModel.fetchBlankColumns(questionID);
        const feedbackPromise = blankModel.fetchBlankFeedback(questionID);

        // Wait for all promises to resolve
        const [question, tables, columns, feedback] = await Promise.all([
            questionPromise,
            tablesPromise,
            columnsPromise,
            feedbackPromise
        ]);

        // If any of the data is missing, handle it
        if (!question || !tables || !columns || !feedback) {
            return res.status(500).json({ success: false, message: 'Missing required data fields' });
        }

        // Process tables and columns data and include table names
        const mappedTables = tables.map((table) => {
            const columnsForTable = columns
                .filter((col) => col.target_table === table.target_table)
                .map((col) => ({
                    id: col.ID,
                    columnName: col.column_name,
                    keyType: col.key_type,
                    referencesTableId: col.references_tableID,
                    target_table: col.target_table,
                }));

            if (columnsForTable.length === 0) {
                console.warn(`No columns found for table: ${table.target_table}`);
            }

            return {
                id: table.ID,
                targetTable: table.target_table,
                referencesTable: table.references_table,
                tableName: table.target_table, // Add table name
                columns: columnsForTable,
            };
        });

        // Map feedback to columns
        const mappedFeedback = feedback.map((feed) => ({
            id: feed.ID,
            questionid: feed.QUESTIONID,
            target_table: feed.TARGET_TABLE,
            column_name: feed.COLUMN_NAME,
            expectedKeyType: feed.EXPECTED_KEY_TYPE,
            referencesTableId: feed.REFERENCES_TABLE_ID,
            feedback: feed.FEEDBACK,
            feedbackType: feed.FEEDBACK_TYPE


            // id: feed.ID,
            // columnId: feed.columnID,
            // columnName: feed.column_name,
            // targetTableId: feed.target_table_ID,
            // expectedKeyType: feed.expected_key_type,
            // expectedReferencesTableId: feed.expected_references_table_ID,
            // feedback: feed.feedback,
            // feedbackType: feed.feedback_type,
        }));

        // Create the result object with all necessary fields
        const result = {
            question: {
                questionId: question.questionID || 'N/A',
                sectionId: question.sectionID || 'N/A',
                htmlCode: question.html_code || '',
                hints: question.hints || '',
                instructions: question.instructions || '',
                question: question.question || '',
            },
            tables: mappedTables,
            feedback: mappedFeedback,
            columns: columns, // Include columns explicitly
        };

        // Send the result back as JSON
        res.json({ success: true, data: result });
    } catch (err) {
        // Handle any errors that occur during fetching data
        console.error('Error fetching blank question details:', err);
        res.status(500).json({ success: false, message: 'Error fetching blank question details' });
    }
};
