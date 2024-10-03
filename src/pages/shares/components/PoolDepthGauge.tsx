import React, { useEffect } from "react"
// eslint-disable-next-line import/no-named-as-default
import GaugeComponent from "react-gauge-component"

type PoolDepthGaugeProps = {
	onValueChange: (value: number) => void
}

const PoolDepthGauge: React.FC<PoolDepthGaugeProps> = ({ onValueChange }) => {
	const currentValue = 20

	useEffect(() => {
		onValueChange(currentValue)
	}, [currentValue, onValueChange])

	return (
		<GaugeComponent
			type="semicircle"
			value={currentValue}
			minValue={0}
			maxValue={100}
			style={{ height: 85, marginBottom: "-3rem", marginTop: "-0.7rem", width: 85 }}
			arc={{
				cornerRadius: 0,
				padding: 0.01,
				subArcs: [
					{ color: "#FF0000", limit: 10, showTick: true },
					{ color: "#FF6600", limit: 20, showTick: true },
					{ color: "#FF9900", limit: 30, showTick: true },
					{ color: "#FFCC00", limit: 40, showTick: true },
					{ color: "#FFFF00", limit: 50, showTick: true },
					{ color: "#CCFF00", limit: 60, showTick: true },
					{ color: "#99FF00", limit: 70, showTick: true },
					{ color: "#66FF00", limit: 80, showTick: true },
					{ color: "#33FF00", limit: 90, showTick: true },
					{ color: "#00FF00", limit: 100, showTick: true }
				]
			}}
			pointer={{
				animate: true,
				animationDuration: 3_000,
				length: 0.6,
				type: "needle",
				width: 12
			}}
			marginInPercent={{ bottom: 0.05, left: 0.05, right: 0.05, top: 0.05 }}
			labels={{
				tickLabels: {
					defaultTickLineConfig: {
						color: "#464A4F",
						distanceFromArc: 0,
						length: 1,
						width: 1
					},
					defaultTickValueConfig: {
						hide: true
					},
					hideMinMax: true,
					type: "outer"
				},
				valueLabel: {
					formatTextValue: (value) => `${value}K`,
					matchColorWithArc: true,
					style: { fontSize: "0.001em" } // Adjusted font size for larger gauge
				}
			}}
		/>
	)
}

export default PoolDepthGauge
