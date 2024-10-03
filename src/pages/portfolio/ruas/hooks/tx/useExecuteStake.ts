/* eslint-disable no-console */
import { WalletStatus } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleTxError } from "@utils/handleTxError"
import DefaultToast from "components/Toasts/DefaultToast"
import SuccessToast from "components/Toasts/SuccessToast"
import { useRef } from "react"
import { type Id, toast } from "react-toastify"

type ExecuteStakeParameters = {
	collection: {
		stakingContract: {
			address: string
			msg: string
		}
	}
	msg: string
	nftContract: string
	tokenId: string
}

export const useExecuteStake = ({
	collection
}: {
	collection: { stakingContract: { address: string; msg: string } }
}) => {
	const { getSigningCosmWasmClient, address, status } = useChain(
		import.meta.env.VITE_NEUTRONNETWORK
	)
	const toastId = useRef<Id>()
	const queryClient = useQueryClient()
	const stakingAddress = collection.stakingContract.address
	const stakingMessage = collection.stakingContract.msg

	return useMutation(
		async ({ nftContract, tokenId }: ExecuteStakeParameters) => {
			if (status !== WalletStatus.Connected) {
				throw new Error("Please connect your wallet.")
			}

			const client = await getSigningCosmWasmClient()

			try {
				const nftDetails = await client.queryContractSmart(nftContract, {
					nft_info: { token_id: tokenId }
				})

				console.log("NFT Details:", nftDetails)
			} catch (error) {
				console.error("Error retrieving NFT details:", error)
				throw new Error("Could not retrieve NFT details.")
			}

			toastId.current = toast(
				DefaultToast({ isPromise: true, toastText: "Executing contract..." }),
				{
					autoClose: false,
					type: "default"
				}
			)

			const message = {
				send_nft: {
					contract: stakingAddress,
					msg: stakingMessage,
					token_id: tokenId
				}
			}

			try {
				const response = await client.execute(address!, nftContract, message, "auto", undefined)
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
				void queryClient.invalidateQueries(["availableStakes", stakingAddress])
			}
		}
	)
}

export default useExecuteStake
