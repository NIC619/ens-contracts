# ENS Offchain Resolver Contracts

This package contains Solidity contracts you can customise and deploy to provide offchain resolution of ENS names.

These contracts implement [ENSIP 10](https://docs.ens.domains/ens-improvement-proposals/ensip-10-wildcard-resolution) (wildcard resolution support) and [EIP 3668](https://eips.ethereum.org/EIPS/eip-3668) (CCIP Read). Together this means that the resolver contract can be very straightforward; it simply needs to respond to all resolution requests with a redirect to your gateway, and verify gateway responses by checking the signature on the returned message.

These contracts can also be used as a starting point for other verification methods, such as allowing the owner of the name to sign the records themselves, or relying on another verification mechanism such as a merkle tree or an L2 such as Optimism. To do so, start by replacing the calls to `SignatureVerifier` in `OffchainResolver` with your own solution.

## Contracts

### [IExtendedResolver.sol](contracts/IExtendedResolver.sol)

This is the interface for wildcard resolution specified in ENSIP 10. In time this will likely be moved to the [@ensdomains/ens-contracts](https://github.com/ensdomains/ens-contracts) repository.

### [SignatureVerifier.sol](contracts/SignatureVerifier.sol)

This library facilitates checking signatures over CCIP read responses.

### [OffchainResolver.sol](contracts/OffchainResolver.sol)

This contract implements the offchain resolution system. Set this contract as the resolver for a name, and that name and all its subdomains that are not present in the ENS registry will be resolved via the provided gateway by supported clients.

### Quick start

Please export the environment variables first if you haven't: go back to root directory and run `yarn export-env`

#### Setup environment

If you haven't run `yarn install` in root directory:

```bash
yarn install && yarn build
```

#### Deploy ENSRegistry contract to Sepolia Testnet

If you want to deploy a new ENSRegistry contract:

```bash
cd ./packages/contracts
npx hardhat run ./scripts/deploy/ENSRegistry.ts --network sepolia
```

**Requirement**: Provide **ENSRegistry** owner's private key in `.env` file first: `ENS_REGISTRY_OWNER_PRIVATE_KEY=`

-   Example output:

```
Deploying ENSRegistry contract...
✔ Expected new contract address : 0xCDfb8dFa83152340e06f5CCcc39F214A621F44a6, is this correct? … yes
ENSRegistry contract address: 0xCDfb8dFa83152340e06f5CCcc39F214A621F44a6

✔ Verify contract on etherscan
cmd : npx hardhat verify --network sepolia --contract contracts/ENSRegistry.sol:ENSRegistry 0xCDfb8dFa83152340e06f5CCcc39F214A621F44a6 ? … yes
Nothing to compile

Successfully submitted source code for contract
contracts/ENSRegistry.sol:ENSRegistry at 0xCDfb8dFa83152340e06f5CCcc39F214A621F44a6
for verification on the block explorer. Waiting for verification result...

Successfully verified contract ENSRegistry on Etherscan.
https://sepolia.etherscan.io/address/0xCDfb8dFa83152340e06f5CCcc39F214A621F44a6#code
```

#### Deploy OffchainResolver contract to Sepolia Testnet

If you want to deploy a new OffchainResolver contract:

```bash
npx hardhat run ./scripts/deploy/OffchainResolver.ts --network sepolia
```

**Requirement**: Provide **deployer**'s private key in `.env` file first: `DEPLOYER_PRIVATE_KEY=`.
**Requirement**: Update `gatewayurl` param in `hardhat.config.ts` if you have your own gateway served somewhere else. Otherwise default `gatewayurl` will be used.

-   Example output:

```
Deploying OffchainResolver contract...
✔ Expected new contract address : 0xA4C7bfBAe5b4Ac783f04030657ECF5ac378E85a9, is this correct? … yes
OffchainResolver contract address: 0xA4C7bfBAe5b4Ac783f04030657ECF5ac378E85a9

✔ Verify contract on etherscan
cmd : npx hardhat verify --network sepolia --contract contracts/OffchainResolver.sol:OffchainResolver 0xA4C7bfBAe5b4Ac783f04030657ECF5ac378E85a9 --constructor-args ./scripts/deploy/OffchainResolverVerifyArguments.ts ? … yes
Nothing to compile

Successfully submitted source code for contract
contracts/OffchainResolver.sol:OffchainResolver at 0xA4C7bfBAe5b4Ac783f04030657ECF5ac378E85a9
for verification on the block explorer. Waiting for verification result...

Successfully verified contract OffchainResolver on Etherscan.
https://sepolia.etherscan.io/address/0xA4C7bfBAe5b4Ac783f04030657ECF5ac378E85a9#code
```

#### Set ENSRegistry contract `token.eth` maindomain, and corresponding OffchainResolver contract address

```bash
npx hardhat run ./scripts/operating/OffchainResolver/SetResolver.ts --network sepolia
```

**Requirement**: Provide **ENSRegistry** owner's private key in `.env` file first: `ENS_REGISTRY_OWNER_PRIVATE_KEY=`
**Requirement**: Provide **domain owner**'s private key in `.env` file first: `ENS_DOMAIN_OWNER_PRIVATE_KEY=`

-   Example output:

```
ENSRegistry contract on etherscan: https://sepolia.etherscan.io/address/0xCDfb8dFa83152340e06f5CCcc39F214A621F44a6

OffchainResolver contract on etherscan: https://sepolia.etherscan.io/address/0xA4C7bfBAe5b4Ac783f04030657ECF5ac378E85a9

Set ethdomain "eth" owner, TX: https://sepolia.etherscan.io/tx/0x3f093c0bd1c6b616c46c72032025af64080dcd193c85e615446e84d9eacee52d

Set maindomain "token" owner, TX: https://sepolia.etherscan.io/tx/0x980097bcd976d39ea30cc928e8753d4d74a349f7db5a04c16711096f02b94e9a

Set fulldomain "token.eth" resolver contract, TX: https://sepolia.etherscan.io/tx/0xc112ad0ed9497c8f6ee1cf7c966534f16e717d351285cce218f624b97fc5d352
```

#### Get ENSRegistry contract `token.eth` maindomain, and corresponding OffchainResolver contract address

```bash
% npx hardhat run ./scripts/operating/OffchainResolver/GetResolver.ts --network sepolia
```

-   Example output:

```
ENSRegistry contract on etherscan: https://sepolia.etherscan.io/address/0xCDfb8dFa83152340e06f5CCcc39F214A621F44a6

Get ethdomain "eth" owner: 0xE3c19B6865f2602f30537309e7f8D011eF99C1E0

Get maindomain "token" owner: 0xE3c19B6865f2602f30537309e7f8D011eF99C1E0

Get fulldomain "token.eth" resolver contract: 0xA4C7bfBAe5b4Ac783f04030657ECF5ac378E85a9
```
