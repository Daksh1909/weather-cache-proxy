#!/usr/bin/env node

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const { Command } = require('commander') 
const program = new Command();

program
    .name('weather-app')
    .description('Start the server')
    .option('-p, --port <number>', 'Port number to run the server on', process.env.PORT ||'3000')
    .parse(process.argv);

const options = program.opts();
const PORT = parseInt(options.port, 10);
// const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

app.use(cors());
app.use(express.static('public'))

app.use('/api', require('./routes/index'));


app.listen(PORT, () => console.log(`Server running on port ${PORT}.`))