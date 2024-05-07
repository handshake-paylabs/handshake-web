"use client";
import React, { useEffect, useState } from "react";
import "./TransactionReqList.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import TransactionReqActionModal from "./Modal/TransactionReqActionModal";
import AddressWithCopy from "./AddressWithCopy";
import { useRouter } from "next/navigation";
import Blockies from "react-blockies";
import { useAccount, useBalance } from "wagmi";
// Sample data
export const transactions = [
  {
    id: 1,
    sender: "0x0A1b2C3d4E5F678901234567890123456789012",
    receiver: "0x5A6b7C8d9E0F1234567890123456789012345678",
    amount: "100",
    token: "BTTC",
    date: "2024-05-07",
    status: "Approved",
    type: "initiated",
  },
  {
    id: 2,
    sender: "0x5A6b7C8d9E0F1234567890123456789012345678",
    receiver: "0x0A1b2C3d4E5F678901234567890123456789012",
    amount: "10000",
    token: "BTTC",
    date: "2024-05-06",
    status: "Pending",
    type: "received",
  },
  {
    id: 3,
    sender: "0x0A1b2C3d4E5F678901234567890123456789012",
    receiver: "0x5A6b7C8d9E0F1234567890123456789012345678",
    amount: "5000",
    token: "SHAKE",
    date: "2024-05-05",
    status: "Completed",
    type: "initiated",
  },
  {
    id: 4,
    sender: "0x5A6b7C8d9E0F1234567890123456789012345678",
    receiver: "0x0A1b2C3d4E5F678901234567890123456789012",
    amount: "1000",
    token: "SHAKE",
    date: "2024-05-04",
    status: "Rejected",
    type: "received",
  },
];

const TransactionReqList = () => {
  const { address } = useAccount();

  const balance = useBalance({
    address: address ? address : "",
  });

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const address = "0x5A6b7C8d9E0F1234567890123456789012345678";
  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const fetchSVG = async (value) => {
    try {
      // Replace with the desired value
      const response = await fetch(`/api/gradient?value=${value}`);
      const svgData = await response.text();
      return svgData;
    } catch (error) {
      console.error("Error fetching SVG:", error);
    }
  };
  const filteredTransactions =
    activeTab === "all"
      ? transactions
      : activeTab === "initiated"
      ? transactions.filter((transaction) => transaction.sender === address)
      : activeTab === "received"
      ? transactions.filter((transaction) => transaction.receiver === address)
      : transactions;
  return (
    <>
      <div className="container-parent">
        <h1 className="reqheader">Transaction Requests</h1>
        <div className=" container ">
          <div className="flex items-center justify-between my-4 px-4">
            <div className="balance text-black">
              Balance: {balance?.data?.formatted} BTT
            </div>
            <button className="initiateBtn" onClick={openModal}>
              Initiate Request
            </button>
          </div>
          <div className="table-tabs px-4">
            <div className="flex justify-left space-x-4 ">
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "all" ? "activeTabBtn" : "inactiveBtn"
                }`}
                onClick={() => handleTabChange("all")}
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "initiated" ? "activeTabBtn" : "inactiveBtn"
                }`}
                onClick={() => handleTabChange("initiated")}
              >
                Initiated
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "received" ? "activeTabBtn" : "inactiveBtn"
                }`}
                onClick={() => handleTabChange("received")}
              >
                Received
              </button>
            </div>
          </div>
          <div className="overflow-x-auto mt-8 w-full mb-8">
            <table className="rwd-table w-full">
              <tbody>
                <tr>
                  <th>.</th>
                  <th>No.</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Amount</th>
                  <th>Token</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td
                        data-th="Arrow"
                        className={`${
                          transaction.sender === address
                            ? "arrow-outgoing"
                            : "arrow-incoming"
                        }`}
                      ></td>
                      <td data-th="No.">{transaction.id}</td>
                      <td data-th="Sender">
                        <div className="table-user">
                          <Blockies
                            className="table-user-gradient"
                            seed={
                              transaction.sender ? transaction.sender : null
                            }
                            size={8}
                            scale={3}
                          />

                          <div className="table-user-details">
                            {transaction.sender === address ? (
                              "You"
                            ) : (
                              <AddressWithCopy address={transaction.sender} />
                            )}
                          </div>
                        </div>
                      </td>
                      <td data-th="Receiver">
                        <div className="table-user">
                          <Blockies
                            className="table-user-gradient"
                            seed={
                              transaction.receiver ? transaction.receiver : null
                            }
                            size={8}
                            scale={3}
                          />
                          <div className="table-user-details">
                            {transaction.receiver === address ? (
                              "You"
                            ) : (
                              <AddressWithCopy address={transaction.receiver} />
                            )}
                          </div>
                        </div>
                      </td>
                      <td data-th="Amount">{transaction.amount}</td>
                      <td data-th="Token">
                        {transaction.token === "BTTC" ||
                        transaction.token === "SHAKE"
                          ? transaction.token
                          : "Unknown"}
                      </td>
                      <td data-th="Date">{transaction.date}</td>
                      <td data-th="Status">
                        <div
                          className={`status status-${transaction.status.toLowerCase()}`}
                        >
                          {transaction.status}
                        </div>
                      </td>
                      <td data-th="Action">
                        <button
                          onClick={() =>
                            router.push(
                              `/transaction-request/${transaction.id}`
                            )
                          }
                          className="text-indigo-500 hover:text-indigo-800"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <SkeletonTheme baseColor="#202020" highlightColor="#444">
                    <p>
                      <Skeleton count={5} />
                    </p>
                  </SkeletonTheme>
                )}
              </tbody>
            </table>
          </div>

          {isModalOpen && <TransactionReqActionModal onClose={closeModal} />}
        </div>
      </div>
    </>
  );
};

export default TransactionReqList;
