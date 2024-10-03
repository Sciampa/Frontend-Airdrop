/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable no-console */
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

export type Swap = {
	creator: string
	expires: string
	id: string
	nft_contract: string
	payment_token: string | null
	price: string
	swap_type: string
	token_id: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	units: (argument0: number, units: any) => import("react").ReactNode
}

export type Offer = {
	creator: string
	expires: string
	id: string
	nft_contract: string
	payment_token: string | null
	price: string
	swap_type: string
	token_id: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	units: (argument0: number, units: any) => import("react").ReactNode
}

export type ContractResponse = {
	page: number
	swaps: Swap[]
	total: string
}

export type ContractResponseOffer = {
	page: number
	swaps: Swap[]
	total: string
}

const RPC_URL = "https://rpc.electronprotocol.io"

const queryContractListing = async (marketAddress: string) => {
	try {
		const client = await CosmWasmClient.connect(RPC_URL)

		const queryMessage = { get_listings: {} }

		const result = await client.queryContractSmart(marketAddress, queryMessage)

		return result as ContractResponse
	} catch {
		throw new Error("Failed to fetch contract listings")
	}
}

const queryContractOffers = async (marketAddress: string) => {
	try {
		const client = await CosmWasmClient.connect(RPC_URL)
		const queryMessage = { get_offers: {} }
		const result = await client.queryContractSmart(marketAddress, queryMessage)

		return result as ContractResponseOffer
	} catch {
		throw new Error("Failed to fetch contract offers")
	}
}

export const useContractList = (marketAddress: string) => {
	const { data, isLoading, error } = useQuery<ContractResponse>(
		["@fuzio/contractList", marketAddress],
		async () => await queryContractListing(marketAddress),
		{
			notifyOnChangeProps: ["data", "error"],
			// eslint-disable-next-line @typescript-eslint/no-shadow
			onError: (error) => {
				console.error("Query error:", error)
			},
			refetchOnMount: false,
			refetchOnReconnect: true,
			refetchOnWindowFocus: true,
			retry: false
		}
	)

	return [data, isLoading, error] as const
}

export const useContractOffers = (marketAddress: string) => {
	const { data, isLoading, error } = useQuery<ContractResponseOffer>(
		["@fuzio/contractOffers", marketAddress],
		async () => await queryContractOffers(marketAddress),
		{
			notifyOnChangeProps: ["data", "error"],
			// eslint-disable-next-line @typescript-eslint/no-shadow
			onError: (error) => {
				console.error("Query error:", error)
			},
			refetchOnMount: false,
			refetchOnReconnect: true,
			refetchOnWindowFocus: true,
			retry: false
		}
	)

	return [data, isLoading, error] as const
}

export const useContractListingById = ({
	id,
	marketAddress
}: {
	id: string
	marketAddress: string
}) => {
	const [contractList, isLoading] = useContractList(marketAddress)

	const requestedListing = useMemo(() => {
		if (!contractList?.swaps) {
			return undefined
		}

		const listing = contractList.swaps.find((swap) => swap.id === id)

		return listing
	}, [id, contractList])

	if (isLoading) {
		console.log("Loading specific listing...")
	}

	return [requestedListing, isLoading] as const
}
