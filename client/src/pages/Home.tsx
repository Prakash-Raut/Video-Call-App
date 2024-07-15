import CreateRoom from "../components/CreateRoom";

const Home: React.FC = () => {
	return (
		<section className="flex flex-col items-center justify-center w-full h-screen gap-10">
			<CreateRoom />
		</section>
	);
};

export default Home;
