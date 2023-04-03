const express =require('express')
const router = express.Router()

const Post = require('../models/Post')

const verifyToken = require('../verifyToken')

// POST (Create data)
router.post('/', verifyToken, async(req,res)=>{
    //console.log(req.body)

    const postData = new Post({
        createdByUserId:req.user._id,
        ownerName: req.user.username,
        title:req.body.title,
        description:req.body.description,
    })
    // try to insert...
    try{
        const postToSave = await postData.save()
        res.send(postToSave)
    }catch(err){
        res.send({message:err})
    }
})

// GET 1 (Read all)
router.get('/',verifyToken, async(req,res) =>{
    try{
        const getPosts = await Post.find().select("title description ownerName numberOfLikes date").sort({numberOfLikes: 'desc', date: 'desc'})
        res.send(getPosts)
    }catch(err){
        res.send({message:err})
    }
})

// GET 2 (Read by ID)
router.get('/:postId',verifyToken, async(req,res) =>{
    try{
        const getPostById = await Post.findById(req.params.postId).select("title description ownerName numberOfLikes date")
        res.send(getPostById)
    }catch(err){
        res.send({message:err})
    }
})

// PATCH (Update)
router.patch('/:postId',verifyToken, async(req,res) =>{
    try{
        const getPostById = await Post.findById(req.params.postId)
        if(getPostById.createdByUserId !== req.user._id){
            res.status(404).send({message:'No post with that id exists for this user'})
            return
        }

        const updatePostById = await Post.updateOne(
            {_id:req.params.postId},
            {$set:{
                title:req.body.title,
                description:req.body.description,
                }
            })
        res.send(updatePostById)
    }catch(err){
        res.send({message:err})
    }
})

// DELETE (Delete)
router.delete('/:postId',verifyToken, async(req,res)=>{
    try{
        const getPostById = await Post.findById(req.params.postId)

        if(getPostById.createdByUserId !== req.user._id){
            res.status(404).send({message:'No post with that id exists for this user'})
            return
        }

        const deletePostById = await Post.deleteOne({_id:req.params.postId})
        res.send(deletePostById)
    }catch(err){
        res.send({message:err})
    }
})

module.exports = router