import Provider from "./provider";

function DLayout({ children }) {
	return (
		<div>
			<Provider>{children}</Provider>
		</div>
	);
}

export default DLayout;
// somehow this makes a route, root/dash
// this is the layout for the root/dash page
