const PLAYER_ID_KEY = "twoPlayers_playerId";

const getPlayerId = () => {

    let playerId =
        localStorage.getItem(
            PLAYER_ID_KEY
        );

    if (!playerId) {

        playerId =
            crypto.randomUUID();

        localStorage.setItem(
            PLAYER_ID_KEY,
            playerId
        );

    }

    return playerId;
};

export default getPlayerId;