import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

const CreateRoom: React.FC = () => {
	const { socket, user } = useContext(SocketContext);

	function initRoom() {
		if (socket) {
			console.log("Creating a new room", socket);
			socket.emit("create-room");
		} else {
			console.error(
				"Socket is null. Unable to emit 'create-room' event."
			);
		}
	}

	const [meetingId, setMeetingId] = useState("");

	const navigate = useNavigate();

	function joinRoom() {
		if (socket && meetingId) {
			console.log("Joining a room with ID:", meetingId);
			socket.emit("join-room", { roomId: meetingId, peerId: user?.id });
			navigate(`/room/${meetingId}`);
		} else {
			console.error(
				"Socket is null or meeting ID is empty. Unable to emit 'join-room' event."
			);
		}
	}

	return (
		<>
			<button
				type="button"
				onClick={initRoom}
				className="btn btn-primary"
			>
				New Meeting
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					className="size-5"
				>
					<path d="M3.25 4A2.25 2.25 0 0 0 1 6.25v7.5A2.25 2.25 0 0 0 3.25 16h7.5A2.25 2.25 0 0 0 13 13.75v-7.5A2.25 2.25 0 0 0 10.75 4h-7.5ZM19 4.75a.75.75 0 0 0-1.28-.53l-3 3a.75.75 0 0 0-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 0 0 1.28-.53V4.75Z" />
				</svg>
			</button>
			<button
				type="button"
				className="btn btn-primary"
				onClick={() =>
					(
						document.getElementById(
							"join-meeting"
						) as HTMLDialogElement
					)?.showModal()
				}
			>
				Join Meeting
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					className="size-5"
				>
					<path
						fillRule="evenodd"
						d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z"
						clipRule="evenodd"
					/>
				</svg>
			</button>
			{/* Open the modal using document.getElementById('ID').showModal() method */}
			<dialog
				id="join-meeting"
				className="modal modal-bottom sm:modal-middle"
			>
				<div className="modal-box">
					<h3 className="mb-6 text-lg font-bold">Join Meeting</h3>
					{/* Input Meeting Id */}
					<label className="flex items-center gap-2 input input-bordered">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							className="w-4 h-4 opacity-70"
						>
							<path
								fillRule="evenodd"
								d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
								clipRule="evenodd"
							/>
						</svg>
						<input
							type="text"
							className="grow"
							placeholder="Meeting ID"
							onChange={(e) => setMeetingId(e.target.value)}
						/>
					</label>
					{/* CheckBox Audio */}
					<div className="form-control">
						<label className="cursor-pointer label">
							<span className="label-text">
								Don't connect to Audio
							</span>
							<input
								type="checkbox"
								defaultChecked
								className="checkbox"
							/>
						</label>
					</div>
					{/* CheckBox Video */}
					<div className="form-control">
						<label className="cursor-pointer label">
							<span className="label-text">
								Turn off my video
							</span>
							<input
								type="checkbox"
								defaultChecked
								className="checkbox"
							/>
						</label>
					</div>
					{/* Button */}
					<div className="modal-action">
						<form
							method="dialog"
							className="flex items-center justify-center gap-6"
						>
							{/* if there is a button in form, it will close the modal */}
							<button
								className="btn"
								onClick={joinRoom}
							>
								Join
							</button>
							<button className="btn">Close</button>
						</form>
					</div>
				</div>
			</dialog>
		</>
	);
};

export default CreateRoom;
