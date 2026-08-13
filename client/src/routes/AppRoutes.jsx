import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import PoisonHearts from '../games/PoisonHearts/PoisonHearts'
import TicTacToe from '../games/TicTacToe/TicTacToe'
import RockPaperScissors from '../games/RockPaperScissors/RockPaperScissors'
import ConnectFour from '../games/ConnectFour/ConnectFour'
import GuessTheNumber from '../games/GuessTheNumber/GuessTheNumber'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import RoomSelection from '../rooms/RoomSelection';
import CreateRoom from '../rooms/CreateRoom';
import JoinRoom from '../rooms/JoinRoom';
import GameRoom from '../rooms/GameRoom';

const AppRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/game/poison-hearts' element={<PoisonHearts />} />
        <Route path='/game/tic-tac-toe' element={<TicTacToe />} />
        <Route path='/game/rps' element={<RockPaperScissors />} />
        <Route path='/game/connect-four' element={<ConnectFour />} />
        <Route path='/game/guess-the-number' element={<GuessTheNumber />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="/rooms" element={<RoomSelection />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/game-room" element={<GameRoom />} />

    </Routes>
  )
}

export default AppRoutes
