/* eslint-disable no-console */
import { getModal } from "./WalletModal/getModal"
import { type Chain } from "@chain-registry/types"
// import { Decimal } from "@cosmjs/math"
import { Registry } from "@cosmjs/proto-signing"
import { type AminoConverters } from "@cosmjs/stargate"
// import { GasPrice } from "@cosmjs/stargate"
import { type ChainName } from "@cosmos-kit/core"
import { type SigningCosmWasmClientOptions } from "@cosmos-kit/core/node_modules/@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient"
import { Decimal } from "@cosmos-kit/core/node_modules/@cosmjs/math/build/decimal"
import { AminoTypes } from "@cosmos-kit/core/node_modules/@cosmjs/stargate/build/aminotypes"
import { GasPrice } from "@cosmos-kit/core/node_modules/@cosmjs/stargate/build/fee"
import { wallets as keplrWallets } from "@cosmos-kit/keplr"
import { wallets as leapWallets } from "@cosmos-kit/leap"
import { ChainProvider } from "@cosmos-kit/react"
import {
	cosmwasmAminoConverters,
	cosmwasmProtoRegistry,
	ibcAminoConverters,
	ibcProtoRegistry,
	seiprotocolAminoConverters,
	seiprotocolProtoRegistry
} from "@sei-js/proto"
import { assets, chains } from "chain-registry"
import { useMemo } from "react"

export const NeutronProvider = ({ children }: { children?: React.ReactNode }) => {
	const neutronMainnet: Chain = useMemo(() => {
		const neutronChain = {
			apis: {
				grpc: [
					{
						address: "neutron-grpc.publicnode.com:443",
						provider: "Neutron"
					},
					{
						address: "grpc.baryon.remedy.tm.p2p.org:443",
						provider: "P2P.ORG"
					}
				],
				rest: [
					{
						address: "https://neutron-rest.publicnode.com",
						provider: "Neutron"
					},
					{
						address: "https://api.pion.remedy.tm.p2p.org",
						provider: "P2P.ORG"
					},
					{
						address: "https://rest.baryon-sentry-01.rs-testnet.polypore.xyz",
						provider: "Hypha"
					}
				],
				rpc: [
					{
						address: "https://rpc.electronprotocol.io:443"
					}
				]
			},
			bech32_prefix: "neutron",
			chain_id: "neutron-1",
			chain_name: "neutron",
			daemon_name: "neutrond",
			explorers: [],
			fees: {
				fee_tokens: [
					{
						average_gas_price: 0.006,
						denom: "untrn",
						fixed_min_gas_price: 0.006,
						high_gas_price: 0.006,
						low_gas_price: 0.006
					}
				]
			},
			network_type: "mainnet",
			pretty_name: "Neutron",
			slip44: 118,
			staking: {
				staking_tokens: [{ denom: "untrn" }]
			},
			status: "live",
			website: "https://neutron.org"
		}
		console.log("Neutron Mainnet Chain Object:", neutronChain)
		return neutronChain
	}, [])

	return (
		<ChainProvider
			assetLists={assets}
			logLevel="DEBUG"
			chains={[...chains, neutronMainnet]}
			defaultNameService="icns"
			endpointOptions={{
				endpoints: {
					neutron: {
						rpc: ["https://rpc.electronprotocol.io:443"]
					},
					neutrontestnet: {
						rpc: ["https://rpc.electronprotocol.io:443"]
					}
				},
				isLazy: true
			}}
			key="chainProvider"
			signerOptions={{
				signingCosmwasm: (chain: Chain | ChainName): SigningCosmWasmClientOptions => {
					console.log("signingCosmwasm called with chain:", chain)
					const neutronRegistry = new Registry([
						...seiprotocolProtoRegistry,
						...ibcProtoRegistry,
						...cosmwasmProtoRegistry
					])
					console.log("Neutron Registry:", neutronRegistry)

					const aminoConverters: AminoConverters = {
						...cosmwasmAminoConverters,
						...ibcAminoConverters,
						...seiprotocolAminoConverters
					}
					console.log("Amino Converters:", aminoConverters)

					const aminoTypes = new AminoTypes(aminoConverters)
					console.log("Amino Types:", aminoTypes)

					switch ((chain as Chain).chain_name) {
						case "neutrontestnet":
							return {
								aminoTypes,
								broadcastPollIntervalMs: 200,
								gasPrice: GasPrice.fromString("0.006untrn"),
								registry: neutronRegistry
							}

						case "neutron":
							return {
								aminoTypes,
								broadcastPollIntervalMs: 200,
								gasPrice: GasPrice.fromString("0.006untrn"),
								registry: neutronRegistry
							}

						default:
							return {
								broadcastPollIntervalMs: 6_000,
								gasPrice: GasPrice.fromString("0uatom")
							}
					}
				},
				signingStargate: (chain: Chain | ChainName): SigningCosmWasmClientOptions => {
					console.log("signingStargate called with chain:", chain)
					const neutronRegistry = new Registry([...seiprotocolProtoRegistry, ...ibcProtoRegistry])
					console.log("Neutron Registry:", neutronRegistry)

					const aminoConverters: AminoConverters = {
						...seiprotocolAminoConverters,
						...ibcAminoConverters
					}
					console.log("Amino Converters:", aminoConverters)

					const aminoTypes = new AminoTypes(aminoConverters)
					console.log("Amino Types:", aminoTypes)

					switch ((chain as Chain).chain_name) {
						case "seitestnet2":
							return {
								aminoTypes,
								broadcastPollIntervalMs: 200,
								gasPrice: GasPrice.fromString("0.1usei"),
								registry: neutronRegistry
							}

						case "sei":
							return {
								aminoTypes,
								broadcastPollIntervalMs: 200,
								gasPrice: GasPrice.fromString("0.1usei"),
								registry: neutronRegistry
							}

						case "juno":
							return {
								broadcastPollIntervalMs: 1_000,
								gasPrice: GasPrice.fromString("0.075ujuno")
							}
						case "cosmoshub":
							return {
								broadcastPollIntervalMs: 1_000,
								gasPrice: new GasPrice(Decimal.fromAtomics("25000", 6), "uatom")
							}
						case "osmosis":
							return {
								broadcastPollIntervalMs: 1_000,
								gasPrice: new GasPrice(Decimal.fromAtomics("25000", 6), "uosmo")
							}
						case "axelar":
							return {
								broadcastPollIntervalMs: 1_000,
								gasPrice: new GasPrice(Decimal.fromAtomics("25000", 6), "uaxl")
							}
						case "kujira":
							return {
								broadcastPollIntervalMs: 1_000,
								gasPrice: new GasPrice(Decimal.fromAtomics("25000", 6), "ukuji")
							}
						case "stargaze":
							return {
								broadcastPollIntervalMs: 1_000,
								gasPrice: new GasPrice(Decimal.fromAtomics("25000", 6), "ustars")
							}
						case "comdex":
							return {
								broadcastPollIntervalMs: 1_000,
								gasPrice: new GasPrice(Decimal.fromAtomics("25000", 6), "ucmdx")
							}
						case "chihuahua":
							return {
								broadcastPollIntervalMs: 1_000,
								gasPrice: new GasPrice(Decimal.fromAtomics("5000000", 6), "uhuahua")
							}
						case "mars":
							return {
								broadcastPollIntervalMs: 1_000,
								gasPrice: new GasPrice(Decimal.fromAtomics("25000", 6), "umars")
							}
						case "evmos":
							return {
								broadcastPollIntervalMs: 1_000,
								gasPrice: new GasPrice(Decimal.fromAtomics("40000000000", 2), "aevmos")
							}
						case "planq":
							return {
								broadcastPollIntervalMs: 1_000,
								gasPrice: new GasPrice(Decimal.fromAtomics("40000000000", 2), "aplanq")
							}

						default:
							return {
								broadcastPollIntervalMs: 1_000,
								gasPrice: GasPrice.fromString("0uatom")
							}
					}
				}
			}}
			walletConnectOptions={{
				signClient: {
					metadata: {
						description: "Bridging the gap between CEX and DeFi",
						icons: ["/assets/electron.png"],
						name:
							import.meta.env.VITE_NEUTRONNETWORK === "neutron"
								? "Neutron Network"
								: "Neutron Network Testnet",
						url:
							import.meta.env.VITE_NEUTRONNETWORK === "neutron"
								? "https://airdrop.electronprotocol.io"
								: "https://testnet.electronprotocol.io"
					},
					name: "Electron Protocol",
					projectId: "26a1749294f87bdb977a10767f9b75ff",
					relayUrl: "wss://relay.walletconnect.org"
				}
			}}
			walletModal={getModal()}
			wallets={[...keplrWallets, ...leapWallets]}
		>
			{children}
		</ChainProvider>
	)
}
