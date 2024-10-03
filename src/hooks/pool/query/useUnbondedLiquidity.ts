/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { useChain } from "@cosmos-kit/react"
import { useQuery } from "@tanstack/react-query"
import { BigNumber } from "bignumber.js"
import { type TPool } from "utils/tokens/pools"

export const useUnbondedLiquidity = ({ pool }: { pool: TPool }) => {
	const { isWalletConnected, address, getSigningCosmWasmClient } = useChain(
		import.meta.env.VITE_NEUTRONNETWORK
	)

	const { data = BigNumber(0), isLoading } = useQuery<BigNumber>(
		[
			`@fuzio/unbondedTokens/${pool.liquidity.token1.denom}/${pool.liquidity.token2.denom}/${address}`
		],
		async () => {
			const client = await getSigningCosmWasmClient()

			try {
				const balanceQuery: { balance: string } = await client.queryContractSmart(
					pool.lpTokenAddress,
					{
						balance: { address }
					}
				)

				let balance = BigNumber(balanceQuery.balance)

				balance = balance.isNaN() ? BigNumber(0) : balance

				return balance
			} catch (error) {
				console.error("Error querying balance:", error)
				throw new Error("Error fetching unbonded tokens")
			}
		},
		{
			enabled: Boolean(isWalletConnected && address),
			notifyOnChangeProps: ["data", "error"],
			onError() {
				throw new Error("Error fetching unbonded tokens")
			},
			refetchOnMount: true,
			refetchOnReconnect: true,
			refetchOnWindowFocus: true,
			retry: false,
			staleTime: 6_000
		}
	)

	return [data, isLoading] as const
}
