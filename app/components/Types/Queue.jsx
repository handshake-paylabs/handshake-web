import React, { useEffect } from "react";
import AddressWithCopy from "../../quickaccess/AddressWithCopy";
import Blockies from "react-blockies";
import { useRouter } from "next/navigation";
import { formatUnits } from "viem";

function Queue({ transactions, address, activeTab }) {
  const router = useRouter();
  console.log(transactions);

  useEffect(() => {
    // Additional logic can be added here if needed
  }, [transactions]);

  return (
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

          {transactions.length > 0 && (
            <>
              {/* Render subsequent transactions with message */}
              {transactions.map((transaction, index) => (
                <tr key={transaction.TransactionId}>
                  <td
                    data-th="Arrow"
                    className={`${
                      transaction.senderAddress === address
                        ? "arrow-outgoing"
                        : "arrow-incoming"
                    }`}
                  ></td>
                  <td data-th="No.">{index + 1}</td>
                  <td data-th="Sender">
                    <div className="table-user">
                      <Blockies
                        className="table-user-gradient"
                        seed={
                          transaction.senderAddress
                            ? transaction.senderAddress
                            : null
                        }
                        size={8}
                        scale={3}
                      />

                      <div className="table-user-details">
                        {transaction.senderAddress === address ? (
                          "You"
                        ) : (
                          <AddressWithCopy
                            address={transaction.senderAddress}
                          />
                        )}
                      </div>
                    </div>
                  </td>
                  <td data-th="Receiver">
                    <div className="table-user">
                      <Blockies
                        className="table-user-gradient"
                        seed={
                          transaction.receiverAddress
                            ? transaction.receiverAddress
                            : null
                        }
                        size={8}
                        scale={3}
                      />
                      <div className="table-user-details">
                        {transaction.receiverAddress === address ? (
                          "You"
                        ) : (
                          <AddressWithCopy
                            address={transaction.receiverAddress}
                          />
                        )}
                      </div>
                    </div>
                  </td>
                  <td data-th="Amount">
                    {formatUnits(transaction.amount, transaction.decimals)}
                  </td>
                  <td data-th="Token">{transaction.tokenName}</td>
                  <td data-th="Date">{transaction.initiateDate}</td>
                  <td data-th="Status">
                    <div
                      className={`status status-${transaction?.status.toLowerCase()}`}
                    >
                      {transaction?.status}
                    </div>
                  </td>
                  <td data-th="Action">
                    <button
                      onClick={() =>
                        router.push(
                          `/transaction-queue/${transaction.TransactionId}`
                        )
                      }
                      className="text-indigo-500 hover:text-indigo-800"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </>
          )}
          {transactions.length === 0 && (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Queue;
