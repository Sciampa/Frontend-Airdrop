/* eslint-disable react/prop-types */
// components/PoolIcons.tsx
import { ExternalIcon } from "components/Assets/earn/ExternalIcon"
import { ParticlesIcon } from "components/Assets/earn/ParticlesIcon"
import { VerifiedIcon } from "components/Assets/earn/VerifiedIcon"

type PoolIconsProps = {
	isExternal: boolean
	isParticles: boolean
	isVerified: boolean
}

export const PoolIcons: React.FC<PoolIconsProps> = ({ isVerified, isParticles, isExternal }) => {
	return (
		<>
			{isVerified && (
				<VerifiedIcon
					color="#00E296"
					h={{ base: "1rem", md: "1.5rem" }}
					w={{ base: "1rem", md: "1.5rem" }}
				/>
			)}
			{isParticles && (
				<ParticlesIcon
					ml="0.05rem"
					color="#00E296"
					h={{ base: "0.75rem", md: "1.1rem" }}
					w={{ base: "0.75rem", md: "1.1rem" }}
				/>
			)}
			{isExternal && (
				<ExternalIcon
					color="#00E296"
					h={{ base: "0.8rem", md: "1.2rem" }}
					mt={{ base: "0.02rem", md: "0rem" }}
					w={{ base: "0.8rem", md: "1.2rem" }}
					ml={isVerified && !isParticles ? "0rem" : "0.2rem"}
				/>
			)}
		</>
	)
}
