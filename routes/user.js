import { Router } from 'express';
import {
    getMe,
    getUserbyId,
    deleteUser,
    updateDetail,
    subscribe,
    updateAvatar
} from "../controllers/users.js"

import { protect } from "../middleware/auth.js"
 
const router = Router();

// router.get('/ping',protect,(req,res)=>res.json({loggedInUser: req.user || {} }));

router.get('/me',protect,getMe)
router.get('/:id',getUserbyId)
router.put('/subscribe/:id',protect,subscribe);
router.put('/avatar',protect,updateAvatar);
router.put('/',protect,updateDetail);
router.delete('/',protect,deleteUser)

export default router;