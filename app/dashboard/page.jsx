"use client";
import { useAccount } from "wagmi";
import TransactionReqList from "../components/TransactionReqList";
import Web3Avatar from "web3-avatar";
import { useEffect } from "react";
import Avatar from "@devneser/gradient-avatar";
import Header from "../components/header/Header";
export default function Dashboard() {
  const { address } = useAccount();
  const someElement = document.querySelector("#avatar");
  //   useEffect(() => {
  //     createWeb3Avatar(someElement, "0x11Ed0AC7D6142481E459B6e5d4bfB5646277796f");
  //   }, [someElement]);
  return (
    <>
      <Header />
      <TransactionReqList />
    </>
  );
}
