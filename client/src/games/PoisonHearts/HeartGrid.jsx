import React, { useEffect, useState } from 'react'
import { TiHeart } from "react-icons/ti";

const colours = ['text-blue-400', 'text-pink-400', 'text-green-400', 'text-yellow-400', 'text-purple-400', 'text-red-400', 'text-cyan-400', 'text-orange-400', 'text-lime-400', 'text-teal-400', 'text-indigo-400', 'text-gray-400'];

const HeartGrid = () => {

  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const generatedHearts = Array.from({ length: 25 }, () =>
      colours[Math.floor(Math.random() * colours.length)]
    );

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHearts(generatedHearts);
  }, []);

  return (
    <div className="heart-grid">
      {hearts.map((colour, i) => (
        <div key={i} className="heart">
          <TiHeart className={`heart-icon ${colour}`} />
        </div>
      ))}
    </div>
  )
}

export default HeartGrid