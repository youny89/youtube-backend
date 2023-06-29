import { Router } from 'express';
import {
    getSubscribedVideos,
    getSubscribedUsers
} from "../controllers/subscribe.js"

import { protect } from "../middleware/auth.js"
 
const router = Router();


router.use(protect)
router.get('/videos',getSubscribedVideos)
router.get('/users',getSubscribedUsers)


export default router;