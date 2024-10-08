import { simulateTransaction } from "../messages/simulateTransaction"
import { type MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate"
import { type SigningCosmWasmClient } from "@cosmos-kit/core/node_modules/@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient"
import { contracts } from "@electronprotocol/contracts"

export const redeemTokens = async (
	address: string,
	getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>,
	stakingAddresses: string[]
) => {
	const client = await getSigningCosmWasmClient()

	const { FuzioStakingMsgComposer } = contracts.FuzioStaking

	const redeemMessages: MsgExecuteContractEncodeObject[] = []

	for (const stakingAddress of stakingAddresses) {
		const messageComposer = new FuzioStakingMsgComposer(address, stakingAddress)
		const redeemMessage = messageComposer.redeem()

		redeemMessages.push(redeemMessage)
	}

	return simulateTransaction(await client.signAndBroadcast(address, redeemMessages, "auto"))
}
