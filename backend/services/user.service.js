import User from "../models/user.models.js";

export const createUser = async ({
    email,password
})=>{
    if(!email || !password) {
        throw new Error('Email and password are required');
    }

    const hashPassword =await User.hashPassword(password);
    const user = await User.create({
        email,
        password: hashPassword
    });

    return user;
}

export const getAllusers=async ({userId})=>{
    const user=await User.find({
        _id: {$ne: userId} // Exclude the logged-in user
    }).select('-password'); // Exclude password from response   
    
    return user;
}

