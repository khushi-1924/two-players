const gameSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Player disconnected:", socket.id);
    });
  });
};

export default gameSocket;