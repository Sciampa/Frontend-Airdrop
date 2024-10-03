/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

export const ruaListUrl = `https://api.electronprotocol.io/${
	import.meta.env.VITE_NEUTRONNETWORK === "neutron" ? "mainnet/" : "testnet/"
}ruaList`

export type TRuaCollection = {
	Author: string
	Tquantity: string
	contractAddress: string
	description: string
	image: string
	imageA: string
	imageB: string
	isVerified: boolean
	marketAddress: string
	name: string
	poolContract: string
	ruaId: number
	shareRanking: number
	socials: {
		medium?: string
		telegram?: string
		twitter?: string
		website?: string
	}
	tokenA: string
	tokenB: string
}

export const useRuaList = () => {
	const { data, isLoading } = useQuery<TRuaCollection[]>(
		["@fuzio/ruaList"],
		async () => {
			const response = await fetch(
				import.meta.env.VITE_NEUTRONNETWORK === "neutron"
					? "https://api.electronprotocol.io/ruaList"
					: "https://apit.electronprotocol.io/ruaList"
			)
			const responseJson = await response.json()
			return responseJson.collections as TRuaCollection[]
		},
		{
			notifyOnChangeProps: ["data", "error"],
			onError() {
				throw new Error("Failed to fetch ruaList")
			},
			refetchOnMount: true,
			refetchOnReconnect: true,
			refetchOnWindowFocus: true,
			retry: false
		}
	)

	return [data, isLoading] as const
}

export const useRuaFromListQueryById = ({ ruaId }: { ruaId: number }) => {
	const [ruaList, isLoading] = useRuaList()

	const requestedRua = useMemo(() => {
		if (!ruaList?.length) return

		return ruaList.find((rua: TRuaCollection) => rua.ruaId === ruaId)
	}, [ruaId, ruaList])

	return [requestedRua, isLoading] as const
}

export const useRuaListDataless = () => {
	const { data, isLoading } = useQuery<TRuaCollection[]>(
		["@fuzio/ruaList/dataless"],
		async () => {
			const response = await fetch(ruaListUrl)
			const responseJson = await response.json()
			return responseJson.collections as TRuaCollection[]
		},
		{
			notifyOnChangeProps: ["data", "error"],
			onError() {
				throw new Error("Failed to fetch ruaList")
			},
			refetchOnMount: true,
			refetchOnReconnect: true,
			refetchOnWindowFocus: true,
			retry: false
		}
	)

	return [data, isLoading] as const
}
