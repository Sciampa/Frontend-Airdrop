// eslint-disable-next-line import/no-unassigned-import
import "react-toastify/dist/ReactToastify.css"
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react"
import { wallets } from "@cosmos-kit/keplr"
import { ChainProvider } from "@cosmos-kit/react"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { assets, chains } from "chain-registry"
import Layout from "components/Layout"
import Fonts from "components/Layout/components/Fonts"
import RouterSetup from "components/Router/RouterSetup"
import { MotionConfig } from "framer-motion"
import { BrowserRouter as Router } from "react-router-dom"
import { RecoilRoot } from "recoil"
import RecoilNexus from "recoil-nexus"
import { queryClient } from "services/queryClient"

const theme = extendTheme({
	colors: {
		brand: {
			1: "#3B82F6",
			2: "#3B82F6"
		}
	},
	config: {
		initialColorMode: "dark",
		useSystemColorMode: true
	}
})

const App = () => {
	return (
		<ChakraProvider resetCSS theme={theme}>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<Fonts />
			<RecoilRoot>
				<RecoilNexus />
				<QueryClientProvider client={queryClient}>
					<ReactQueryDevtools initialIsOpen={false} />
					<ChainProvider
						chains={[...(chains as unknown as string)]}
						assetLists={assets}
						wallets={wallets}
						walletConnectOptions={{
							signClient: {
								metadata: {
									description: "CosmosKit dapp template",
									icons: [],
									name: "CosmosKit Template",
									url: "https://docs.cosmology.zone/cosmos-kit/"
								},
								projectId: "26a1749294f87bdb977a10767f9b75ff",
								relayUrl: "wss://relay.walletconnect.org"
							}
						}}
					>
						<Router>
							<MotionConfig transition={{ duration: 0.25, type: "tween" }}>
								<Layout>
									<RouterSetup />
								</Layout>
							</MotionConfig>
						</Router>
					</ChainProvider>
				</QueryClientProvider>
			</RecoilRoot>
		</ChakraProvider>
	)
}

export default App
