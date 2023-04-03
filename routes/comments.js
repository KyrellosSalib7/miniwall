const express =require('express')
const router = express.Router()

const Comment = require('../models/Comment')
const Post = require('../models/Post')

const verifyToken = require('../verifyToken')

// POST (Create data)
router.post('/:postId', verifyToken, async(req,res)=>{

    try{
        const getPostById = await Post.findById(req.params.postId)

    if(getPostById.createdByUserId == req.user._id){
        res.status(400).send({message:'You cannot comment your own post.'})
        return
    }

    const commentData = new Comment({
        createdByUserId:req.user._id,
        postId: req.params.postId,
        username: req.user.username,
        comment: req.body.comment,
    })
    // try to insert...
        const commentToSave = await commentData.save()
        res.send(commentToSave)
    }catch(err){
        res.send({message:err})
    }
})

// GET 1 (Read all)
router.get('/:postId',verifyToken, async(req,res) =>{
    try{
        const getComments = await Comment.find({postId: req.params.postId}).select("username comment date -_id")
        res.send(getComments)
    }catch(err){
        res.send({message:err})
    }
})

module.exports = router