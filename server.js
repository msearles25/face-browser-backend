const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const server = express();

server.use(helmet())
server.use(express.json());
server.use(cors());

server.get('/test', (req, res) => {
    res.send('It works')
})

module.exports = server;