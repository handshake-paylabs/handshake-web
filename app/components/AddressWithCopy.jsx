import React, { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi"; // Import copy and check icons from react-icons

const AddressWithCopy = ({ address }) => {
  const [isCopied, setIsCopied] = useState(false); // State to track copy status

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setIsCopied(true);

    // Reset the copy status after 3 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <div className="flex items-center">
      <span className="mr-2">{truncatedAddress}</span>
      {isCopied ? (
        <FiCheck className="text-green-500" />
      ) : (
        <FiCopy className="cursor-pointer" onClick={copyAddress} />
      )}
    </div>
  );
};

export default AddressWithCopy;
