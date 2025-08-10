# 🚀 Realtime Chat & Collaboration Platform (MERN + Gemini AI)

A **full-stack MERN application** that enables real-time chat, AI-powered assistance, collaborative coding, and project management in one place.  
Built with **MongoDB, Express.js, React.js, Node.js, Socket.IO**, and **Google Gemini AI** for intelligent code and conversation support.

---

## ✨ Features

### 💬 Chat & Communication
- **Real-time Messaging** using Socket.IO.
- **Private & Group Chats** for seamless collaboration.
- **Typing Indicators** and **Message Read Receipts**.
- **File & Code Snippet Sharing**.

### 🤖 Gemini AI Integration
- **AI-powered Responses** to questions and code-related queries.
- **Code Suggestions & Explanations** for multiple languages.
- **Project-related AI Help** (debugging tips, optimization ideas).

### 💻 Collaborative Coding Environment
- **In-browser Coding Environment** (like a mini IDE).
- **Server Creation for Projects** to run and test applications instantly.
- **Multi-language Syntax Highlighting**.
- **Live Code Collaboration** with real-time updates.

### 📂 Project Collaboration & Management
- **Create and Manage Projects** in teams.
- **Add/Remove Collaborators** dynamically.
- **Role-based Permissions** for members.
- **Project-specific Chat Channels**.

---

## 🛠️ Tech Stack

### **Frontend**
- React.js + Vite
- Tailwind CSS + Framer Motion
- Socket.IO Client
- Axios

### **Backend**
- Node.js + Express.js
- Socket.IO
- MongoDB + Mongoose
- Google Gemini API
- JWT Authentication
- Bcrypt for password hashing

---

## 📦 Installation & Setup

Follow these steps to run the project locally:

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-username/realtime-chat-gemini.git
cd realtime-chat-gemini

### **2️⃣ Install Dependencies**
a.Backend:
cd server
npm install

b.Frontend
cd client
npm install


###**3️⃣ Setup Environment Variables**
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key


###**4 Run Application**

a.Backend
cd server
npm run dev


b.Frontend
cd client
npm run dev







