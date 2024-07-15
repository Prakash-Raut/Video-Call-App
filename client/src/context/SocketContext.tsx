import Peer from "peerjs";
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Socket } from "socket.io-client";
import SocketIoClient from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { addPeerAction, removePeerAction } from "../actions/peerAction";
import { peerReducer } from "../reducers/peerReducer";

// WebSocket Server URL
const WS_Server = "http://localhost:5500";

// Create a context for the socket, user, and stream
export const SocketContext = createContext<{
	socket: Socket | null;
	user: Peer | null;
	stream: MediaStream | null;
	peers: Record<string, { stream: MediaStream }>;
}>({ socket: null, user: null, stream: null, peers: {}});

// Initialize the socket connection
const socket = SocketIoClient(WS_Server, {
	// withCredentials: true,
	// transports: ["polling", "websocket"],
});

interface Props {
	children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
	const navigate = useNavigate();

	const [user, SetUser] = useState<Peer | null>(null);

	const [stream, setStream] = useState<MediaStream | null>(null);

	const [peers, dispatch] = useReducer(peerReducer, {});

	// Fetch the user's media stream
	async function fetchUserFeed() {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});
		setStream(stream);
	}

	// Fetch the list of participants in a room
	function fetchParticipantList({
		roomId,
		participants,
	}: {
		roomId: string;
		participants: string[];
	}) {
		console.log("Fetched room participants");
		console.log(roomId, participants);
	}

	useEffect(() => {
		const userId = uuidv4();
		const peer = new Peer(userId);

		SetUser(peer);

		fetchUserFeed();

		// Enter a room when it is created
		const enterRoom = ({ roomId }: { roomId: string }) => {
			navigate(`/room/${roomId}`);
		};

		// Listen for room creation event
		socket.on("room-created", enterRoom);

		// Listen for get-users event to fetch participant list
		socket.on("get-users", fetchParticipantList);

		// Clean up event listeners when the component is unmounted
		return () => {
			socket.off("room-created", enterRoom);
			socket.off("get-users", fetchParticipantList);
		};
	}, []);

	useEffect(() => {
		if (!user || !stream) return;

		socket.on("user-joined", ({ peerId }: { peerId: string }) => {
			const call = user.call(peerId, stream);
			console.log("Calling peer: ", peerId, call);

			call.on("stream", () => {
				dispatch(addPeerAction(peerId, stream));
			});
		});

		user.on("call", (call) => {
			console.log("Incoming call: ", call);
			call.answer(stream);

			call.on("stream", () => {
				dispatch(removePeerAction(call.peer, stream));
			});
		});

		socket.emit("ready");
	}, [user, stream]);

	return (
		<SocketContext.Provider
			value={{ socket: socket, user: user, stream: stream, peers: peers }}
		>
			{children}
		</SocketContext.Provider>
	);
};
