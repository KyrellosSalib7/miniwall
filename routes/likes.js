const express =require('express')
const router = express.Router()

const Like = require('../models/Like')
const Post = require('../models/Post')

const verifyToken = require('../verifyToken')

// POST (Create data)
router.post('/:postId', verifyToken, async(req,res)=>{

    
    const getPostById = await Post.findById(req.params.postId)

    if(getPostById.createdByUserId == req.user._id){
        res.status(400).send({message:'You cannot like your own post.'})
        return
    }

    const getLikeRecordForUser = await Like.findOne({postId: req.params.postId, createdByUserId: req.user._id})

        if(getLikeRecordForUser){
            res.status(400).send({message:'You cannot like a post that you already liked.'})
            return
        }

        await Post.updateOne(
            {_id:req.params.postId},
            {$set:{
                numberOfLikes: getPostById.numberOfLikes + 1,
                }
            })


    const likeData = new Like({
        createdByUserId:req.user._id,
        postId: req.params.postId,
        username: req.user.username,
    })
    // try to insert...
    try{
        const likeToSave = await likeData.save()
        res.send(likeToSave)
    }catch(err){
        res.send({message:err})
    }
})

// GET 1 (Read all)
router.get('/:postId',verifyToken, async(req,res) =>{
    try{
        const getLikes = await Like.find({postId: req.params.postId}).select("username -_id")
        res.send(getLikes)
    }catch(err){
        res.send({message:err})
    }
})

// DELETE (Delete)
router.delete('/:postId',verifyToken, async(req,res)=>{
    try{
        const getLikeRecordForUser = await Like.findOne({postId: req.params.postId, createdByUserId: req.user._id})
    
        if(!getLikeRecordForUser){
            res.status(400).send({message:'You cannot unlike a post that you haven\'t liked yet.'})
            return
        }

        const getPostById = await Post.findById(req.params.postId)

        await Post.updateOne(
            {_id:req.params.postId},
            {$set:{
                numberOfLikes: getPostById.numberOfLikes - 1,
                }
            })

        const deleteLike = await Like.deleteOne({postId:req.params.postId, createdByUserId: req.user._id})
        res.send(deleteLike)
    }catch(err){
        res.send({message:err})
    }
})

module.exports = router