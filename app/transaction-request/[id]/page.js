"use client";

import Header from "@/app/components/header/Header";
import { useEffect, useState } from "react";

export default function TransactionRequestDetails({ params }) {
  const [transactions, setTransaction] = useState([]);
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
      {params?.id}
      <div className="container">
        <h1 className="py-4">Transaction Details</h1>
        <div className="modal-content2">
          <div className="my-6 flex flex-col item-center justify-center w-full">
            <div className="w-full inputParent">
              <label>ID:</label>
              <input type="text" value={transaction.TransactionId} readOnly />
            </div>
            <div className="w-full inputParent">
              <label>Sender:</label>
              <input type="text" value={transaction.sender} readOnly />
            </div>
            <div className="w-full inputParent">
              <label>Receiver:</label>
              <input type="text" value={transaction.receiver} readOnly />
            </div>
            <div className="w-full inputParent">
              <label>Token:</label>
              <input type="text" value={transaction.token} readOnly />
            </div>
            <div className="w-full inputParent">
              <label>Amount:</label>
              <input type="text" value={transaction.amount} readOnly />
            </div>
            <div className="w-full inputParent">
              <label>Date:</label>
              <input type="text" value={transaction.date} readOnly />
            </div>
            <div className="w-full inputParent">
              <button>Approve</button>
              <button>Reject</button>
              <button>Send</button>
            </div>
          </div>
          {/* Add more fields as needed */}
        </div>
      </div>
    </>
  );
}
