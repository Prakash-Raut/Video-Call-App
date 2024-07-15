import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ControlBox } from "../components/ControlBox";
import { UserFeedPlayer } from "../components/UserFeedPlayer";
import { SocketContext } from "../context/SocketContext";

const Room: React.FC = () => {
	const { id } = useParams();

	const { socket, user, stream, peers } = useContext(SocketContext);

	useEffect(() => {
		if (user && socket) {
			socket.emit("join-room", { roomId: id, peerId: user.id });
		}
	}, [id, user, socket]);

	return (
		<section className="flex flex-col items-center justify-center w-full min-h-screen gap-5">
			<h2>My Feed</h2>
			<h3>Room : {id}</h3>
			<h3>Peer: {user?.id}</h3>
			<UserFeedPlayer stream={stream || new MediaStream()} />
			<ControlBox stream={stream || new MediaStream()} />

			<div className="divider">
				<h2>Other Feed</h2>
				{Object.keys(peers).map((peerId) => (
					<>
						<UserFeedPlayer stream={peers[peerId].stream} />
					</>
				))}
			</div>
		</section>
	);
};

export default Room;
