const express = require('express');
const helmet = require('helmet');
// const cors = require('cors');

const authRouter = require('./authentication/route');
const userRouter = require('./profiles/route'); 
const postsRouter = require('./posts/route');

const server = express();

server.use(helmet())
server.use(express.json());
// server.use(cors());

server.get('/', (req, res) => {
    res.send('What the hell am I even doing?')
})

server.use('/api/auth', authRouter);
server.use('/api/user', userRouter);
server.use('/api/post', postsRouter);

module.exports = server;