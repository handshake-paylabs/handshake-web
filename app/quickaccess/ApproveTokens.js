import { createPublicClient, http, pubKeyToAddress } from "viem";
import erc20Abi from "./ERC20ABI.json";
import { createWalletClient, custom } from "viem";

const publicClient = createPublicClient({
  chain: {
    id: 1029, // BTTC Donau testnet chain ID
    rpcUrls: {
      public: "https://pre-rpc.bittorrentchain.io/", // BTTC Donau testnet RPC URL
    },
  },
  transport: http("https://pre-rpc.bittorrentchain.io/"), // Passing RPC URL to http function
});

const walletClient = createWalletClient({
  chain: {
    id: 1029, // BTTC Donau testnet chain ID
    rpcUrls: {
      public: "https://pre-rpc.bittorrentchain.io/",
      websocket: "https://pre-rpc.bittorrentchain.io/", // WebSocket URL (optional)
    },
  },
  transport: custom(window.ethereum),
});
export const approveToken = async (amount, tokenContractAddress, address) => {
  const { request } = await publicClient.simulateContract({
    account: address,
    address: tokenContractAddress,
    abi: erc20Abi.abi,
    functionName: "approve",
    args: ["0x0856Ab13d8BFC644c1096554Bd23779dc42e4cDE", amount],
  });
  const execute = await walletClient.writeContract(request);
};
