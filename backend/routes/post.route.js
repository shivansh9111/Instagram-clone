import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.js'
import upload from '../middlewares/multer.js'
import {addComment, addnewPost, bookmarkedPosts, deletePost, dislikePost, getallPost, getCommentsOfPostsofanyuser, getuserPost, likePost} from "../controllers/posts.controller.js"

const router = express.Router()
router.route('/addpost').post(isAuthenticated, upload.single('image'),addnewPost)
router.route('/all').get(isAuthenticated,getallPost)
router.route('/userpost/all').get(isAuthenticated,getuserPost)
router.route('/:id/like').get(isAuthenticated,likePost)
router.route('/:id/dislike').get(isAuthenticated,dislikePost)
router.route('/:id/comment').post(isAuthenticated,addComment)
router.route('/:id/comment/all').post(isAuthenticated,getCommentsOfPostsofanyuser)
router.route('/delete/:id').delete(isAuthenticated,deletePost)
router.route('/:id/bookmark').post(isAuthenticated,bookmarkedPosts)

export default router