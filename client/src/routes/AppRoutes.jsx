import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import PoisonHearts from '../games/PoisonHearts/PoisonHearts'
import TicTacToe from '../games/TicTacToe/TicTacToe'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/game/poison-hearts' element={<PoisonHearts />} />
        <Route path='/game/tic-tac-toe' element={<TicTacToe />} />

    </Routes>
  )
}

export default AppRoutes
