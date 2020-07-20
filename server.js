const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const usersRouter = require('./authentication/route');

const server = express();

server.use(helmet())
server.use(express.json());
server.use(cors());

server.get('/test', (req, res) => {
    const time = Date.now();
    const random = Math.floor(Math.random() * 10000);
    // res.send('It works')
    res.send(`multiplied: ${time * random}, not multiplied: ${time}`)
})

server.use('/users', usersRouter);

module.exports = server;