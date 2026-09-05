import { useState } from "react";
import "./Instructions.css";

function Instructions({ instructions }) {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <>
      <button
        className="instructions-button"
        onClick={() => setShowInstructions(true)}
        aria-label="How to play"
      >
        ?
      </button>

      {showInstructions && (
        <div
          className="instructions-overlay"
          onClick={() => setShowInstructions(false)}
        >
          <div
            className="instructions-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="instructions-header">
              <h2>How to Play</h2>

              <button
                className="instructions-close"
                onClick={() => setShowInstructions(false)}
                aria-label="Close instructions"
              >
                ×
              </button>
            </div>

            <div className="instructions-list">
              {instructions.map((instruction, index) => (
                <div
                  className="instruction-item"
                  key={index}
                >
                  <div className="instruction-number">
                    {index + 1}
                  </div>

                  <div className="instruction-content">
                    <h4 className="text-xl text-blue-200 text-center mb-2">{instruction.title}</h4>
                    <p>{instruction.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Instructions;