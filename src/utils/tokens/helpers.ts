import { type Token } from "./tokens"
import { type TSwapInfo } from "@utils/swap"
import { BigNumber } from "bignumber.js"

export const convertMicroDenomToDenom = (
	value: BigNumber | number | string,
	decimals: number
): BigNumber => {
	if (decimals === 0) return BigNumber(value)
	const bnValue = BigNumber(value)
	return bnValue.dividedBy(BigNumber(10).pow(decimals))
}

export const convertDenomToMicroDenom = (
	value: BigNumber | number | string,
	decimals: number
): BigNumber => {
	if (decimals === 0) return BigNumber(value)
	const bnValue = BigNumber(value)
	return bnValue.multipliedBy(BigNumber(10).pow(decimals))
}

export const initialNeutronToken: Token = {
	chain: {
		chainId: "neutron-1",
		chainName: "neutron",
		chainPrettyName: "Neutron",
		gasPrice: {
			amount: "200000",
			denom: "untrn"
		},
		grpc: ["neutron-grpc.publicnode.com:443"],
		isEVM: false,
		localDenom: "untrn",
		rest: ["https://neutron-rest.publicnode.com"],
		rpc: ["https://neutron-rpc.publicnode.com:443"]
	},
	decimal: 6,
	denom: "untrn",
	fullName: "Neutron",
	isIBCCoin: false,
	isNativeCoin: true,
	logoHash: "L3EAsd9=00$~2gR~}ESK00,C%LJ-",
	logoURI:
		"https://raw.githubusercontent.com/Electron-Protocol/Assetlist/main/assets/logos/ntrn.png",
	symbol: "NTRN",
	tokenPrettyName: "Neutron",
	tokenPrice: ""
}

export const initialSelectToken: Token = {
	chain: {
		chainId: "",
		chainName: "",
		chainPrettyName: "Select token",
		gasPrice: {
			amount: "",
			denom: "ntrn"
		},
		grpc: [""],
		isEVM: false,
		localDenom: "",
		rest: [""],
		rpc: [""]
	},
	decimal: 6,
	denom: "untrn",
	fullName: "",
	isIBCCoin: false,
	isNativeCoin: true,
	logoHash: "L3EAsd9=00$~2gR~}ESK00,C%LJ-",
	logoURI: "",
	symbol: "",
	tokenPrettyName: "Neutron Testnet",
	tokenPrice: ""
}

export const initialUSDCToken: Token = {
	chain: {
		chainId: "neutron-1",
		chainName: "neutron",
		chainPrettyName: "Neutron",
		gasPrice: {
			amount: "200000",
			denom: "untrn"
		},
		isEVM: false,
		localDenom: "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81"
	},
	decimal: 6,
	denom: "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81",
	fullName: "USDC",
	isIBCCoin: false,
	isNativeCoin: true,
	logoHash: "LOKC*Nyl}4v,o#kBkCaz|-Z,$xIr",
	logoURI:
		"https://raw.githubusercontent.com/Electron-Protocol/Assetlist/main/assets/logos/USDC.png",
	symbol: "USDC",
	tokenPrettyName: "USDC",
	tokenPrice: ""
}

export const initialUSTTwoToken: Token = {
	chain: {
		chainId: "pion-1",
		chainName: "neutrontestnet",
		chainPrettyName: "Neutron Testnet",
		gasPrice: {
			amount: "20000",
			denom: "untrn"
		},
		isEVM: false,
		localDenom: "factory/neutron13r3st22qa04c8q0d6elg4eyc55vcyrdhgcjm9f/tUSDC"
	},
	decimal: 6,
	denom: "factory/neutron13r3st22qa04c8q0d6elg4eyc55vcyrdhgcjm9f/tUSDC",
	fullName: "USDC",
	isIBCCoin: false,
	isNativeCoin: true,
	logoHash: "LYJ17EbFZ,oMt7j]j[WU#Hju][ay",
	logoURI:
		"https://raw.githubusercontent.com/Electron-Protocol/Assetlist/main/assets/logos/tUSDC.png",
	symbol: "USDC",
	tokenPrettyName: "US Dollar",
	tokenPrice: ""
}

export const initialAtomToken: Token = {
	chain: {
		chainId: "neutron-1",
		chainName: "neutron",
		chainPrettyName: "Neutron",
		gasPrice: {
			amount: "200000",
			denom: "untrn"
		},
		isEVM: false,
		localDenom: "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
	},
	decimal: 6,
	denom: "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
	fullName: "Atom",
	isIBCCoin: false,
	isNativeCoin: true,
	logoHash: "LOKC*Nyl}4v,o#kBkCaz|-Z,$xIr",
	logoURI:
		"https://raw.githubusercontent.com/Electron-Protocol/Assetlist/main/assets/logos/ATOM.png",
	symbol: "ATOM",
	tokenPrettyName: "ATOM",
	tokenPrice: ""
}

export const initialBTCToken: Token = {
	chain: {
		chainId: "neutron-1",
		chainName: "neutron",
		chainPrettyName: "Neutron",
		gasPrice: {
			amount: "200000",
			denom: "untrn"
		},
		isEVM: false,
		localDenom: "factory/neutron13r3st22qa04c8q0d6elg4eyc55vcyrdhgcjm9f/tBTC"
	},
	decimal: 6,
	denom: "factory/neutron13r3st22qa04c8q0d6elg4eyc55vcyrdhgcjm9f/tBTC",
	fullName: "tBTC",
	isIBCCoin: false,
	isNativeCoin: true,
	logoHash: "LOKC*Nyl}4v,o#kBkCaz|-Z,$xIr",
	logoURI:
		"https://raw.githubusercontent.com/Electron-Protocol/Assetlist/main/assets/logos/BTC.png",
	symbol: "tBTC",
	tokenPrettyName: "tBTC",
	tokenPrice: ""
}

export const initialEleToken: Token = {
	chain: {
		chainId: "neutron-1",
		chainName: "neutron",
		chainPrettyName: "Neutron",
		gasPrice: {
			amount: "200000",
			denom: "untrn"
		},
		isEVM: false,
		localDenom: "factory/neutron13r3st22qa04c8q0d6elg4eyc55vcyrdhgcjm9f/ELE"
	},
	decimal: 6,
	denom: "factory/neutron13r3st22qa04c8q0d6elg4eyc55vcyrdhgcjm9f/ELE",
	fullName: "Electron",
	isIBCCoin: false,
	isNativeCoin: true,
	logoHash: "LOKC*Nyl}4v,o#kBkCaz|-Z,$xIr",
	logoURI:
		"https://raw.githubusercontent.com/Electron-Protocol/Assetlist/main/assets/logos/ele.png",
	symbol: "ELE",
	tokenPrettyName: "Electron",
	tokenPrice: ""
}

export const initialTokenSwap: TSwapInfo = {
	from: {
		amount: "0",
		token: initialAtomToken
	},
	to: {
		amount: "0",
		token: initialNeutronToken
	}
}
