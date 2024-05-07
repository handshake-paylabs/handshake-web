"use client";

import React, { useState } from "react";
import "./Modal.css";

const TransactionReqActionModal = ({ onClose }) => {
  const [transaction, setTransaction] = useState({});

  // Handle onchange event for input fields and update the transaction state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction({ ...transaction, [name]: value });
  };
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-card">
          <h1 className="text-center">Send Transaction</h1>
          <div className="my-6 flex flex-col item-center justify-center w-full">
            <div className="w-full inputParent">
              <label>Receiver:</label>
              <input
                type="text"
                name="receiver"
                placeholder="Receiver's Address"
                value={transaction.receiver || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full inputParent">
              <label>Token:</label>
              <input
                type="text"
                name="token"
                placeholder="Token Address"
                value={transaction.token || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full inputParent">
              <label>Amount:</label>
              <input
                type="text"
                name="amount"
                placeholder="Enter Amount"
                value={transaction.amount || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-full inputParent">
              <button className="sendReqBtn" onClick={onClose}>
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
