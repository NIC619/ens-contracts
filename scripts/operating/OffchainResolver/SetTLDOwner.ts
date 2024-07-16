import { BigNumber, Overrides, providers } from "ethers"
import { ethers, network } from "hardhat"
import * as utils from "~/scripts/utils"

// This script is used to set owner for Top Level Domain "eth"
async function main() {
    const domainOwner = await utils.getDomainOwner()
    const domainOwnerAddress = await domainOwner.getAddress()
    const ensRegistryOwner = await utils.getENSRegistryOwner()

    // Set contract instance
    const ENSRegiJson = await utils.getENSRegiJson()
    const ensRegiContract = await ethers.getContractAt(ENSRegiJson.abi, ENSRegiJson.address)
    const etherscanURL = `https://${
        network.name === "mainnet" ? "" : network.name + "."
    }etherscan.io`
    console.log(
        `ENSRegistry contract on etherscan: ${etherscanURL}/address/${ensRegiContract.address}`,
    )

    // Set TX overrides extra argument
    const overrides: Overrides = {
        gasLimit: BigNumber.from(1000000),
        maxFeePerGas: (await ethers.provider.getFeeData()).maxFeePerGas!,
        maxPriorityFeePerGas: (await ethers.provider.getFeeData()).maxPriorityFeePerGas!,
    }

    const defaultNameHash = "0x" + "00".repeat(32)
    const labelTLD = "eth" // Label of top level domain (TLD)

    let tx: providers.TransactionResponse
    let txReceipt: providers.TransactionReceipt

    // Set ethdomain manager to Owner by Deployer
    tx = await ensRegiContract.connect(ensRegistryOwner).setSubnodeOwner(
        defaultNameHash,
        ethers.utils.id(labelTLD), // Node hash of TLD label
        domainOwnerAddress,
        overrides,
    )
    txReceipt = await tx.wait() // Wait for transaction to confirm that block has been mined
    console.log(
        `Set TLD \"${labelTLD}\" owner, TX: ${etherscanURL}/tx/${txReceipt.transactionHash}`,
    )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
