/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-shadow */
import { useEffect, useState } from "react"

type Socials = {
	medium?: string
	telegram?: string
	twitter?: string
	website?: string
}

type Collection = {
	Author: string
	Tquantity: string
	contractAddress: string
	description?: string
	forsale?: number | null
	image: string
	imageA: string
	imageB: string
	isVerified: boolean
	issuerContract: string
	marketAddress: string
	name: string
	ruaId: number
	socials?: Socials
}

// Custom hook to fetch collection data
export const useCollectionData = (ruaId: number | undefined) => {
	const [collection, setCollection] = useState<Collection | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			setError(null)

			try {
				const response = await fetch("https://api.electronprotocol.io/ruaList")

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`)
				}

				const data = await response.json()

				if (!data.collections) {
					throw new Error("Data structure is incorrect. No 'collections' array found.")
				}

				const selectedCollection = data.collections.find(
					(coll: Collection) => Number(coll.ruaId) === ruaId
				)

				if (selectedCollection) {
					selectedCollection.isVerified = selectedCollection.isVerified === "true"
					setCollection(selectedCollection || null)
				} else {
					setCollection(null)
				}
			} catch (error) {
				setError((error as Error).message)
			} finally {
				setIsLoading(false)
			}
		}

		if (ruaId !== undefined) {
			void fetchData()
		}
	}, [ruaId])

	return { collection, error, isLoading }
}

export default useCollectionData
