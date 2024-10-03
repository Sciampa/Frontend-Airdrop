// components/Socials.tsx
import { HStack, Icon } from "@chakra-ui/react"
import React from "react"
import { FaGlobe, FaMedium, FaTelegramPlane, FaTwitter } from "react-icons/fa"

type SocialsProps = {
	socials: {
		medium?: string
		telegram?: string
		twitter?: string
		website?: string
	}
}

const Socials: React.FC<SocialsProps> = ({ socials }) => (
	<HStack spacing={3} mb="-0.9rem">
		{socials.twitter && (
			<a href={socials.twitter} target="_blank" rel="noopener noreferrer">
				<Icon as={FaTwitter} w={5} h={5} color="blue.400" />
			</a>
		)}
		{socials.telegram && (
			<a href={socials.telegram} target="_blank" rel="noopener noreferrer">
				<Icon as={FaTelegramPlane} w={5} h={5} color="blue.400" />
			</a>
		)}
		{socials.medium && (
			<a href={socials.medium} target="_blank" rel="noopener noreferrer">
				<Icon as={FaMedium} w={5} h={5} color="blue.400" />
			</a>
		)}
		{socials.website && (
			<a href={socials.website} target="_blank" rel="noopener noreferrer">
				<Icon as={FaGlobe} w={5} h={5} color="blue.400" />
			</a>
		)}
	</HStack>
)

export default Socials
