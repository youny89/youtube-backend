import { Router } from 'express';
import {
    addComment,
    getComments,
    addLike,
    addDisLike,
    deleteComment
} from "../controllers/comments.js"
import { protect } from "../middleware/auth.js"
 

const router = Router();

router.delete('/:commentId',protect, deleteComment)
router.put('/:commentId/like', protect,addLike)
router.put('/:commentId/dislike', protect,addDisLike)
router.post('/:videoId',protect, addComment)
router.get('/:videoId', getComments)

export default router;