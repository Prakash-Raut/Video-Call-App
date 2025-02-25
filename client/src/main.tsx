import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<SocketProvider>
			<App />
		</SocketProvider>
	</BrowserRouter>
);
