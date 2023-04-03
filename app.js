const express = require('express');
const app = express();

const mongoose = require('mongoose')
require('dotenv/config')
const bodyParser = require('body-parser')

const postsRoute = require('./routes/posts')
const authRoute = require('./routes/auth')
const likesRoute = require('./routes/likes')
const commentsRoute = require('./routes/comments')

app.use(bodyParser.json())

app.use('/api/posts', postsRoute)
app.use('/api/user',authRoute)
app.use('/api/likes',likesRoute)
app.use('/api/comments',commentsRoute)

mongoose.connect(process.env.DB_CONNECTOR, () => {
    console.log("Mongoose running")
})
app.listen(3000, () => {
    console.log('Server running on port 3000')
})