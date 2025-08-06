import jwt from 'jsonwebtoken';
import client from '../services/redis.service.js' // make sure this is correct path

export const authUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const isBlacklisted = await client.get(token); // ✅ Await this

        if (isBlacklisted) {
            res.cookie('token', '');
            return res.status(401).json({ error: 'Token is invalid or expired' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("done")
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Please Authenticate' });
    }
};
