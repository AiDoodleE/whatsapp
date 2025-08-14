# 📩 WhatsApp-like Chat App

A WhatsApp Web–style chat application built using the provided sample webhook payloads. Includes a fully functional backend (Node.js + Express + MongoDB Atlas) and a responsive frontend (React) deployed on Vercel.

## 🚀 Live Demo

[![Live Demo](https://img.shields.io/badge/View-Live%20Demo-green)](https://whatsapp-frontend-xrd8.vercel.app/)


⚠️ Important — Render Keep-alive / Redeploy Behavior
The backend is hosted on Render, which may shut down or redeploy after periods of inactivity. This can make the backend temporarily unavailable.
Tip: Open (refresh) the backend link every 15 minutes during use or demos to keep it active and avoid delays.
If you face any issue, simply refresh the backend link 
# Backend- https://whatsapp-backend-k4ne.onrender.com/

# Preview 
![image alt](https://github.com/AiDoodleE/whatsapp/blob/61d1fcae6752b849d86b906e8b89f9ba31fe038f/Screenshot%20desktop.png)
![image alt](https://github.com/AiDoodleE/whatsapp/blob/66582303d8848192ea04b61101c0bb80852026f9/Screenshot%20mobilr.png)
![image alt](https://github.com/AiDoodleE/whatsapp/blob/66582303d8848192ea04b61101c0bb80852026f9/Screenshot%20ipad.png)
## 📌 Features & Implementation

### 1️⃣ Payload Processing & Database Integration
- Used provided sample payloads from the assignment
- Created a script to read and process these payloads
- Stored processed messages in MongoDB Atlas inside the messages collection
- Extracted and saved:
  - Message text
  - Sender & recipient details
  - Timestamps
  - Message status (sent, delivered, read)
  - metaMessageId for unique tracking
- Ensured database schema supports fast retrieval and conversation grouping

### 2️⃣ Frontend — WhatsApp Web Style
- Built a responsive UI inspired by WhatsApp Web
- Clean, organized chat view with timestamps and message status icons
- Fully responsive for mobile and desktop
- Displays user conversations in an intuitive thread-based format

### 3️⃣ Sending New Messages
- Users can send a new message from the frontend
- The backend saves the message in MongoDB
- Messages update instantly in the conversation view

### 4️⃣ Deployment
- Frontend deployed on Vercel for fast, global delivery
- Backend API hosted on Render
- Fully hosted and publicly accessible

### 5️⃣ Assumptions & Design Approach
- Interpreted the brief as creating a WhatsApp-like app following the given payload structure
- Maintained backend API consistency with the assignment payloads
- Kept UI as close as possible to WhatsApp Web for familiarity
- Focused on clean, responsive, and functional design

### 6️⃣ Future Enhancements
- Glow effects and modern UI animations
- Instagram/Messenger-style cloud features for file sharing
- Real-time message updates with WebSockets
- End-to-end encryption for messages
- Message reactions and replies
- Group chat functionality

## 🛠 Tech Stack

### Frontend
- React
- Material-UI
- Axios for API calls
- Deployed on Vercel

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Deployed on Render

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/whatsapp-clone.git
   cd whatsapp-clone
   ```

2. Install backend dependencies
   ```bash
   cd whatsapp-backend
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd ../whatsapp-frontend
   npm install
   ```

4. Set up environment variables
   - Create a `.env` file in the backend directory with:
     ```
     MONGO_URI=your_mongodb_connection_string
     PORT=5000
     ```
   - Create a `.env` file in the frontend directory with:
     ```
     REACT_APP_API_URL=http://localhost:5000/api
     ```

5. Start the development servers
   - Backend:
     ```bash
     cd ../whatsapp-backend
     npm run dev
     ```
   - Frontend (in a new terminal):
     ```bash
     cd whatsapp-frontend
     npm start
     ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- WhatsApp Web for UI/UX inspiration
- Material-UI for the component library
- Vercel and Render for hosting
