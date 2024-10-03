/* eslint-disable react/prop-types */
/* eslint-disable typescript-sort-keys/interface */
// components/PoolTags.tsx
import { HStack } from "@chakra-ui/react"
import { ExternalTag } from "components/Assets/earn/ExternalTag"
import { ParticlesTag } from "components/Assets/earn/ParticlesTag"
import { VerifiedTag } from "components/Assets/earn/VerifiedTag"

type PoolTagsProps = {
	isVerified: boolean
	isParticles: boolean
	isExternal: boolean
}

export const PoolTags: React.FC<PoolTagsProps> = ({ isVerified, isParticles, isExternal }) => {
	return (
		<HStack>
			{isVerified && (
				<VerifiedTag
					mt="0.4rem"
					h={{ base: "0.8rem", md: "0.9rem" }}
					w={{ base: "2rem", md: "2.5rem" }}
				/>
			)}
			{isParticles && (
				<ParticlesTag
					mt="0.4rem"
					h={{ base: "0.8rem", md: "0.9rem" }}
					w={{ base: "2rem", md: "2.5rem" }}
				/>
			)}
			{isExternal && (
				<ExternalTag
					mt="0.4rem"
					h={{ base: "0.8rem", md: "0.9rem" }}
					w={{ base: "2rem", md: "2.5rem" }}
				/>
			)}
		</HStack>
	)
}
