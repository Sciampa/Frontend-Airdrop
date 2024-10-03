/* eslint-disable no-console */
import { Flex } from "@chakra-ui/react"
import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip
} from "chart.js"
import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"

// Register required Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	LineElement,
	PointElement, // Add this line
	Title,
	Tooltip,
	Legend
)

type PriceHistoryEntry = {
	price: string
	timestamp: string
}

type PriceData = PriceHistoryEntry[]

type ChartData = {
	datasets: Array<{
		backgroundColor: string
		borderColor: string
		borderWidth: number
		data: number[]
		fill: boolean
		label: string
		pointHoverRadius: number
		pointRadius: number
	}>
	labels: string[]
}

const fetchPriceData = async (): Promise<PriceData> => {
	try {
		const response = await fetch("https://api.electronprotocol.io/priceHistory")
		if (!response.ok) {
			const errorText = await response.text()
			console.error("Failed to fetch data:", response.status, errorText)
			throw new Error("Failed to fetch data.")
		}

		return await response.json()
	} catch (error) {
		console.error("Error fetching price data:", error)
		throw error
	}
}

const formatDataForChart = (priceData: PriceData): ChartData => {
	const labels = priceData.map((entry) => new Date(entry.timestamp).toLocaleTimeString())
	const prices = priceData.map((entry) => Number.parseFloat(entry.price))

	return {
		datasets: [
			{
				backgroundColor: "#4b6cb7",
				borderColor: "#4b6cb7",
				borderWidth: 2,
				data: prices,
				fill: true,
				label: "RUA Token Price (USD)",
				pointHoverRadius: 0,
				pointRadius: 0
			}
		],
		labels
	}
}

const NeutronTokenPriceChart: React.FC = () => {
	const [chartData, setChartData] = useState<ChartData | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchAndSetData = async () => {
			try {
				const data = await fetchPriceData()
				const formattedData = formatDataForChart(data)
				setChartData(formattedData)
				// eslint-disable-next-line @typescript-eslint/no-shadow
			} catch (error) {
				setError("Failed to fetch data.")
				console.error(error)
			} finally {
				setLoading(false)
			}
		}

		void fetchAndSetData()
	}, [])

	return (
		<Flex
			_dark={{
				backdropFilter: "blur(32px)",
				background:
					"linear-gradient(137deg, rgba(143, 143, 143, 0.00) 41.48%, rgba(133, 133, 133, 0.28) 134.85%)",
				border: "1px solid rgba(224, 230, 255, 0.10)",
				color: "white",
				MozBackdropFilter: "blur(10px)",
				msBackdropFilter: "blur(32px)",
				transition: "border-color 0.3s ease",
				WebkitBackdropFilter: "blur(32px)"
			}}
			bg="rgba(255, 255, 255)"
			rounded="1.25em"
			shadow="md"
			width={{ base: "22rem", md: "25rem" }}
			height="7rem"
		>
			{loading && <p>Loading...</p>}
			{error && <p>{error}</p>}
			{chartData && (
				<Line
					data={chartData}
					options={{
						maintainAspectRatio: false,
						plugins: {
							legend: {
								labels: {
									font: {
										size: 10 // Set font size for legend labels
									}
								}
							},
							tooltip: {
								bodyFont: {
									size: 10 // Set font size for tooltip text
								},
								titleFont: {
									size: 10 // Set font size for tooltip title
								}
							}
						},
						responsive: true,
						scales: {
							x: {
								ticks: {
									font: {
										size: 8 // Set font size for x-axis labels
									}
								}
							},
							y: {
								ticks: {
									font: {
										size: 8 // Set font size for y-axis labels
									}
								}
							}
						}
					}}
				/>
			)}
		</Flex>
	)
}

export default NeutronTokenPriceChart
