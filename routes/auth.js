import { Router } from 'express';
import { login,
    signup,
    logout,
    confirmEmail
 } from "../controllers/auth.js"

import { protect } from "../middleware/auth.js"
 
const router = Router();

// router.get('/ping',protect,(req,res)=>res.json({loggedInUser: req.user || {} }));

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);
router.get('/confirm',confirmEmail);



export default router;