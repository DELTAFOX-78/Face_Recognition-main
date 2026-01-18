// export const attachSocketIO = (io) => (req, res, next) => {
//   req.io = io;
//   next();
// };

// Create a middleware to attach socket.io to the request object
export const attachSocketIO = (io) => (req, res, next) => {
  req.io = io;
  next();
};

// Export both for backwards compatibility
export const createSocketMiddleware = attachSocketIO;
