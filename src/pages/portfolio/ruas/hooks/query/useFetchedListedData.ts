/* eslint-disable no-console */
import { useChain } from "@cosmos-kit/react"
import { useEffect, useState } from "react"

type SwapsDataFetcherProps = {
	marketAddress: string
	onHighestOfferUpdate: (offer: number | null) => void
	onHighestPriceUpdate: (price: number | null) => void
	tokenId: string
}

const FetchedListedData = ({
	marketAddress,
	tokenId,
	onHighestPriceUpdate,
	onHighestOfferUpdate
}: SwapsDataFetcherProps) => {
	const { address, getCosmWasmClient } = useChain(import.meta.env.VITE_NEUTRONNETWORK)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [swapsData, setSwapsData] = useState<{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: { highestPriceMap: { [key: string]: number }; swaps: any[] }
	}>({})

	// Fetch swaps data and update highest price
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-shadow
		const fetchSwapsData = async (marketAddress: string) => {
			if (!marketAddress) return

			try {
				const cosmwasmClient = await getCosmWasmClient()
				const response = await cosmwasmClient.queryContractSmart(marketAddress, {
					swaps_of: { address }
				})

				if (response?.swaps && Array.isArray(response.swaps)) {
					const swaps = response.swaps
					const highestPriceMap: { [key: string]: number } = {}

					// eslint-disable-next-line @typescript-eslint/no-explicit-any, unicorn/no-array-for-each
					swaps.forEach((swap: any) => {
						// eslint-disable-next-line @typescript-eslint/no-shadow
						const tokenId = swap.token_id
						const price = Number.parseFloat(swap.price)

						if (!highestPriceMap[tokenId] || price > highestPriceMap[tokenId]) {
							highestPriceMap[tokenId] = price
						}
					})

					const currentHighestPrice = highestPriceMap[tokenId] || null
					onHighestPriceUpdate(currentHighestPrice)

					setSwapsData((previous) => ({
						...previous,
						[marketAddress]: { highestPriceMap, swaps }
					}))
				}
			} catch (error) {
				console.error("Error fetching swaps data:", error)
			}
		}

		if (marketAddress) {
			void fetchSwapsData(marketAddress)
		}
	}, [marketAddress, address, getCosmWasmClient, tokenId, onHighestPriceUpdate])

	// Fetch offer data and update highest offer
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-shadow
		const fetchOfferData = async (marketAddress: string) => {
			if (!marketAddress || !tokenId) return

			try {
				const cosmwasmClient = await getCosmWasmClient()
				const response = await cosmwasmClient.queryContractSmart(marketAddress, {
					get_offers: {} // Adjust this query based on your contract's implementation
				})

				if (response?.swaps && Array.isArray(response.swaps)) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const matchingSwaps = response.swaps.filter((swap: any) => swap.token_id === tokenId)

					// eslint-disable-next-line unicorn/no-array-reduce
					const highestOffer = matchingSwaps.reduce((maxPrice: number, swap: { price: string }) => {
						const price = Number.parseFloat(swap.price)
						return !Number.isNaN(price) && price > maxPrice ? price : maxPrice
					}, 0)

					onHighestOfferUpdate(highestOffer > 0 ? highestOffer : null)
				}
			} catch (error) {
				console.error("Error fetching offer data:", error)
			}
		}

		if (marketAddress && tokenId) {
			void fetchOfferData(marketAddress)
		}
	}, [marketAddress, address, getCosmWasmClient, tokenId, onHighestOfferUpdate])

	return null
}

export default FetchedListedData
