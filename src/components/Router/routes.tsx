/* eslint-disable react/jsx-pascal-case */
import Airdrop from "pages/airdrop"
// import Home from "pages/home"
import { type PathRouteProps } from "react-router-dom"

export const routes: PathRouteProps[] = [
	{
		element: <Airdrop />,
		path: "*" // Catch-all path to load Airdrop as the default page
	}
]
