const oracledb = require('oracledb');
const dbConfig = require('../config/dbConfig');

oracledb.fetchAsString = [oracledb.CLOB];


async function fetchBlankQuestions() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT questionID, sectionID, html_code, hints, instructions, question, summary
             FROM parsons.blank_question`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    } catch (err) {
        console.error('Error fetching blank questions:', err);
        throw err;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

// async function fetchBlankTables(questionID) {
//     let connection;
//     try {
//         connection = await oracledb.getConnection(dbConfig);
//         const result = await connection.execute(
//             `SELECT ID, questionID, target_table, references_table, summary
//              FROM parsons.blank_tables
//              WHERE questionID = :questionID`,
//             [questionID],
//             { outFormat: oracledb.OUT_FORMAT_OBJECT }
//         );
//         return result.rows;
//     } catch (err) {
//         console.error('Error fetching blank tables:', err);
//         throw err;
//     } finally {
//         if (connection) {
//             await connection.close();
//         }
//     }
// }

async function fetchBlankColumns(questionID) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT ID, questionID, column_name, key_type, references_tableID, target_table
             FROM parsons.blank_table_columns
             WHERE questionID = :questionID`,
            [questionID],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    } catch (err) {
        console.error('Error fetching blank columns:', err);
        throw err;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

async function fetchBlankFeedback(questionID) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT 
    btf.ID, 
    btf.questionID, 
    btf.target_table_ID, 
    btf.columnID AS feedback_columnID, 
    btf.expected_key_type, 
    btf.expected_references_table_ID, 
    btf.feedback, 
    btf.feedback_type, 
    btc.column_name
FROM 
    parsons.blank_table_feedback btf
JOIN 
    parsons.blank_table_columns btc ON btf.columnID = btc.ID
WHERE 
    btf.questionID = :questionID`,
            [questionID],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    } catch (err) {
        console.error('Error fetching blank feedback:', err);
        throw err;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}


// async function getBlankQuestionByID(questionID) {
//   let connection;
//   try {
//       connection = await oracledb.getConnection(dbConfig);

//       // Fetch all necessary data at once
//       const question = await connection.execute(
//           `SELECT questionID, sectionID, html_code, hints, instructions, question, summary
//           FROM parsons.blank_question
//           WHERE questionID = :questionID`,
//           [questionID],
//           { outFormat: oracledb.OUT_FORMAT_OBJECT }
//       );

//       const tables = await connection.execute(
//           `SELECT ID, questionID, target_table, references_table, summary
//           FROM parsons.blank_tables
//           WHERE questionID = :questionID`,
//           [questionID],
//           { outFormat: oracledb.OUT_FORMAT_OBJECT }
//       );

//       const columns = await connection.execute(
//           `SELECT ID, questionID, column_name, key_type, references_tableID, target_table
//           FROM parsons.blank_table_columns
//           WHERE questionID = :questionID`,
//           [questionID],
//           { outFormat: oracledb.OUT_FORMAT_OBJECT }
//       );

//       const feedback = await connection.execute(
//           `SELECT btf.ID, btf.questionID, btf.target_table_ID, btf.columnID AS feedback_columnID, 
//           btf.expected_key_type, btf.expected_references_table_ID, btf.feedback, btf.feedback_type, 
//           btc.column_name
//           FROM parsons.blank_table_feedback btf
//           JOIN parsons.blank_table_columns btc ON btf.columnID = btc.ID
//           WHERE btf.questionID = :questionID`,
//           [questionID],
//           { outFormat: oracledb.OUT_FORMAT_OBJECT }
//       );

//       // Return combined result
//       return {
//           question: question.rows[0],
//           tables: tables.rows,
//           columns: columns.rows,
//           feedback: feedback.rows,
//       };
//   } catch (err) {
//       console.error('Error fetching question data:', err);
//       throw err;
//   } finally {
//       if (connection) {
//           await connection.close();
//       }
//   }
// }

async function getBlankQuestionByID(questionID) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // Fetch the question details.
    const questionResult = await connection.execute(
      `SELECT questionID, sectionID, html_code, hints, instructions, question, summary
       FROM parsons.blank_question
       WHERE questionID = :questionID`,
      [questionID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Fetch blank tables for the question (without relying on references_table)
    const tablesResult = await connection.execute(
      `SELECT ID, questionID, target_table, summary
       FROM parsons.blank_tables
       WHERE questionID = :questionID`,
      [questionID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Fetch the normalized references from the new junction table.
    const refsResult = await connection.execute(
      `SELECT id, references_table, target_table_id
       FROM parsons.blank_table_references
       WHERE target_table_id IN (
         SELECT ID FROM parsons.blank_tables WHERE questionID = :questionID
       )`,
      [questionID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Fetch blank columns.
    const columnsResult = await connection.execute(
      `SELECT ID, questionID, column_name, key_type, references_tableID, target_table
       FROM parsons.blank_table_columns
       WHERE questionID = :questionID`,
      [questionID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Fetch blank feedback.
    const feedbackResult = await connection.execute(
      `SELECT btf.ID, btf.questionID, btf.target_table_ID, btf.columnID AS feedback_columnID, 
              btf.expected_key_type, btf.expected_references_table_ID, btf.feedback, btf.feedback_type, 
              btc.column_name
       FROM parsons.blank_table_feedback btf
       JOIN parsons.blank_table_columns btc ON btf.columnID = btc.ID
       WHERE btf.questionID = :questionID`,
      [questionID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Process results.
    const questionRow = questionResult.rows[0];
    const tables = tablesResult.rows;
    const columns = columnsResult.rows;
    const feedback = feedbackResult.rows;
    const references = refsResult.rows;

    // Group references by target_table_id.
    const referencesMap = {};
    references.forEach(ref => {
      // Assuming the column name is "TARGET_TABLE_ID" (case-sensitive based on your query)
      const tableId = ref.TARGET_TABLE_ID || ref.target_table_id; // adjust as needed
      if (tableId !== undefined) {
        if (!referencesMap[tableId]) {
          referencesMap[tableId] = [];
        }
        referencesMap[tableId].push(ref.REFERENCES_TABLE || ref.references_table);
      }
    });

    // Attach references array to each table.
    const processedTables = tables.map(table => {
      return {
        ...table,
        // Ensure we use the correct field for the table name
        target_table: table.TARGET_TABLE || table.target_table,
        references: referencesMap[table.ID] || []  // e.g., ["Room", "Department"]
      };
    });

    return {
      question: questionRow,
      tables: processedTables,
      columns: columns,
      feedback: feedback
    };
  } catch (err) {
    console.error('Error fetching question data:', err);
    throw err;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}



/*new her */
async function fetchBlankQuestionsById(questionID) {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
  
      const result = await connection.execute(
        `SELECT questionID, sectionID, html_code, hints, instructions, question, summary
         FROM parsons.blank_question
         WHERE questionID = :questionID`,
        [questionID],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0];  // Returning a single question object
    } catch (err) {
      console.error('Error fetching blank question by ID:', err);
      throw err;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  async function fetchBlankTableReferences(questionID) {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(
        `SELECT id, references_table, target_table_id
         FROM parsons.blank_table_references
         WHERE target_table_id IN (
           SELECT ID FROM parsons.blank_tables WHERE questionID = :questionID
         )`,
        [questionID],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows;  // An array of reference records.
    } catch (err) {
      console.error('Error fetching blank table references:', err);
      throw err;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
  
  // async function fetchBlankTables(questionID) {
  //   let connection;
  //   try {
  //     connection = await oracledb.getConnection(dbConfig);
  
  //     const result = await connection.execute(
  //       `SELECT ID, questionID, target_table, references_table, summary
  //        FROM parsons.blank_tables
  //        WHERE questionID = :questionID`,
  //       [questionID],
  //       { outFormat: oracledb.OUT_FORMAT_OBJECT }
  //     );
  //     return result.rows;  // Returning an array of tables
  //   } catch (err) {
  //     console.error('Error fetching blank tables:', err);
  //     throw err;
  //   } finally {
  //     if (connection) {
  //       await connection.close();
  //     }
  //   }
  // }

  async function fetchBlankTables(questionID) {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(
        `SELECT ID, questionID, target_table, summary
         FROM parsons.blank_tables
         WHERE questionID = :questionID`,
        [questionID],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows;  // Returning an array of tables without the comma-separated references_table.
    } catch (err) {
      console.error('Error fetching blank tables:', err);
      throw err;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
  
//   async function fetchBlankColumns(questionID) {
//     let connection;
//     try {
//       connection = await oracledb.getConnection(dbConfig);
  
//       const result = await connection.execute(
//         `SELECT ID, questionID, column_name, key_type, references_tableID, target_table
//          FROM parsons.blank_table_columns
//          WHERE questionID = :questionID`,
//         [questionID],
//         { outFormat: oracledb.OUT_FORMAT_OBJECT }
//       );
//       return result.rows;  // Returning an array of columns
//     } catch (err) {
//       console.error('Error fetching blank columns:', err);
//       throw err;
//     } finally {
//       if (connection) {
//         await connection.close();
//       }
//     }
//   }


async function fetchBlankFeedback(questionID) {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
  
      const result = await connection.execute(
        `select id, questionid, target_table, column_name, expected_key_type, references_table_id, feedback, feedback_type from parsons.blank_table_feedback where questionid =  :questionID`,
        [questionID],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows;  // Returning an array of feedbacks
    } catch (err) {
      console.error('Error fetching blank feedback:', err);
      throw err;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
module.exports = {
    fetchBlankQuestions,
    fetchBlankTables,
    fetchBlankColumns,
    fetchBlankFeedback,
    getBlankQuestionByID,
    fetchBlankTableReferences,
    fetchBlankQuestionsById,

};
