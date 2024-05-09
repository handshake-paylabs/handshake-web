"use client";

import React, { useEffect, useState } from "react";
import "./Modal.css";
import { getTokenDetails } from "@/app/quickaccess/getTokenDetails";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { createWalletClient, custom } from "viem";

const TransactionReqActionModal = ({ onClose }) => {
  const { address, isConnected } = useAccount();

  const [transaction, setTransaction] = useState({
    sender: "",
    receiver: "",
    token: "",
    amount: "",
  });
  const [isERC20, setIsERC20] = useState(false);
  const defaultTokenDetails = {
    name: "",
    symbol: "",
    decimals: "",
    balance: "",
  };

  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);

  // Handle onchange event for input fields and update the transaction state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction({ ...transaction, [name]: value });
  };

  const loadTokenDetails = async () => {
    console.log(transaction.token, address);
    console.log(await getTokenDetails(transaction.token));
    const getToken = await getTokenDetails(transaction.token);
    if (getToken !== null) {
      setTokenDetails(getToken);
    }
  };

  useEffect(() => {
    if (!isERC20) {
      setTokenDetails(defaultTokenDetails);
      setTransaction({ ...transaction, ["token"]: "" });
    }
  }, [isERC20]);

  const handleCheckboxChange = () => {
    setIsERC20(!isERC20);
  };

  const signTransaction = async () => {
    if (transaction.receiver === "" || transaction.amount === "") {
      console.log("Please Enter Details");
      return;
    }

    const { ethereum } = window;
    if (!ethereum) {
      throw new Error("Metamask is not installed, please install!");
    }
    // let amount = parseUnits(transaction.amount, tokenDetails.decimals);
    console.log(transaction.amount);

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

      const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/latest-id/`;

      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      let transactionId = parseInt(data.TransactionId) + 1;
      console.log(transactionId);
      const signature = await client.signTypedData({
        account: address,
        domain: {
          name: "HandshakeTokenTransfer",
          version: "1",
          chainId: "1029",
          verifyingContract: "0x0856Ab13d8BFC644c1096554Bd23779dc42e4cDE",
        },
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          initiateTransaction: [
            { name: "id", type: "uint256" },
            { name: "sender", type: "address" },
            { name: "receiver", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "tokenName", type: "string" },
          ],
        },
        primaryType: "initiateTransaction",
        message: {
          id: transactionId,
          sender: address,
          receiver: transaction.receiver,
          amount: transaction.amount,
          tokenName: tokenDetails.symbol !== "" ? tokenDetails.symbol : "BTTC",
        },
      });
      const currentDate = new Date();
      console.log("Signature:", signature);
      if (signature) {
        const userData = {
          senderAddress: address,
          receiverAddress: transaction.receiver,
          amount: transaction.amount,
          tokenAddress: transaction.token,
          senderSignature: signature,
          receiverSignature: "",
          status: "inititated",
          tokenName: tokenDetails.symbol !== "" ? tokenDetails.symbol : "BTTC",
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
          // throw error;
        }
      }
    } catch (error) {
      console.error("Error signing transaction:", error);
      // throw error;
    }
  };
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-card">
          <div className="flex justify-end cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
              onClick={onClose}
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
            </svg>
          </div>
          <h1 className="text-left">Send Transaction</h1>

          <div className="my-6 flex flex-col item-center justify-center w-full">
            <div className="w-full inputParent">
              <label>Receiver Address</label>
              <input
                type="text"
                name="receiver"
                placeholder="Receiver's Address"
                className="text-black"
                value={transaction.receiver || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-full inputParent">
              <label>Type:</label>
              <div
                className="flex items-center cursor-pointer inputDiv"
                onClick={handleCheckboxChange}
              >
                <input
                  type="checkbox"
                  checked={isERC20}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 checkmark text-black">
                  Send ERC-20 Token
                </span>
              </div>
            </div>

            {isERC20 && (
              <>
                <div className="w-full inputParent">
                  <label>Token:</label>
                  <input
                    type="text"
                    name="token"
                    placeholder="Token Address"
                    className="text-black"
                    value={transaction.token || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <button onClick={loadTokenDetails} className="load-token">
                  Load Token
                </button>
              </>
            )}
            {tokenDetails.name && (
              <div className="token-details text-left flex flex-col px-4">
                <span className="text-slate-600 text-base my-4 ">
                  Name:{" "}
                  <span className="text-black text-xl font-bold">
                    {tokenDetails.name}
                  </span>{" "}
                </span>
                <span className="text-slate-600 text-base my-4">
                  Symbol:{" "}
                  <span className="text-black text-xl font-bold">
                    {tokenDetails.symbol}
                  </span>
                </span>
                <span className="text-slate-600 text-base my-4">
                  Total Balance:{" "}
                  <span className="text-black text-xl font-bold">
                    {tokenDetails.balance
                      ? `${formatUnits(
                          tokenDetails.balance,
                          tokenDetails.decimals
                        )} ${tokenDetails.symbol}`
                      : null}
                  </span>
                </span>
              </div>
            )}

            <div className="w-full inputParent">
              <label>Amount:</label>
              <input
                type="text"
                name="amount"
                placeholder="Enter Amount"
                className="text-black"
                value={transaction.amount || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-full inputParent">
              <button className="sendReqBtn" onClick={signTransaction}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionReqActionModal;
