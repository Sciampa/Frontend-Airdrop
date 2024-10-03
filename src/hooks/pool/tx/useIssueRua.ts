/* eslint-disable no-console */
import { WalletStatus } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { handleTxError } from "@utils/handleTxError"
import DefaultToast from "components/Toasts/DefaultToast"
import SuccessToast from "components/Toasts/SuccessToast"
import { useRef } from "react"
import { type Id, toast } from "react-toastify"

// eslint-disable-next-line unicorn/prevent-abbreviations
export const useExecuteContractMsg = () => {
	const { getSigningCosmWasmClient, address, status } = useChain(
		import.meta.env.VITE_NEUTRONNETWORK
	)

	const toastId = useRef<Id>()
	const queryClient = useQueryClient() // Add this to get access to the query client

	const contractAddress = "neutron1qkwhyqgu30uckjvqymj2asmg9t6mf73wxxhqux39f9d6t2r2hl2q7jdzne"

	const fetchAvailableSwaps = async () => {
		const client = await getSigningCosmWasmClient()
		const queryMessage = { list: {} }

		try {
			const result = await client.queryContractSmart(contractAddress, queryMessage)
			console.log("Full query result:", result) // Log the full query result

			if (!Array.isArray(result.swaps)) {
				throw new TypeError("Invalid result format. Expected an array of swaps.")
			}

			const swaps = result.swaps
			console.log("Extracted swaps:", swaps) // Log extracted swaps
			return swaps
		} catch (error) {
			console.log("Error fetching available swaps:")
			throw error
		}
	}

	const { data: availableSwaps, isLoading: isSwapsLoading } = useQuery(
		["availableSwaps"],
		fetchAvailableSwaps,
		{
			onError: (error) => {
				console.error("Error in useQuery:", error)
			},
			onSuccess: (data) => {
				console.log("Available swaps data:", data)
			},
			refetchOnWindowFocus: false
		}
	)

	return useMutation(
		["executeContractMsg"],
		async () => {
			if (status !== WalletStatus.Connected) {
				throw new Error("Please connect your wallet.")
			}

			if (isSwapsLoading) {
				console.log("Swaps are still loading...")
				throw new Error("Swaps are still loading...")
			}

			if (!availableSwaps || availableSwaps.length === 0) {
				console.log("Available swaps state:", availableSwaps)
				throw new Error("No available swaps found.")
			}

			const selectedSwapId = availableSwaps[0] // Directly use the swap ID
			console.log("Selected swap ID:", selectedSwapId)

			toastId.current = toast(
				DefaultToast({
					isPromise: true,
					toastText: "Executing contract..."
				}),
				{
					autoClose: false,
					type: "default"
				}
			)

			const client = await getSigningCosmWasmClient()
			const message = {
				finish: {
					id: selectedSwapId
				}
			}

			const funds = [
				{
					amount: "50000",
					denom: "untrn"
				}
			]

			try {
				return await client.execute(address!, contractAddress, message, "auto", undefined, funds)
			} catch (error) {
				console.error("Error executing contract:", error)
				throw error
			}
		},
		{
			onError(error) {
				console.error("Contract execution error:", error)
				handleTxError({ error, toastId })
			},
			onSuccess(data) {
				toast.update(toastId.current!, {
					autoClose: 5_000,
					progressStyle: {
						background: "rgba(2, 226, 150, 1)",
						boxShadow: "var(--chakra-shadows-md)",
						height: "0.6rem"
					},
					render: SuccessToast({ data, txType: "Contract Execution" }),
					type: "success"
				})

				// Invalidate and refetch the 'availableSwaps' query after successful contract execution
				void queryClient.invalidateQueries(["availableSwaps"])
			}
		}
	)
}
