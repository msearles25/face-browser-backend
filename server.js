const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const usersRouter = require('./authentication/route');
const postsRouter = require('./posts/route');

const server = express();

server.use(helmet())
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send('What the hell am I even doing?')
})

server.use('/users', usersRouter);
server.use('/post', postsRouter);

module.exports = server;