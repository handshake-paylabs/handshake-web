"use client";

import Header from "@/app/components/header/Header";
import { useEffect, useState } from "react";
import { createWalletClient, custom } from "viem";
import { useAccount } from "wagmi";

export default function TransactionRequestDetails({ params }) {
  const [transactions, setTransaction] = useState([]);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const fetchTransactions = async () => {
      const url =
        "/api/fetch-transaction?address=0xF0F21D6AAc534345E16C2DeE12c3998A4e32e789&type=all";
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        setTransaction(data); // Assuming the API returns a single transaction object
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const [isERC20, setIsERC20] = useState(false);
  const defaultTokenDetails = {
    name: null,
    symbol: null,
    decimals: null,
    balance: null,
  };
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);
  const signTransaction = async () => {
    // if (recipient === "" || amount === "") {
    //   console.log("Please Enter Details");
    //   return;
    // }
    // if (!isValidAddress(recipient)) {
    //   console.log("invalid Ethereum Address");
    //   return;
    // }
    // if (!isValidValue(amount)) {
    //   console.log("Invalid Amount");
    //   return;
    // }
    // const { ethereum } = window;
    // if (!ethereum) {
    //   throw new Error("Metamask is not installed, please install!");
    // }
    // let amount = parseUnits(transaction.amount, tokenDetails.decimals);
    // console.log(amount);
    console.log("sign");

    try {
      const client = createWalletClient({
        chain: {
          id: 1029, // BTTC Donau testnet chain ID
          rpcUrls: {
            public: "https://pre-rpc.bittorrentchain.io/",
            websocket: "https://pre-rpc.bittorrentchain.io/", // WebSocket URL (optional)
          },
        },
        transport: custom(window.ethereum),
      });

      const signature = await client.signTypedData({
        account: address,
        domain: {
          name: "HandshakeTokenTransfer",
          version: "1",
          chainId: "1029",
          verifyingContract: "0xf6f9791c7eE8CbE0eD5876B653e6F195798eA9d2",
        },
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          initiateTransaction: [
            { name: "sender", type: "address" },
            { name: "receiver", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "tokenName", type: "string" },
          ],
        },
        primaryType: "initiateTransaction",
        message: {
          sender: address,
          receiver: transaction.receiver,
          amount: 1,
          tokenName: tokenDetails.symbol,
        },
      });
      const currentDate = new Date();
      console.log("Signature:", signature);
      if (signature) {
        const userData = {
          senderAddress: address,
          receiverAddress: transaction.receiver,
          amount: 1,
          tokenAddress: transaction.token,
          senderSignature: signature,
          receiverSignature: "",
          status: "inititated",
          tokenName: tokenDetails.symbol,
          initiateDate: currentDate,
        };
        console.log(userData);
        try {
          console.log("entered into try block");
          let result = await fetch(`api/store-transaction`, {
            method: "POST",
            body: JSON.stringify(userData),
          });
          const response = await result.json();
          // console.log(response.message);
        } catch (error) {
          console.error("Error signing transaction:", error);
          throw error;
        }
      }
    } catch (error) {
      console.error("Error signing transaction:", error);
      throw error;
    }
  };
  console.log(params?.id);
  let id = params?.id ? params.id : 0;
  console.log(transactions);
  const transaction = transactions.find(
    (transaction) => transaction.TransactionId == id
  );

  if (!transaction) {
    // Handle case when transaction is not found
    return <div>Transaction not found</div>;
  }
  return (
    <>
      <Header />
      <div className="container-parent">
        <h1 className="reqheader">Transaction Details</h1>
        <div className="container">
          <div className="modal-content2">
            <div className="my-6 flex flex-col item-center justify-center w-full">
              <div className="w-full inputParent">
                <label>ID:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction.TransactionId}
                  readOnly
                />
              </div>
              <div className="w-full inputParent">
                <label>Sender:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction.senderAddress}
                  readOnly
                />
              </div>
              <div className="w-full inputParent">
                <label>Receiver:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction.receiverAddress}
                  readOnly
                />
              </div>
              <div className="w-full inputParent">
                <label>Token:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction.tokenName}
                  readOnly
                />
              </div>
              <div className="w-full inputParent">
                <label>Amount:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction.amount}
                  readOnly
                />
              </div>
              <div className="w-full inputParent">
                <label>Date:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction.initiateDate}
                  readOnly
                />
              </div>
              <div className="w-full inputParent">
                <button
                  className="approveBtn"
                  onClick={() => signTransaction()}
                >
                  Approve
                </button>
              </div>
            </div>
            {/* Add more fields as needed */}
          </div>
        </div>
      </div>
    </>
  );
}
