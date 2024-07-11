import "dotenv/config"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle"
import "tsconfig-paths/register"

const accounts = {
    mnemonic: process.env.MNEMONIC || "test test test test test test test test test test test junk",
}
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const ALCHEMY_TOKEN = process.env.ALCHEMY_TOKEN || ""

const gatewayServerURL = process.env.GATEWAY_SERVER_URL || "http://localhost:8080"
const gatewayURL = `${gatewayServerURL}/{sender}/{data}.json` || ""

module.exports = {
    solidity: "0.8.10",
    networks: {
        hardhat: {
            chainId: 1,
            forking: {
                url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_TOKEN}`,
                blockNumber: 14340000,
            },
            gatewayurl: gatewayURL,
        },
        sepolia: {
            url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_TOKEN}`,
            tags: ["test", "demo"],
            chainId: 11155111,
            accounts,
            gatewayurl: gatewayURL,
        },
        mainnet: {
            url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_TOKEN}`,
            tags: ["demo"],
            chainId: 1,
            accounts,
            gatewayurl: gatewayURL,
        },
    },
    etherscan: {
        apiKey: `${ETHERSCAN_API_KEY}`,
    },
}
