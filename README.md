
# Real-Time Chat Application

**Author:** Scylla@8434

## How the System Works

This is a real-time chat application built with React (client) and Node.js/Express/Socket.io (server), with MongoDB for persistent user authentication.

### Features
- **User Registration & Login:** Users register with a unique username, email, and password. Authentication is persistent and secure.
- **Online Presence:** The app shows a list of online users in real time.
- **Multiple Chat Rooms:** Users can join and chat in "general", "random", or "tech" rooms. Messages are visible to all users in the same room.
- **Real-Time Messaging:** Messages are sent and received instantly using Socket.io.
- **Notifications:** Users see notifications when someone joins a room.
- **Typing Indicators:** See when another user is typing in the same room.
- **Read Receipts:** See when another user has read the latest messages.
- **Responsive UI:** The interface is professional and mobile-ready.

### How to Use
1. Register a new account with username, email, and password.
2. Log in to access the chat interface.
3. Choose a chat room (general, random, tech) from the sidebar.
4. Send messages, see who is online, and watch for typing/read indicators.
5. Open the app in another browser or device, log in as a different user, and chat in real time.

### Notes
- All chat and presence features work in real time.
- User authentication and online status are stored in MongoDB.
- The app is fully responsive and works on all screen sizes.

---
**Author:** Scylla@8434