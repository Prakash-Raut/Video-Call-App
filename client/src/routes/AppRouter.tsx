import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Room from "../pages/Room";

const AppRouter = () => {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/room/:id" element={<Room />} />
			</Routes>
		</>
	);
};

export default AppRouter;
