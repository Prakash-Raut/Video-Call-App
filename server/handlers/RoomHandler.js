"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const rooms = {};
function roomHandler(socket) {
    /**
     * Creates a new room and joins the socket to it.
     * Generates a unique room ID using uuidv4 and adds the room to the 'rooms' object.
     * Emits a 'room-created' event to the socket with the generated room ID.
     * Logs the created room ID to the console.
     */
    function createRoom() {
        const roomId = (0, uuid_1.v4)();
        socket.join(roomId);
        rooms[roomId] = [];
        socket.emit("room-created", { roomId });
        console.log("Room created with id: ", roomId);
    }
    /**
     * Joins a user to an existing room.
     * Checks if the room exists in the 'rooms' object.
     * If the room exists, adds the user to the room and joins the socket to the room.
     * Emits a 'user-joined' event to the room with the peer ID of the user who joined the room.
     * Emits a 'get-users' event to the socket with the room ID and the participants in the room.
     * Logs the room ID and the peer ID of the user who joined the room to the console.
     */
    function joinRoom({ roomId, peerId }) {
        if (rooms[roomId]) {
            console.log("New user has joined the room", roomId, "with peer id :", peerId);
            rooms[roomId].push(peerId);
            socket.join(roomId);
        }
        socket.on("ready", () => {
            socket.to(roomId).emit("user-joined", peerId);
        });
        socket.emit("get-users", {
            roomId,
            participants: rooms[roomId],
        });
    }
    /*
     * Leaves a user from a room.
     * Removes the user from the room in the 'rooms' object.
     * Emits a 'user-left' event to the room with the peer ID of the user who left the room.
     * Logs the room ID and the peer ID of the user who left the room to the console.
    */
    function leaveRoom({ roomId, peerId }) {
        console.log("User left the room", roomId, "with peer id :", peerId);
        // delete the room id from the rooms 
    }
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
    socket.on("leave-room", leaveRoom);
}
exports.default = roomHandler;
