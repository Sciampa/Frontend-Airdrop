/* eslint-disable no-console */
// hooks/useRpcStatus.ts
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from "axios"
import { useEffect, useState } from "react"

const useRpcStatus = (rpcUrl: string, interval = 60_000): boolean => {
	const [isOnline, setIsOnline] = useState(false)

	useEffect(() => {
		const checkRpcStatus = async () => {
			try {
				console.log(`Checking RPC status at: ${rpcUrl}`)

				const response = await axios.get<boolean>(`${rpcUrl}/RpcStatus`)
				console.log(`RPC response status: ${response.status}`)

				setIsOnline(response.data) // Directly set boolean value
			} catch (error) {
				console.error(`RPC check failed: ${error}`)
				setIsOnline(false)
			}
		}

		// Call the function immediately
		void checkRpcStatus()

		// Set up the interval to call the function
		const intervalId = setInterval(() => {
			// eslint-disable-next-line promise/prefer-await-to-then
			checkRpcStatus().catch((error) => console.error(`RPC check failed: ${error}`))
		}, interval)

		// Clear interval on component unmount
		return () => clearInterval(intervalId)
	}, [rpcUrl, interval])

	return isOnline
}

export default useRpcStatus
