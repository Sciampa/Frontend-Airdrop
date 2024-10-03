import { simulateTransaction } from "../messages/simulateTransaction"
import { type MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate"
import { type SigningCosmWasmClient } from "@cosmos-kit/core/node_modules/@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient"
import { contracts } from "@electronprotocol/contracts"
import { type TPool } from "utils/tokens/pools"

export const claimRewards = async (
	address: string,
	getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>,
	pool: TPool
) => {
	const client = await getSigningCosmWasmClient()
	const { bondingPeriods } = pool

	const { FuzioStakingMsgComposer } = contracts.FuzioStaking

	const transactions: MsgExecuteContractEncodeObject[] = []

	for (const bondingPeriod of bondingPeriods) {
		const messageComposer = new FuzioStakingMsgComposer(address, bondingPeriod.address)

		const stakerInfo = await client.queryContractSmart(bondingPeriod.address, {
			staker_info: {
				staker: address
			}
		})

		const claimMessage = messageComposer.withdraw()

		if (stakerInfo.pending_reward > 0) transactions.push(claimMessage)
	}

	return simulateTransaction(await client.signAndBroadcast(address, transactions, "auto"))

	// return await client.execute(
	//   address,
	//   stakingAddress,
	//   testMessage,
	//   "auto",
	//   undefined,
	//   []
	// )
}
