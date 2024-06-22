import React from "react";
import Blockies from "react-blockies";
import AddressWithCopy from "../../quickaccess/AddressWithCopy";
import { useRouter } from "next/navigation";
import { formatUnits } from "viem";

function Received({ transactions, address, activeTab }) {
  const router = useRouter();

  return (
    <div>
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
            {transactions.length > 0
              ? transactions.map((transaction, index) => (
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
                      {" "}
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
                            `/transaction-received/${transaction.TransactionId}`
                          )
                        }
                        className="text-indigo-500 hover:text-indigo-800"
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Received;
