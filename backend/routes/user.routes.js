import { Router } from "express";

import {createUserController,createLoginController,profilecontroller,logoutController,getAllUsers} from "../controllers/user.controller.js";
import { body } from "express-validator";
import {authUser} from "../middleware/auth.middleware.js";
const router = Router();

router.post('/register',body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    createUserController);

router.post('/login', body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').notEmpty().isLength({min:6}).withMessage('Password is required & of minimum 6 characters'),
    createLoginController);

router.get('/profile',authUser, profilecontroller);
router.get('/logout', authUser, logoutController);
router.get('/all',authUser, getAllUsers);
export default router;