import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";

// 1. Get projectId
const projectId = "86ca01c30a737efcc2113f60037fee6e";

// 2. Set chains
// const BSC = {
//     chainId: 56,
//     name: "BNB Smart Chain",
//     currency: "BNB",
//     explorerUrl: "https://polygonscan.com/",
//     rpcUrl: "https://polygon-rpc.com/",
// };

const BSCTestnet = {
    chainId: 97,
    name: "BNB Smart Chain",
    currency: "BNB",
    explorerUrl: "https://testnet.bscscan.com/",
    rpcUrl: "https://api.zan.top/node/v1/bsc/testnet/public",
};

// 3. Create modal
const metadata = {
    name: "My Website",
    description: "My Website description",
    url: "https://mywebsite.com", // origin must match your domain & subdomain
    icons: ["https://avatars.mywebsite.com/"],
};

createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains: [BSCTestnet],
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export function Web3ModalProvider({ children }) {
    return children;
}
