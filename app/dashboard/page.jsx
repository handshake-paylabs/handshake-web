"use client";

import Web3Avatar from "web3-avatar";
import { useEffect } from "react";
import Avatar from "@devneser/gradient-avatar";
import Header from "../components/header/Header";
import TransactionTypes from "../components/TransactionTypes";
export default function Dashboard() {
  return (
    <div className="main-dashboard">
      <Header />
      <TransactionTypes />
    </div>
  );
}
