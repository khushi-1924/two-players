import React from 'react'
import Cell from './Cell';

const Grid = () => {
  const board = Array(9).fill(null);
  return (
    <div className='grid grid-cols-3 gap-2'>
      {board.map((val, index) => (
        <Cell key={index} value={val} />
      ))}
    </div>
  )
}

export default Grid
