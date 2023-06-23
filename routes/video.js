import { Router } from 'express';
import {
    create,
    update,
    like,
    dislike,
    getVideoById,
    addViews,
    random,
    trend,
    tags,
    search,
    getSubscribedUsersVideos
} from "../controllers/videos.js"

import { protect } from "../middleware/auth.js"
 
const router = Router();

// router.get('/ping',protect,(req,res)=>res.json({loggedInUser: req.user || {} }));

router.post('/',protect,create)

router.get('/search',search)
router.get('/subscribed',protect,getSubscribedUsersVideos)
router.get('/find/random',random)
router.get('/find/trend',trend)
router.get('/find/tags',tags)
router.get('/:id',getVideoById)

router.put('/:id',protect,update)
router.put('/:id/like',protect,like)
router.put('/:id/dislike',protect,dislike)
router.put('/:id/views',protect,addViews)


export default router;