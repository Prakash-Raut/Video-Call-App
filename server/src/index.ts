import cors from "cors";
import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import ServerConfig from "./config/ServerConfig";
import roomHandler from "./handlers/RoomHandler";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log(`socket ${socket.id} connected`);
	console.log("New user connected");
	roomHandler(socket);
	socket.on("disconnect", (reason) => {
		console.log(`socket ${socket.id} disconnected due to ${reason}`);
		console.log("User disconnected");
	});
});

server.listen(ServerConfig.PORT, () => {
	console.log(`Server is running on port ${ServerConfig.PORT}`);
});
