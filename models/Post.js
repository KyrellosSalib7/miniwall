const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    createdByUserId:{
        type:String,
        required:true
    },
    ownerName: {
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    numberOfLikes: {
        type:Number,
        default:0
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('posts',PostSchema)