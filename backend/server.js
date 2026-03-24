import "dotenv/config";
import app from "./src/app.js";
import http from "http";
import connectDB from "./src/config/databse.js";
import { initSocket } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT || 8000;

const httpServer = http.createServer(app);

initSocket(httpServer);

connectDB();
// testAi();

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
