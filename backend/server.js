import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import project from './models/project.model.js';
import { generateResult } from './services/ai.service.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: '*'
    }
});
io.use(async(socket, next) => {

    try{
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1]; // Extract token from handshake headers
        const projectId=socket.handshake.query.projectId; 
        
        if(!mongoose.Types.ObjectId.isValid(projectId)) {
         
            return next(new Error('Invalid project ID'));

        }

        socket.project= await project.findById(projectId);



        
        if (!token) {
            return next(new Error('No token provided'));
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error'));
            }
            socket.user = decoded; // Attach user info to the socket
            next();
        }); 


    }catch(err){
        console.error('Socket middleware error:', err);
        next(err);
    }
});
io.on('connection', socket => {
    socket.roomId=socket.project._id.toString()
    
    
    socket.join(socket.roomId); 
    
    socket.on('projectMessage', async data => {
        const message = data.message;
        const aiIsPresentInMessage = message.includes('@ai');
        socket.broadcast.to(socket.roomId).emit('projectMessage', data);
        if(aiIsPresentInMessage){
            const prompt =message.replace('@ai','');
            const result = await generateResult(prompt)
            io.to(socket.roomId).emit('projectMessage',{
                 message: JSON.stringify({ text: result }),
                sender:{
                    _id:'ai',
                    email:'AI'
                }

            })

           
            return ;
        }
        
        console.log("user connected");
         // Broadcast to all clients in the project room
    });
  socket.on('disconnect', () => { 
    console.log('user disconnected');
    socket.leave(socket.roomId);
   });
});




server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
