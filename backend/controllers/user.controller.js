import User from '../models/user.models.js';
import {createUser,getAllusers} from "../services/user.service.js";
import client from '../services/redis.service.js';
import { validationResult } from "express-validator";
import { get } from 'mongoose';




export const createUserController = async (req, res) => {
    console.log("Incoming body:", req.body);

  const errors = validationResult(req);
  
  // ✅ If there are validation errors, return 400
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await createUser(req.body);
    const token = user.generateJWT(); // Make sure this method exists on your model
    delete user._doc.password; // Exclude password from response

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createLoginController = async (req, res) => {
  const errors = validationResult(req);
  
  // ✅ If there are validation errors, return 400
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password'); // Ensure password is selected

    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = user.generateJWT();
    delete user._doc.password;
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const profilecontroller = async (req, res) => {
  try {
 
    const user = await User.findById(req.user._id).select('-password'); // Exclude password from response
    
    if (!user) {
      
      return res.status(404).json({ error: 'User not found' });
    }
   
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const logoutController = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
         // Invalidate the token in Redis
         
        if (!token) {
        return res.status(401).json({ error: 'No token provided' });
        }
    
        // Set token as invalid for 1 hour
        await client.set(token, 'invalid', 'EX', 3600);
    
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    }

export const getAllUsers = async (req, res) => {
  try{
    const loggedInUser = await User.findOne({ email: req.user.email });
    const allUsers=await getAllusers({userId: loggedInUser._id});
    return res.status(200).json({
      message: "Users fetched successfully",
      users: allUsers
    });

  }
  catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({ error: error.message });
  }

}




