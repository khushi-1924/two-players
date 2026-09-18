import React from "react";
import "./DotsAndBoxes.css";

const GRID_SIZE = 7;

const Grid = () => {

    return (
        <div className="dots-boxes-grid">

            {Array.from({
                length: GRID_SIZE
            }).map((_, row) => (

                <React.Fragment key={row}>

                    {/* ==================================
                        DOT + HORIZONTAL EDGE ROW
                       ================================== */}

                    <div className="dots-boxes-row">

                        {Array.from({
                            length: GRID_SIZE
                        }).map((_, col) => (

                            <React.Fragment key={col}>

                                <div className="dot" />

                                {col <
                                    GRID_SIZE - 1 && (

                                    <button
                                        className="horizontal-edge"
                                        aria-label={`Horizontal edge ${row}-${col}`}
                                    />

                                )}

                            </React.Fragment>

                        ))}

                    </div>


                    {/* ==================================
                        VERTICAL EDGE ROW
                       ================================== */}

                    {row <
                        GRID_SIZE - 1 && (

                        <div className="dots-boxes-row">

                            {Array.from({
                                length: GRID_SIZE
                            }).map((_, col) => (

                                <React.Fragment key={col}>

                                    <button
                                        className="vertical-edge"
                                        aria-label={`Vertical edge ${row}-${col}`}
                                    />

                                    {col <
                                        GRID_SIZE - 1 && (

                                        <div className="empty-space" />

                                    )}

                                </React.Fragment>

                            ))}

                        </div>

                    )}

                </React.Fragment>

            ))}

        </div>
    );
};

export default Grid;