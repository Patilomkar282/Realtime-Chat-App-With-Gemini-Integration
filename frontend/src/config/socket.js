import socket from 'socket.io-client';

let socketInstance=null;
export const initializeSocket = (projectId) => {
    socketInstance =socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem('token') || ''
        },
        query: {
            projectId
        }
    });

    return socketInstance;
}

export const receiveMessage = (eventName,cb) => {
    if (!socketInstance) {
        console.error('Socket not initialized. Call initializeSocket first.');
        return;
    }
    socketInstance.on(eventName, cb);
}

export const sendMessage = (eventName, data) => {
    if (!socketInstance) {
        console.error('Socket not initialized. Call initializeSocket first.');
        return;
    }
    socketInstance.emit(eventName, data);
}

