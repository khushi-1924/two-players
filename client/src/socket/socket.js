import { io } from "socket.io-client";

import getPlayerId from "../utils/playerId";

const socket = io(
    import.meta.env.VITE_SERVER_URL,
    {
        auth: {
            playerId: getPlayerId()
        },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 3000
    }
);

export default socket;