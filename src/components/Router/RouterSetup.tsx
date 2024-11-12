import { routes } from "./routes"
import Airdrop from "pages/airdrop"
import { Route, Routes } from "react-router-dom"

const RouterSetup = () => {
	return (
		<Routes>
			{routes.map((routeProps) => (
				<Route {...routeProps} key={routeProps.path as string} />
			))}
			<Route element={<Airdrop />} path="*" />
		</Routes>
	)
}

export default RouterSetup
