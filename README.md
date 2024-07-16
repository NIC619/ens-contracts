# ENS Offchain Resolver Contracts

This repo contains Solidity contracts you can customise and deploy to provide offchain resolution of ENS names.

These contracts implement [ENSIP 10](https://docs.ens.domains/ens-improvement-proposals/ensip-10-wildcard-resolution) (wildcard resolution support) and [EIP 3668](https://eips.ethereum.org/EIPS/eip-3668) (CCIP Read). Together this means that the resolver contract can be very straightforward; it simply needs to respond to all resolution requests with a redirect to your gateway, and verify gateway responses by checking the signature on the returned message.

These contracts can also be used as a starting point for other verification methods, such as allowing the owner of the name to sign the records themselves, or relying on another verification mechanism such as a merkle tree or an L2 such as Optimism. To do so, start by replacing the calls to `SignatureVerifier` in `OffchainResolver` with your own solution.

## Contracts

### [IExtendedResolver.sol](contracts/IExtendedResolver.sol)

This is the interface for wildcard resolution specified in ENSIP 10. In time this will likely be moved to the [@ensdomains/ens-contracts](https://github.com/ensdomains/ens-contracts) repository.

### [SignatureVerifier.sol](contracts/SignatureVerifier.sol)

This library facilitates checking signatures over CCIP read responses.

### [OffchainResolver.sol](contracts/OffchainResolver.sol)

This contract implements the offchain resolution system. Set this contract as the resolver for a name, and that name and all its subdomains that are not present in the ENS registry will be resolved via the provided gateway by supported clients.

### Deployment Info

#### ENSRegistry on Sepolia

-   Address: [0xCDfb8dFa83152340e06f5CCcc39F214A621F44a6](https://sepolia.etherscan.io/address/0xCDfb8dFa83152340e06f5CCcc39F214A621F44a6)
-   This registry has `eth` and `token.eth` domain name registered by owner `0xE3c19B6865f2602f30537309e7f8D011eF99C1E0` and has `OffchainResolver` contract address `0x617C1adf9f92fbE7074539d866047793F5b25eA5` set as resolver for `token.eth` domain.

#### OffchainResolver on Sepolia

-   Address: [0x617C1adf9f92fbE7074539d866047793F5b25eA5](https://sepolia.etherscan.io/address/0x617C1adf9f92fbE7074539d866047793F5b25eA5)
-   This contract is set as resolver for `token.eth` domain in `ENSRegistry` contract.
-   Owner and signer are both `0xE3c19B6865f2602f30537309e7f8D011eF99C1E0`.

### If you want to deploy your own ENSRegistry or OffchainResolver contracts

Provide `DEPLOYER_PRIVATE_KEY`, `ALCHEMY_TOKEN` and `ETHERSCAN_API_KEY` in `.env` file.

#### Setup environment

Run the following command:

```bash
yarn install
yarn build
```

#### Deploy ENSRegistry contract on Sepolia

If you want to deploy a new ENSRegistry contract, you need to provide addional info in `.env` file:

-   `ENS_REGISTRY_OWNER_PRIVATE_KEY` - Owner of the ENSRegistry contract.

Next, run the following command:

```bash
npx hardhat run ./scripts/deploy/ENSRegistry.ts --network sepolia
```

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

#### Deploy OffchainResolver contract on Sepolia

If you want to deploy a new OffchainResolver contract, you need to set the `Signer` address in [deployments/sepolia/AddressRecord.json](deployments/sepolia/AddressRecord.json) file. The signer will be the signer registered in the resolver contract.

Additionally, you can provide `GATEWAY_SERVER_URL` info in `.env` file which is the url to your gateway server for CCIP Read. If not provided, a default gateway url `http://localhost:8080` will be used.

```bash
npx hardhat run ./scripts/deploy/OffchainResolver.ts --network sepolia
```

-   Example output:

```
Deploying OffchainResolver contract...
✔ Expected new contract address : 0x617C1adf9f92fbE7074539d866047793F5b25eA5, is this correct? … yes
OffchainResolver contract address: 0x617C1adf9f92fbE7074539d866047793F5b25eA5

✔ Verify contract on etherscan
cmd : npx hardhat verify --network sepolia --contract contracts/OffchainResolver.sol:OffchainResolver 0x617C1adf9f92fbE7074539d866047793F5b25eA5 --constructor-args ./scripts/deploy/OffchainResolverVerifyArguments.ts ? … yes
Nothing to compile

Successfully submitted source code for contract
contracts/OffchainResolver.sol:OffchainResolver at 0x617C1adf9f92fbE7074539d866047793F5b25eA5
for verification on the block explorer. Waiting for verification result...

Successfully verified contract OffchainResolver on Etherscan.
https://sepolia.etherscan.io/address/0x617C1adf9f92fbE7074539d866047793F5b25eA5#code
```

#### Set owner for Top Level Domain `eth`

Setting domain owner requires `ENS_REGISTRY_OWNER_PRIVATE_KEY=` and `ENS_DOMAIN_OWNER_PRIVATE_KEY=` provided in `.env` file.

```bash
npx hardhat run ./scripts/operating/OffchainResolver/SetTLDOwner.ts --network sepolia
```

-   Example output:

```
ENSRegistry contract on etherscan: https://sepolia.etherscan.io/address/0xCDfb8dFa83152340e06f5CCcc39F214A621F44a6
OffchainResolver contract on etherscan: https://sepolia.etherscan.io/address/0x617C1adf9f92fbE7074539d866047793F5b25eA5
Set ethdomain "eth" owner, TX: https://sepolia.etherscan.io/tx/0x3f093c0bd1c6b616c46c72032025af64080dcd193c85e615446e84d9eacee52d
```

#### Set owner and resolver for Second Level Domain like `token.eth`

Setting domain owner and resolver requires `ENS_REGISTRY_OWNER_PRIVATE_KEY=` and `ENS_DOMAIN_OWNER_PRIVATE_KEY=` provided in `.env` file.

```bash
npx hardhat run ./scripts/operating/OffchainResolver/SetSLDOwnerAndResolver.ts --network sepolia
```

-   Example output:

```
ENSRegistry contract on etherscan: https://sepolia.etherscan.io/address/0xCDfb8dFa83152340e06f5CCcc39F214A621F44a6
OffchainResolver contract on etherscan: https://sepolia.etherscan.io/address/0x617C1adf9f92fbE7074539d866047793F5b25eA5
Enter the second level domain label (SLD), e.g., "token" in "token.eth" … test
✔ You want to set owner and resolver for domain name "test.eth", is this correct? … yes
Set SLD "test" owner, TX: https://sepolia.etherscan.io/tx/0xff0d9520bdecde1ce3689dc5b6f2c9ec76ff42c2126379a37f9dd5829fa3a3d1
Set domain "test.eth" resolver contract, TX: https://sepolia.etherscan.io/tx/0x45ab9f9d5284ae6b4d6b48454df90b298f7db8e44989c9f83d2128168043a186
```

#### Query the resolver of the `token.eth` domain

```bash
% npx hardhat run ./scripts/operating/OffchainResolver/GetResolver.ts --network sepolia
```

-   Example output:

```
ENSRegistry contract on etherscan: https://sepolia.etherscan.io/address/0xCDfb8dFa83152340e06f5CCcc39F214A621F44a6

Get ethdomain "eth" owner: 0xE3c19B6865f2602f30537309e7f8D011eF99C1E0

Get maindomain "token" owner: 0xE3c19B6865f2602f30537309e7f8D011eF99C1E0

Get fulldomain "token.eth" resolver contract: 0x617C1adf9f92fbE7074539d866047793F5b25eA5
```
