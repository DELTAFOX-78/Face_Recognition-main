let io;

export const initSocket = (socketIoInstance) => {
    io = socketIoInstance;
    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
