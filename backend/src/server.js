import dotenv from "dotenv";

dotenv.config();

import connectDB from "./config/db.js";

import { server } from "./socket/socket.js";

const PORT = process.env.PORT || 5001;

connectDB();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});