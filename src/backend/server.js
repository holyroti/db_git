const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const questionRoutes = require('./routes/questionRoutes');
const authRoutes = require('./routes/authRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/feedback', feedbackRoutes);

const { initOracleClient } = require('./lib/oracleClientSetup');
initOracleClient();

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
