// components/TransactionAccordion.js
"use client";
import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import { Grid } from "@mui/material";
import { BorderBottom } from "@mui/icons-material";
import handshakeABI from "../../transaction-queue/[id]/Handshake.json";
import {
  createPublicClient,
  createWalletClient,
  custom,
  formatUnits,
  http,
} from "viem";
import { timeAgo } from "@/app/utils/formateDate";
import TimeAgoComponent from "../TimeAgoComponent";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import SingleTranscationAccordianExpanded from "../SingleTranscationAccordianExpanded";

const CustomAccordion = styled(Accordion)({
  margin: "10px 0",
  marginBottom: "20px",
  "&:before": {
    display: "none",
  },

  boxShadow: "none",
  borderRadius: "10px",
  "&.Mui-expanded": {
    border: "1px solid rgb(176, 255, 201)",
    background: "rgb(239, 255, 244)",
  },
  "&.MuiAccordion-root": {
    borderRadius: "10px",
  },
});

const CustomAccordionSummary = styled(AccordionSummary)({
  backgroundColor: "white",
  padding: "10px 20px",
  borderRadius: "10px",
  border: "1px solid #dcdee0",
  "&.MuiAccordionSummary-content": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  "&:hover": {
    border: "1px solid rgb(176, 255, 201)",
    background: "rgb(239, 255, 244)",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
  },
  "&.Mui-expanded": {
    border: "none",
    borderBottom: "1px solid #dcdee0",
    background: "rgb(239, 255, 244)",
    borderTopRightRadius: "10px",
    borderTopLeftRadius: "10px",
    borderBottomRightRadius: "0",
    borderBottomLeftRadius: "0",
  },
});

const CustomAccordionDetails = styled(AccordionDetails)({
  backgroundColor: "white",
  borderBottomRightRadius: "10px",
  borderBottomLeftRadius: "10px",
});
const CustomGridItem = styled(Grid)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const TransactionAccordion = ({ transactions }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();
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

  const cancelTransaction = async (transaction) => {
    const currentDate = new Date();
    const userData = {
      TransactionId: transaction.TransactionId, // This should be passed in the request to identify the transaction to update
      receiverSignature: "rejection-no signature",
      status: "rejected",
      approveDate: currentDate,
    };
    console.log(userData);
    try {
      console.log("entered into try block");
      let result = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}api/store-transaction`,
        {
          method: "PUT",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json", // This header is crucial for sending JSON data
          },
        }
      );
      const response = await result.json();

      setIsLoading(false);
      toast.success("Rejected Sucessfully");
    } catch (error) {
      console.error("Error Rejecting transaction:", error);
      setIsLoading(false);
      toast.error("Error while rejecting transaction");
    }
  };
  const executeTransaction = async (transaction) => {
    setIsLoading(true);
    console.log(transaction.amount);
    try {
      const TransactionDetails = [
        transaction.nonce,
        transaction.senderAddress,
        transaction.receiverAddress,
        transaction.amount,
        transaction.tokenAddress !== ""
          ? transaction.tokenAddress
          : "0xeD14905ddb05D6bD36De98aCAa8D7AaF01851E5A",
        transaction.tokenName,
      ];

      console.log(TransactionDetails);

      let functionCalled = "";
      if (transaction.tokenAddress === "") {
        functionCalled = "transferNative";
      } else {
        functionCalled = "transferTokens";
        let approve = await approveToken(
          transaction.amount,
          transaction.tokenAddress,
          address
        );
        console.log(approve);
      }

      const { request } = await publicClient.simulateContract({
        account: address,
        address: "0xeD14905ddb05D6bD36De98aCAa8D7AaF01851E5A",
        abi: handshakeABI,
        functionName: functionCalled,
        args: [
          transaction.senderSignature,
          transaction.receiverSignature,
          TransactionDetails,
        ],
        ...(functionCalled === "transferNative"
          ? { value: transaction.amount }
          : {}),
        gasLimit: 3000000, // Specify the gas limit here
      });

      const execute = await walletClient.writeContract(request);
      const currentDate = new Date();

      if (execute) {
        const userData = {
          TransactionId: transaction.TransactionId, // This should be passed in the request to identify the transaction to update
          status: "completed",
          transectionDate: currentDate,
        };
        console.log(userData);
        try {
          console.log("entered into try block");
          let result = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}api/payment-completed`,
            {
              method: "PUT",
              body: JSON.stringify(userData),
              headers: {
                "Content-Type": "application/json", // This header is crucial for sending JSON data
              },
            }
          );
          const response = await result.json();
          // console.log(response.message);
        } catch (error) {
          console.error("Error signing transaction:", error);
          // throw error;
        }
        toast.success("Execution sucessfull");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Execution failed");
      console.log(error);
    }
  };
  const handleActionButtonClick = async (transaction) => {
    if (
      transaction.status === "approved" &&
      transaction.senderAddress === address
    ) {
      await executeTransaction(transaction);
    }
  };
  return (
    <div className="accordian-parent">
      {transactions.length > 0 &&
        transactions.map((transaction, index) => (
          <CustomAccordion key={index} classes={"muiTopContainer"}>
            <CustomAccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 12, sm: 10, md: 10 }}
              >
                <CustomGridItem item xs={2} sm={1} md={1}>
                  <div>{transaction.nonce}</div>
                </CustomGridItem>
                <CustomGridItem item xs={2} sm={2} md={2}>
                  <div className="senderOrReceiverOnAccordian">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9.56854 5.0101H6.9697C6.41462 5.0101 5.96465 4.56012 5.96465 4.00505C5.96465 3.44998 6.41462 3 6.9697 3H11.9949C12.2725 3 12.5237 3.11249 12.7056 3.29437C12.8875 3.47625 13 3.72751 13 4.00505V9.0303C13 9.58538 12.55 10.0354 11.9949 10.0354C11.4399 10.0354 10.9899 9.58538 10.9899 9.0303V6.43146L4.71573 12.7056C4.32323 13.0981 3.68687 13.0981 3.29437 12.7056C2.90188 12.3131 2.90188 11.6768 3.29437 11.2843L9.56854 5.0101Z"
                        fill="#F02525"
                      />
                    </svg>
                    Send
                  </div>
                </CustomGridItem>
                <CustomGridItem item xs={2} sm={2} md={2}>
                  <div style={{ fontWeight: "700" }}>
                    {formatUnits(transaction.amount, transaction.decimals)}
                    <span style={{ marginLeft: "10px" }}>
                      {transaction.tokenName}
                    </span>
                  </div>
                </CustomGridItem>
                <CustomGridItem item xs={2} sm={2} md={2}>
                  <div style={{ color: "#a1a3a7" }}>
                    <TimeAgoComponent timestamp={transaction.initiateDate} />
                  </div>
                </CustomGridItem>
                <CustomGridItem item xs={2} sm={1} md={1}>
                  <div className="accordian-txn-status">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16px"
                      viewBox="0 0 24 24"
                      width="16px"
                      fill="#028d4c"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path d="M9 16.17L5.53 12.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L9 16.17z" />
                    </svg>
                    {transaction.status === "inititated"
                      ? "1 out of 3"
                      : transaction.status === "approved"
                      ? "2 out of 3"
                      : transaction.status === "completed"
                      ? "3 out of 3"
                      : "0 out of 3"}
                  </div>
                </CustomGridItem>
                <CustomGridItem item xs={2} sm={2} md={2}>
                  <button
                    className={
                      address &&
                      transaction.senderAddress === address &&
                      transaction.status === "inititated"
                        ? "waiting-action-btn action-btn"
                        : transaction.status === "approved"
                        ? "execute-action-btn action-btn"
                        : "waiting-action-btn action-btn"
                    }
                    onClick={() => handleActionButtonClick(transaction)}
                  >
                    {isLoading
                      ? "Loading..."
                      : address &&
                        transaction.senderAddress === address &&
                        transaction.status === "inititated"
                      ? "Waiting"
                      : transaction.status === "approved"
                      ? "Execute"
                      : "waiting"}
                  </button>
                </CustomGridItem>
              </Grid>
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              <SingleTranscationAccordianExpanded transaction={transaction} />
            </CustomAccordionDetails>
          </CustomAccordion>
        ))}
    </div>
  );
};

export default TransactionAccordion;
