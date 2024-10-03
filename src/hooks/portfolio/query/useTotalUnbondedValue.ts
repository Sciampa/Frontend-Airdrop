/* eslint-disable no-console */
import { useChain } from "@cosmos-kit/react"
import { usePoolList } from "@hooks/pool/query/usePoolList"
import { useMultipleTokenBalance } from "@hooks/tokens/query/useTokenBalance"
import { useQuery } from "@tanstack/react-query"
import { type Token } from "@utils/tokens/tokens"
import { BigNumber } from "bignumber.js"
import {
	convertMicroDenomToDenom,
	initialNeutronToken,
	initialUSDCToken
} from "utils/tokens/helpers"

export const useTotalUnbondedValue = ({ tokenList }: { tokenList: Token[] }) => {
	const { isWalletConnected, address, getCosmWasmClient } = useChain(
		import.meta.env.VITE_NEUTRONNETWORK
	)

	const [poolsList] = usePoolList()
	const [tokenListWithBalances] = useMultipleTokenBalance(tokenList)

	const { data = 0, isLoading } = useQuery<number>(
		[`@fuzio/portfolio/${address}/totalUnbondedValue`],
		async () => {
			const client = await getCosmWasmClient()
			let totalUnbondedDollarValue = 0

			console.log("Client:", client) // Log the client to ensure it's initialized correctly

			const ElectronUsdcPool = poolsList?.poolsWithAPR.find(
				(liquidity) =>
					liquidity.pool.liquidity.token1.denom === initialNeutronToken.denom &&
					liquidity.pool.liquidity.token2.denom === initialUSDCToken.denom
			)
			console.log("ElectronUsdcPool:", ElectronUsdcPool) // Log ElectronUsdcPool to see if it's correctly populated
			const ratio = ElectronUsdcPool?.pool.ratio ?? BigNumber(0)
			const ElectronPrice = BigNumber(ratio)

			console.log("ElectronPrice:", ElectronPrice) // Log ElectronPrice to check its value

			// eslint-disable-next-line no-unsafe-optional-chaining
			for (const [, pool] of poolsList?.poolsWithAPR.entries()!) {
				console.log("Pool:", pool) // Log each pool to see if they are correctly populated
				const { lpTokenAddress } = pool.pool
				const lpUsd = BigNumber(pool.pool.liquidity.usd)
				const lpTokenPrice = lpUsd.dividedBy(pool.pool.lpTokens)

				console.log("lpTokenPrice:", lpTokenPrice) // Log lpTokenPrice to see its value

				try {
					const balanceQuery: { balance: string } = await client.queryContractSmart(
						lpTokenAddress,
						{
							balance: { address }
						}
					)

					console.log("BalanceQuery:", balanceQuery) // Log balanceQuery to see its value

					if (balanceQuery?.balance) {
						totalUnbondedDollarValue += convertMicroDenomToDenom(
							BigNumber(balanceQuery.balance).times(lpTokenPrice),
							6
						).toNumber()
					} else {
						console.error("Invalid balance data:", balanceQuery)
					}
				} catch (error) {
					console.error("Error querying balance:", error)
				}
			}

			// eslint-disable-next-line no-unsafe-optional-chaining
			for (const [, tokenWithBalance] of tokenListWithBalances?.entries()!) {
				console.log("TokenWithBalance:", tokenWithBalance) // Log tokenWithBalance to see its value
				const { balance, denom, decimal } = tokenWithBalance
				let tokenPrice = BigNumber(0)

				const pool = poolsList?.poolsWithAPR.find(
					(liquidity) =>
						liquidity.pool.liquidity.token1.denom === initialNeutronToken.denom &&
						liquidity.pool.liquidity.token2.denom === denom
				)

				console.log("Pool:", pool) // Log the pool to see its value

				// eslint-disable-next-line no-negated-condition
				if (denom !== initialNeutronToken.denom) {
					const currentRatio = pool?.pool.ratio ?? 0
					tokenPrice = currentRatio
						? BigNumber(ElectronPrice.dividedBy(currentRatio))
						: BigNumber(0)
				} else {
					tokenPrice = BigNumber(ElectronPrice)
				}

				console.log("TokenPrice:", tokenPrice) // Log tokenPrice to see its value

				totalUnbondedDollarValue += convertMicroDenomToDenom(
					balance.times(tokenPrice),
					decimal
				).toNumber()
			}

			console.log("TotalUnbondedDollarValue:", totalUnbondedDollarValue) // Log the final totalUnbondedDollarValue

			return totalUnbondedDollarValue
		},
		{
			enabled: Boolean(
				poolsList &&
					poolsList.poolsWithAPR.length > 0 &&
					tokenListWithBalances &&
					tokenListWithBalances.length > 0 &&
					isWalletConnected
			),
			notifyOnChangeProps: ["data", "error"],
			onError(error) {
				console.error("Error calculating total unbonded value:", error) // Log the error message
				throw new Error("Error calculating total unbonded value")
			},
			refetchInterval: 6_000,
			refetchOnMount: true,
			refetchOnReconnect: true,
			refetchOnWindowFocus: true,
			retry: false
		}
	)

	return [data, isLoading] as const
}
