const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

app.use(express.static('public'))

app.use('/api', require('./routes/index'));

app.use(cors());

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`))