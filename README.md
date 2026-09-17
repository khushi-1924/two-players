# 🎮 Two Players

A real-time multiplayer web application where two players can challenge each other in a collection of interactive games.

Built with **React, Node.js, Express, MongoDB and Socket.IO**, the application provides real-time gameplay, room-based matchmaking and synchronized game state between players.

🔗 **Live Demo:** https://two-players-omega.vercel.app/

---

## ✨ Features

* 🎮 Multiple two-player games in a single platform
* ⚡ Real-time gameplay using **Socket.IO**
* 👥 Room-based multiplayer system
* 🔄 Synchronized game state between players
* 🔁 Reconnection support when a player refreshes or temporarily disconnects
* 🏆 Win, lose and draw detection
* 🔄 Play Again functionality
* 📱 Responsive game interface
* 🎨 Interactive and user-friendly UI
* ☁️ Deployed frontend and backend

---

## 🕹️ Available Games

### ❌ Tic Tac Toe

Classic 3×3 turn-based game where players compete to get three of their symbols in a row.

### ✊ Rock Paper Scissors

A real-time multiplayer version of the classic Rock Paper Scissors game.

### 🔴 Connect Four

Players take turns dropping discs into columns and try to connect four of their discs horizontally, vertically or diagonally.

### 💔 Poison Hearts

A strategic two-player card-based game where players try to avoid collecting the poison heart.

### 🔢 Guess The Number

One player chooses a number while the other player attempts to guess it using the available hints.

---

## 🛠️ Tech Stack

### Frontend

* **React.js**
* **JavaScript**
* **Tailwind CSS**
* **Socket.IO Client**
* **React Router**
* **Vite**

### Backend

* **Node.js**
* **Express.js**
* **Socket.IO**
* **MongoDB**
* **Mongoose**
* **CORS**
* **dotenv**

### Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

---

## 🏗️ Project Architecture

The project follows a client-server architecture:

```text
                 ┌─────────────────────┐
                 │       Players       │
                 │   Player 1 / 2      │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   React Frontend    │
                 │                     │
                 │  Game UI & Logic    │
                 │  Socket.IO Client   │
                 └──────────┬──────────┘
                            │
                       WebSocket
                       Connection
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Node + Express    │
                 │                     │
                 │    Socket.IO        │
                 │  Game State Logic   │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │      MongoDB        │
                 │                     │
                 │   Game / Room Data  │
                 └─────────────────────┘
```

---

## 📁 Project Structure

```text
two-players/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── games/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── socket/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── ...
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/khushi-1924/two-players.git

cd two-players
```

---

### 2. Install dependencies

Install the frontend dependencies:

```bash
cd client
npm install
```

Then install the backend dependencies:

```bash
cd ../server
npm install
```

---

## 🔐 Environment Variables

### Client

Create a `.env` file inside the `client` directory:

```env
VITE_SERVER_URL=http://localhost:5000
```

### Server

Create a `.env` file inside the `server` directory:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
```

Replace the MongoDB connection string with your MongoDB Atlas connection URI.

---

## ▶️ Running the Application

### Start the backend

From the `server` directory:

```bash
npm run dev
```

The server will run on:

```text
http://localhost:5000
```

### Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

Open the frontend URL in your browser and start playing.

---

## 🔄 Real-Time Multiplayer

The application uses **Socket.IO** to synchronize gameplay between two players.

The general flow is:

```text
Player 1
   │
   │  Game Action
   ▼
Socket.IO Server
   │
   │  Validate / Update State
   ▼
Game State
   │
   │  Broadcast Update
   ▼
Player 2
```

This allows actions performed by one player to be reflected immediately on the opponent's screen.

---

## 🔁 Reconnection Handling

The application also handles player disconnections and page refreshes.

When a player reconnects, the application attempts to:

* Restore the player's game session
* Retrieve the current game state
* Restore the board/game UI
* Restore the correct player's turn
* Continue the game without unnecessarily restarting it

This is particularly important for multiplayer games because a browser refresh should not automatically destroy the ongoing match.

---

## 🎯 What I Learned

This project helped me gain practical experience with:

* Building a full-stack MERN application
* Real-time communication using Socket.IO
* Designing multiplayer game logic
* Managing synchronized state between clients
* Handling player rooms and sessions
* Handling disconnect and reconnect scenarios
* Creating reusable React components and hooks
* Working with MongoDB and Mongoose
* Deploying a full-stack application
* Debugging real-time state synchronization issues

---

## 📸 Screenshots

Add screenshots of the application here.

### Home Page

![Home Page](<img width="1917" height="617" alt="image" src="https://github.com/user-attachments/assets/b4377ff9-036b-4dbb-8ca9-8c0e743f4f45" />)

### Tic Tac Toe

![Tic Tac Toe]
<img width="1907" height="842" alt="image" src="https://github.com/user-attachments/assets/cb46b9e5-9885-4af9-b6d9-7b1337cd004d" />

### Connect Four

![Connect Four](./screenshots/connect-four.png)

### Rock Paper Scissors

![Rock Paper Scissors](./screenshots/rps.png)

### Poison Hearts

![Poison Hearts](./screenshots/poison-hearts.png)

### Guess The Number

![Guess The Number](./screenshots/guess-number.png)

---

## 🔮 Future Improvements

Some possible improvements for the project:

* [ ] Add player authentication
* [ ] Add player profiles
* [ ] Add game statistics and match history
* [ ] Add a leaderboard
* [ ] Add more multiplayer games
* [ ] Improve reconnection handling across all games
* [ ] Add game invitations
* [ ] Add spectator mode
* [ ] Add sound effects and animations
* [ ] Improve mobile responsiveness
* [ ] Add private/public rooms
* [ ] Add in-game chat

---

## 🌐 Live Demo

Play the games online:

**https://two-players-omega.vercel.app/**

---

## 👩‍💻 Author

**Khushi**

B.Tech Information Technology

GitHub:
https://github.com/khushi-1924

---

## ⭐ Support

If you like this project, consider giving the repository a ⭐ on GitHub!

