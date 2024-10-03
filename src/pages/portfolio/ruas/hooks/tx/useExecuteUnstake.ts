/* eslint-disable no-console */
import { WalletStatus } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleTxError } from "@utils/handleTxError"
import DefaultToast from "components/Toasts/DefaultToast"
import SuccessToast from "components/Toasts/SuccessToast"
import { useRef } from "react"
import { type Id, toast } from "react-toastify"

type ExecuteUnstakeParameters = {
	collection: {
		stakingContract: {
			address: string
		}
	}
	tokenIds: string[]
}

export const useExecuteUnstake = (collection: {
	stakingContract: { address: string } // Removed msg
}) => {
	const { getSigningCosmWasmClient, address, status } = useChain(
		import.meta.env.VITE_NEUTRONNETWORK
	)
	const toastId = useRef<Id>()
	const queryClient = useQueryClient()
	const stakingAddress = collection.stakingContract.address

	return useMutation(
		async ({ tokenIds }: ExecuteUnstakeParameters) => {
			if (status !== WalletStatus.Connected) {
				throw new Error("Please connect your wallet.")
			}

			const client = await getSigningCosmWasmClient()
			console.log("Client:", client)

			// Defensive checks
			if (!address || !stakingAddress) {
				throw new Error("Invalid address or staking contract address.")
			}

			if (!tokenIds || tokenIds.length === 0) {
				throw new Error("No token IDs provided.")
			}

			// Construct the unstake message
			const message = {
				unstake: {
					token_ids: tokenIds // Pass the array of token IDs
				}
			}
			console.log("Constructed message:", message)

			toastId.current = toast(
				DefaultToast({ isPromise: true, toastText: "Executing contract..." }),
				{
					autoClose: false,
					type: "default"
				}
			)

			try {
				const response = await client.execute(address!, stakingAddress, message, "auto", undefined)
				console.log("Transaction response:", response)
				return response
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
					progressStyle: { background: "rgba(2, 226, 150, 1)", height: "0.6rem" },
					render: SuccessToast({ data, txType: "Contract Execution" }),
					type: "success"
				})
				void queryClient.invalidateQueries(["availableStakes", stakingAddress]) // Invalidate queries as needed
			}
		}
	)
}

export default useExecuteUnstake
