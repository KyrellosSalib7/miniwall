const mongoose = require('mongoose')

const CommentSchema = mongoose.Schema({
    createdByUserId:{
        type:String,
        required:true
    },
    postId: {
        type:String,
        required:true
    },
    username: {
        type:String,
        required:true
    },
    comment: {
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('comments',CommentSchema)