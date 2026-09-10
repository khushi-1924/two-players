import { useMemo } from "react";

const usePlayerNames = () => {
    const playerNames = useMemo(() => {
        try {
            return JSON.parse(
                sessionStorage.getItem("playerNames")
            ) || {
                1: "Player 1",
                2: "Player 2",
            };
        } catch {
            return {
                1: "Player 1",
                2: "Player 2",
            };
        }
    }, []);

    const playerNumber = Number(
        sessionStorage.getItem("playerNumber")
    );

    const myName =
        playerNames[playerNumber] ||
        "You";

    const opponentNumber =
        playerNumber === 1 ? 2 : 1;

    const opponentName =
        playerNames[opponentNumber] ||
        "Opponent";

    return {
        playerNames,
        myName,
        opponentName,
        playerNumber,
    };
};

export default usePlayerNames;