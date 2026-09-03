import React from "react";
import { TiHeart } from "react-icons/ti";


// =====================================================
// SAME HEART LAYOUT FOR BOTH PLAYERS
// =====================================================

const colours = [
    "text-blue-400",
    "text-pink-400",
    "text-green-400",
    "text-yellow-400",
    "text-purple-400",
    "text-red-400",
    "text-cyan-400",
    "text-orange-400",
    "text-lime-400",
    "text-teal-400",
    "text-indigo-400",
    "text-gray-400"
];


// 36 hearts = 6 x 6

const heartColours = [
    colours[0],
    colours[1],
    colours[2],
    colours[3],
    colours[4],
    colours[5],

    colours[6],
    colours[7],
    colours[8],
    colours[9],
    colours[10],
    colours[11],

    colours[1],
    colours[5],
    colours[0],
    colours[8],
    colours[3],
    colours[6],

    colours[9],
    colours[2],
    colours[7],
    colours[4],
    colours[11],
    colours[5],

    colours[6],
    colours[1],
    colours[10],
    colours[3],
    colours[0],
    colours[8],

    colours[4],
    colours[7],
    colours[5],
    colours[9],
    colours[2],
    colours[11]
];


const HeartGrid = () => {

    return (

        <div className="heart-grid">

            {heartColours.map(
                (colour, index) => (

                    <button
                        key={index}
                        className="heart"
                    >

                        <TiHeart
                            className={`heart-icon ${colour}`}
                        />

                    </button>

                )
            )}

        </div>

    );

};


export default HeartGrid;